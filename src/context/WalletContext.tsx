import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { BrowserProvider, JsonRpcSigner, formatEther, JsonRpcProvider, Wallet as EthersWallet } from "ethers";
import { Provider as MSTProvider, Constants as MSTConstants } from "@mstblockchain/mst-sdk";
import { ConnectWalletModal } from "../components/ConnectWalletModal";
import { scanNFTAssets } from "../lib/nftScanner";

export type WalletType = "bridgekey" | "injected" | null;

export interface WalletContextType {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnecting: boolean;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  signer: any;
  provider: any;
  mstProvider: MSTProvider;
  walletType: WalletType;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  connectWallet: (preferredType?: "bridgekey" | "injected") => Promise<string | null>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<boolean>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const MST_TESTNET_CHAIN_ID = 91562037;
const MST_TESTNET_CHAIN_ID_HEX = "0x5752035";

// Default MST SDK Provider & Ethers RPC Provider
const defaultMstProvider = new MSTProvider(MSTConstants.DEFAULT_RPC_URL);
const publicJsonRpcProvider = new JsonRpcProvider(MSTConstants.DEFAULT_RPC_URL);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("zx_wallet_approved") === "true") {
        return localStorage.getItem("zx_connected_address");
      }
    } catch {}
    return null;
  });
  const [chainId, setChainId] = useState<number | null>(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("zx_wallet_approved") === "true") {
        return MST_TESTNET_CHAIN_ID;
      }
    } catch {}
    return null;
  });
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<any>(publicJsonRpcProvider);
  const [walletType, setWalletType] = useState<WalletType>(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("zx_wallet_approved") === "true") {
        return (localStorage.getItem("zx_connected_type") as WalletType) || null;
      }
    } catch {}
    return null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInjectedProvider = (preferred?: "bridgekey" | "injected") => {
    if (typeof window === "undefined") return null;
    const w = window as any;

    if (preferred === "bridgekey") {
      return w.bridgekey || w.ethereum || null;
    }
    return w.bridgekey || w.ethereum || null;
  };

  const updateBalance = useCallback(async (addr: string, prov: any) => {
    try {
      const bal = await prov.getBalance(addr);
      setBalance(parseFloat(formatEther(bal)).toFixed(4));
    } catch (e) {
      console.error("Error fetching balance:", e);
    }
  }, []);

  const switchNetwork = async (): Promise<boolean> => {
    const ethereum = getInjectedProvider();
    if (!ethereum || !ethereum.request) return false;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MST_TESTNET_CHAIN_ID_HEX }],
      });
      setChainId(MST_TESTNET_CHAIN_ID);
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MST_TESTNET_CHAIN_ID_HEX,
                chainName: "MST Testnet",
                nativeCurrency: {
                  name: "MSTC",
                  symbol: "tMSTC",
                  decimals: 18,
                },
                rpcUrls: [MSTConstants.DEFAULT_RPC_URL],
                blockExplorerUrls: ["https://testnet.mstscan.com"],
              },
            ],
          });
          setChainId(MST_TESTNET_CHAIN_ID);
          return true;
        } catch (addError) {
          console.error("Error adding MST Testnet:", addError);
          return false;
        }
      }
      console.error("Error switching to MST Testnet:", switchError);
      return false;
    }
  };

  const connectWallet = async (
    preferredType?: "bridgekey" | "injected"
  ): Promise<string | null> => {
    // If no type specified and no injected provider available, open modal
    const injected = getInjectedProvider(preferredType);
    if (!preferredType && !injected) {
      setIsModalOpen(true);
      return null;
    }

    setIsConnecting(true);

    try {
      // Real Injected Wallet (BridgeKey or Browser EVM)
      const ethereum = injected;
      if (!ethereum) {
        setIsModalOpen(true);
        throw new Error("No BridgeKey or EVM wallet detected. Please install BridgeKey extension.");
      }

      // Use 'any' network to prevent network change errors in ethers v6
      const browserProvider = new BrowserProvider(ethereum, "any");
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts selected");
      }

      const network = await browserProvider.getNetwork();
      let currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      if (currentChainId !== MST_TESTNET_CHAIN_ID) {
        const switched = await switchNetwork();
        if (switched) {
          currentChainId = MST_TESTNET_CHAIN_ID;
          setChainId(MST_TESTNET_CHAIN_ID);
        }
      }

      const activeSigner = await browserProvider.getSigner();
      const accountAddress = accounts[0];

      setProvider(browserProvider);
      setSigner(activeSigner);
      setAddress(accountAddress);
      setWalletType(preferredType || "bridgekey");

      await updateBalance(accountAddress, browserProvider);
      localStorage.setItem("zx_connected_type", preferredType || "bridgekey");
      localStorage.setItem("zx_connected_address", accountAddress);
      localStorage.setItem("zx_wallet_approved", "true");
      scanNFTAssets(accountAddress, browserProvider);
      return accountAddress;
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setProvider(publicJsonRpcProvider);
    setBalance("0");
    setChainId(null);
    setWalletType(null);
    localStorage.removeItem("zx_connected_type");
    localStorage.removeItem("zx_connected_address");
    localStorage.removeItem("zx_wallet_approved");
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!signer) throw new Error("Wallet not connected");
    if (typeof signer.signMessage === "function") {
      return await signer.signMessage(message);
    }
    throw new Error("Signer does not support signMessage");
  };

  // Robust silent auto-reconnect on mount / reload
  useEffect(() => {
    const savedType = localStorage.getItem("zx_connected_type") as WalletType;
    const isApproved = localStorage.getItem("zx_wallet_approved") === "true";

    if (!savedType || !isApproved) return;

    let attempts = 0;
    const maxAttempts = 20; // poll up to 2 seconds for extension injection
    let intervalId: any = null;

    const trySilentReconnect = async () => {
      attempts++;
      const ethereum = getInjectedProvider(savedType === "bridgekey" ? "bridgekey" : "injected");
      if (ethereum) {
        clearInterval(intervalId);
        try {
          const browserProvider = new BrowserProvider(ethereum, "any");
          // eth_accounts checks authorized addresses without triggering user popups
          const accounts: string[] = await browserProvider.send("eth_accounts", []);
          if (accounts && accounts.length > 0) {
            const activeSigner = await browserProvider.getSigner();
            const accountAddress = accounts[0];
            const network = await browserProvider.getNetwork();
            let currentChainId = Number(network.chainId);
            setChainId(currentChainId);
            setProvider(browserProvider);
            setSigner(activeSigner);
            setAddress(accountAddress);
            setWalletType(savedType);
            await updateBalance(accountAddress, browserProvider);
            localStorage.setItem("zx_connected_address", accountAddress);
            scanNFTAssets(accountAddress, browserProvider);
          }
        } catch (err) {
          console.warn("[Wallet] Silent reconnect notice:", err);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    };

    trySilentReconnect();
    intervalId = setInterval(trySilentReconnect, 100);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateBalance]);

  // Listen for provider events
  useEffect(() => {
    const ethereum = getInjectedProvider();
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(accounts[0]);
          if (provider) updateBalance(accounts[0], provider);
        }
      };

      const handleChainChanged = (newChainId: string) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [provider, updateBalance]);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === MST_TESTNET_CHAIN_ID;

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        balance,
        isConnecting,
        isConnected,
        isCorrectNetwork,
        signer,
        provider,
        mstProvider: defaultMstProvider,
        walletType,
        openConnectModal: () => setIsModalOpen(true),
        closeConnectModal: () => setIsModalOpen(false),
        connectWallet,
        disconnectWallet,
        switchNetwork,
        signMessage,
      }}
    >
      {children}
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={connectWallet}
        isConnecting={isConnecting}
        hasExtension={!!getInjectedProvider()}
      />
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
