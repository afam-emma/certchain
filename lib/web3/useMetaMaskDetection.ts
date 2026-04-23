import { useEffect, useState } from "react";

export interface MetaMaskStatus {
  isInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  isMetaMaskAvailable: boolean;
  errorMessage: string | null;
}

/**
 * Hook to detect MetaMask installation and connection status
 * Provides helpful feedback for users who don't have MetaMask installed
 */
export function useMetaMaskDetection(): MetaMaskStatus {
  const [status, setStatus] = useState<MetaMaskStatus>({
    isInstalled: false,
    isConnected: false,
    account: null,
    chainId: null,
    isMetaMaskAvailable: false,
    errorMessage: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Check if MetaMask is installed
    const isInstalled = Boolean(window.ethereum?.isMetaMask);
    
    if (!isInstalled) {
      setStatus((prev) => ({
        ...prev,
        isInstalled: false,
        isMetaMaskAvailable: false,
        errorMessage:
          "MetaMask not detected. Please install the MetaMask browser extension from https://metamask.io/",
      }));
      return;
    }

    // Check if already connected
    const checkConnection = async () => {
      if (!window.ethereum) {
        setStatus((prev) => ({
          ...prev,
          isMetaMaskAvailable: false,
          errorMessage: "MetaMask is not accessible",
        }));
        return;
      }

      try {
        const accounts = await window.ethereum?.request?.({
          method: "eth_accounts",
        }) as string[] | null;

        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum?.request?.({
            method: "eth_chainId",
          }) as string | null;

          setStatus({
            isInstalled: true,
            isConnected: true,
            account: accounts[0],
            chainId: chainId ? parseInt(chainId, 16) : null,
            isMetaMaskAvailable: true,
            errorMessage: null,
          });
        } else {
          setStatus({
            isInstalled: true,
            isConnected: false,
            account: null,
            chainId: null,
            isMetaMaskAvailable: true,
            errorMessage: "Please connect your MetaMask wallet",
          });
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
        setStatus((prev) => ({
          ...prev,
          isMetaMaskAvailable: false,
          errorMessage: "Error connecting to MetaMask",
        }));
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (...eventArgs: unknown[]) => {
      const accounts = eventArgs[0] as string[] | undefined;
      if (!accounts || accounts.length === 0) {
        setStatus((prev) => ({
          ...prev,
          isConnected: false,
          account: null,
        }));
      } else {
        setStatus((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
        }));
      }
    };

    const handleChainChanged = () => {
      // Reload on chain change
      window.location.reload();
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return status;
}
