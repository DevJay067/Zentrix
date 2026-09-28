/// <reference types="vite/client" />

// Type declaration for @mstblockchain/mst-sdk (no @types package available)
declare module "@mstblockchain/mst-sdk" {
  export class Provider {
    constructor(rpcUrl: string);
    getBalance(address: string): Promise<bigint>;
    getBlock(blockNumber?: number): Promise<any>;
    getTransaction(txHash: string): Promise<any>;
    getTransactionReceipt(txHash: string): Promise<any>;
    call(transaction: any): Promise<string>;
  }

  export class Client {
    constructor(provider: Provider);
  }

  export class Signer {
    constructor(privateKey: string, provider: Provider);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    sendTransaction(tx: any): Promise<any>;
  }

  export const Constants: {
    CHAINS: {
      MAINNET: number;
      TESTNET: number;
    };
    DEFAULT_RPC_URL: string;
    GAS_LIMIT: number;
  };

  export const Errors: Record<string, string>;
}
