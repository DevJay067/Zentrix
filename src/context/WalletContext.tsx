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

export type WalletType = "bridgekey" | "injected" | "demo-client" | "demo-freelancer" | null;

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
  connectWallet: (preferredType?: "bridgekey" | "injected" | "demo-client" | "demo-freelancer") => Promise<string | null>;
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

// Demo testnet addresses
const DEMO_CLIENT_ADDR = "0x7FC1d02922d4865fd53De59697407a42e64d1Cad";
const DEMO_FREELANCER_ADDR = "0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<any>(publicJsonRpcProvider);
  const [walletType, setWalletType] = useState<WalletType>(null);
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
    preferredType?: "bridgekey" | "injected" | "demo-client" | "demo-freelancer"
  ): Promise<string | null> => {
    // If no type specified and no injected provider available, open modal
    const injected = getInjectedProvider();
    if (!preferredType && !injected) {
      setIsModalOpen(true);
      return null;
    }

    setIsConnecting(true);

    try {
      // 1. Instant Demo Wallets
      if (preferredType === "demo-client" || preferredType === "demo-freelancer") {
        const demoAddr = preferredType === "demo-client" ? DEMO_CLIENT_ADDR : DEMO_FREELANCER_ADDR;
        setAddress(demoAddr);
        setChainId(MST_TESTNET_CHAIN_ID);
        setWalletType(preferredType);
        setProvider(publicJsonRpcProvider);

        // Demo simulated signer that passes testnet rpc
        const mockSigner = {
          getAddress: async () => demoAddr,
          provider: publicJsonRpcProvider,
          signMessage: async (msg: string) => {
            return "0x" + "1".repeat(130);
          },
          sendTransaction: async (tx: any) => {
            return {
              hash: "0x03f4a7c32f86c9eb639ad210070c1555bf88133b7ab4957160531828956650e0",
              wait: async () => ({ status: 1 }),
            };
          },
        };
        setSigner(mockSigner);

        await updateBalance(demoAddr, publicJsonRpcProvider);
        localStorage.setItem("zx_connected_type", preferredType);
        return demoAddr;
      }

      // 2. Real Injected Wallet (BridgeKey or Browser EVM)
      const ethereum = getInjectedProvider(preferredType === "bridgekey" ? "bridgekey" : "injected");
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
      localStorage.setItem("zx_connected_type", preferredType || "injected");
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
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!signer) throw new Error("Wallet not connected");
    if (typeof signer.signMessage === "function") {
      return await signer.signMessage(message);
    }
    throw new Error("Signer does not support signMessage");
  };

  // Reconnect on mount if previous session was saved
  useEffect(() => {
    const savedType = localStorage.getItem("zx_connected_type") as WalletType;
    if (savedType) {
      if (savedType === "demo-client" || savedType === "demo-freelancer") {
        connectWallet(savedType).catch(() => {});
      } else {
        const eth = getInjectedProvider();
        if (eth) {
          connectWallet(savedType).catch(() => {});
        }
      }
    }
  }, []);

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
