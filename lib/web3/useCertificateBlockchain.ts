 "use client";

import { useState, useCallback } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { useWeb3 } from "./context";

// Contract ABI - only the functions we need
const CONTRACT_ABI = [
  "function registerCertificate(bytes32 certHash) external",
  "function verifyCertificate(bytes32 certHash) external view returns (uint256)",
  "function isRegistered(bytes32 certHash) external view returns (bool)",
  "event CertificateRegistered(bytes32 indexed certHash, uint256 timestamp, address indexed registrar)"
];

interface BlockchainResult {
  success: boolean;
  transactionHash?: string;
  timestamp?: number;
  error?: string;
}

interface UseCertificateBlockchainReturn {
  // Register certificate on blockchain
  registerCertificate: (certHash: string) => Promise<BlockchainResult>;
  
  // Verify certificate on blockchain
  verifyCertificate: (certHash: string) => Promise<{ verified: boolean; timestamp?: number }>;
  
  // Loading states
  isRegistering: boolean;
  isVerifying: boolean;
  
  // Error
  error: string | null;
}

export function useCertificateBlockchain(): UseCertificateBlockchainReturn {
  const { isConnected, account, contractAddress } = useWeb3();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getContract = useCallback(async () => {
    if (!contractAddress) {
      throw new Error("Contract address not configured. Please ensure the smart contract is deployed.");
    }
    
    if (!window.ethereum) {
      throw new Error("MetaMask not found. Please install the MetaMask browser extension.");
    }
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new Contract(contractAddress, CONTRACT_ABI, signer);
    } catch (err) {
      if (err instanceof Error && err.message.includes("window is not defined")) {
        throw new Error("Web3 provider not available on server side");
      }
      throw new Error("Failed to initialize contract. Please check MetaMask is connected.");
    }
  }, [contractAddress]);
  
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";
const getReadOnlyContract = useCallback(async () => {
  if (!contractAddress) {
    throw new Error("Contract address not configured. Please ensure the smart contract is deployed.");
  }
  
  try {
    // Use read-only provider (doesn't require wallet connection)
    const provider = new JsonRpcProvider(rpcUrl);
    return new Contract(contractAddress, CONTRACT_ABI, provider);
  } catch (err) {
    throw new Error("Failed to connect to blockchain RPC. Please ensure the local node is running.");
  }
}, [contractAddress]);
  
  const registerCertificate = useCallback(async (certHash: string): Promise<BlockchainResult> => {
    if (!isConnected || !account) {
      return {
        success: false,
        error: "Wallet not connected. Please connect your wallet first using the Connect Wallet button.",
      };
    }
    
    setIsRegistering(true);
    setError(null);
    
    try {
      // Convert certHash to bytes32
      const hashBytes32 = certHash.startsWith("0x") ? certHash : `0x${certHash}`;
      
      const contract = await getContract();
      
      // Send transaction
      const tx = await contract.registerCertificate(hashBytes32);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the timestamp from the event
      let timestamp: number | undefined;
      if (receipt && receipt.logs && receipt.logs.length > 0) {
        try {
          // The event should contain the timestamp
          const parsedLog = contract.interface.parseLog(receipt.logs[0]);
          if (parsedLog && (parsedLog.args as any).timestamp) {
            timestamp = Number((parsedLog.args as any).timestamp);
          }
        } catch (logErr) {
          console.warn("Could not parse event log:", logErr);
        }
      }
      
      return {
        success: true,
        transactionHash: receipt?.hash,
        timestamp,
      };
    } catch (err: unknown) {
      let errorMessage = "Failed to register certificate on blockchain";
      
      if (err instanceof Error) {
        if (err.message.includes("user rejected") || err.message.includes("User denied")) {
          errorMessage = "Transaction rejected. Please approve the transaction in MetaMask.";
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds. Please ensure you have enough ETH in your wallet.";
        } else if (err.message.includes("MetaMask")) {
          errorMessage = "MetaMask error. Please check MetaMask is connected to the correct network.";
        } else if (err.message.includes("not configured")) {
          errorMessage = "Contract not configured. Please check the contract address is set correctly.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsRegistering(false);
    }
  }, [isConnected, account, getContract]);
  
  const verifyCertificate = useCallback(async (certHash: string): Promise<{ verified: boolean; timestamp?: number }> => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Convert certHash to bytes32
      const hashBytes32 = certHash.startsWith("0x") ? certHash : `0x${certHash}`;
      
      const contract = await getReadOnlyContract();
      
      // Call the contract to verify
      const timestamp = await contract.verifyCertificate(hashBytes32);
      
      return {
        verified: timestamp > 0,
        timestamp: timestamp > 0 ? Number(timestamp) : undefined,
      };
    } catch (err: unknown) {
      let errorMessage = "Failed to verify certificate on blockchain";
      
      if (err instanceof Error) {
        if (err.message.includes("not configured")) {
          errorMessage = "Contract not configured. Unable to verify certificate.";
        } else if (err.message.includes("connection")) {
          errorMessage = "Connection error. Please ensure the blockchain node is running.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error("Verification error:", err);
      
      return {
        verified: false,
      };
    } finally {
      setIsVerifying(false);
    }
  }, [getReadOnlyContract]);
  
  return {
    registerCertificate,
    verifyCertificate,
    isRegistering,
    isVerifying,
    error,
  };
}