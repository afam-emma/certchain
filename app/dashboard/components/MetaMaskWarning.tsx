"use client";

import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetaMaskWarningProps {
  type: "not-installed" | "not-connected" | "error";
  errorMessage?: string;
  onConnect?: () => void;
  isConnecting?: boolean;
}

export function MetaMaskWarning({
  type,
  errorMessage,
  onConnect,
  isConnecting = false,
}: MetaMaskWarningProps) {
  if (type === "not-installed") {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
              MetaMask Not Installed
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
              To interact with the blockchain, you need to install MetaMask.
            </p>
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-yellow-700 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              Install MetaMask <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (type === "not-connected") {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Wallet Not Connected
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              Please connect your MetaMask wallet to register certificates on the blockchain.
            </p>
            {onConnect && (
              <Button
                onClick={onConnect}
                disabled={isConnecting}
                size="sm"
                className="mt-3"
                variant="outline"
              >
                {isConnecting ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error type
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            Wallet Connection Error
          </h3>
          {errorMessage && (
            <p className="text-sm text-red-700 dark:text-red-200 mt-1">
              {errorMessage}
            </p>
          )}
          {onConnect && (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              size="sm"
              className="mt-3"
              variant="outline"
            >
              {isConnecting ? "Retrying..." : "Try Again"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
