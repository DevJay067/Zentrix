import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner, formatEther } from "ethers";
import { Provider as MSTProvider, Constants as MSTConstants } from "@mstblockchain/mst-sdk";

export interface WalletContextType {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnecting: boolean;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  mstProvider: MSTProvider;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<boolean>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const MST_TESTNET_CHAIN_ID = 91562037;
const MST_TESTNET_CHAIN_ID_HEX = "0x5752035";

// Default MST SDK Provider for Testnet
const defaultMstProvider = new MSTProvider(MSTConstants.DEFAULT_RPC_URL);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const getEthereumObject = () => {
    if (typeof window !== "undefined") {
      // BridgeKey injects as window.bridgekey or window.ethereum
      return (window as any).bridgekey || (window as any).ethereum || null;
    }
    return null;
  };

  const updateBalance = useCallback(async (addr: string, prov: BrowserProvider) => {
    try {
      const bal = await prov.getBalance(addr);
      setBalance(parseFloat(formatEther(bal)).toFixed(4));
    } catch (e) {
      console.error("Error fetching balance:", e);
    }
  }, []);

  const switchNetwork = async (): Promise<boolean> => {
    const ethereum = getEthereumObject();
    if (!ethereum) return false;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MST_TESTNET_CHAIN_ID_HEX }],
      });
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

  const connectWallet = async (): Promise<string | null> => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      alert("No BridgeKey or EVM wallet detected. Please install BridgeKey extension from Chrome Web Store.");
      return null;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new BrowserProvider(ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts selected");
      }

      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      if (currentChainId !== MST_TESTNET_CHAIN_ID) {
        const switched = await switchNetwork();
        if (!switched) {
          console.warn("User did not switch to MST Testnet");
        }
      }

      const activeSigner = await browserProvider.getSigner();
      const accountAddress = accounts[0];

      setProvider(browserProvider);
      setSigner(activeSigner);
      setAddress(accountAddress);

      await updateBalance(accountAddress, browserProvider);
      return accountAddress;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setBalance("0");
    setChainId(null);
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!signer) throw new Error("Wallet not connected");
    return await signer.signMessage(message);
  };

  useEffect(() => {
    const ethereum = getEthereumObject();
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
        connectWallet,
        disconnectWallet,
        switchNetwork,
        signMessage,
      }}
    >
      {children}
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
