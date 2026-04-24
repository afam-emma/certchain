"use client"

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LogOut, AlertCircle } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useWeb3 } from '@/lib/web3/context';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isConnected, account, disconnect, connect, isConnecting, error: walletError, isWrongNetwork, switchNetwork } = useWeb3();
  const [showError, setShowError] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (walletError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [walletError]);

  const handleConnect = async () => {
    setShowError(false);
    await connect();
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchNetwork();
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center justify-between w-full">

          

        <Link href="/dashboard" className="mx-6 flex items-center space-x-2">
          <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="font-bold">CertChain</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger >
                <div className="relative h-8 w-8 rounded-full group/button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {account?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {!isConnected ? (
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={handleConnect} 
                      disabled={isConnecting}
                    >
                      <span className="mr-2 h-4 w-4">🔗</span>
                      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                    </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => signOut({ callbackUrl: 'https://certchain-9ggi.vercel.app/login' })}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: 'https://certchain-9ggi.vercel.app/login' })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => disconnect()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Button
          variant="ghost" 
          onClick={onToggleSidebar}
          className="mx-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      </div>
    </header>
    
    {/* Error/Warning Toast */}
    {showError && walletError && (
      <div className="fixed top-4 right-4 z-50 max-w-sm animate-in fade-in slide-in-from-top">
        <div className={`border rounded-lg p-4 flex items-start gap-3 shadow-lg ${
          isWrongNetwork 
            ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' 
            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
        }`}>
          <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            isWrongNetwork 
              ? 'text-yellow-600 dark:text-yellow-400' 
              : 'text-red-600 dark:text-red-400'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold text-sm ${
              isWrongNetwork 
                ? 'text-yellow-900 dark:text-yellow-100' 
                : 'text-red-900 dark:text-red-100'
            }`}>
              {isWrongNetwork ? 'Wrong Network' : 'Wallet Connection Error'}
            </h3>
            <p className={`text-sm mt-1 ${
              isWrongNetwork 
                ? 'text-yellow-700 dark:text-yellow-200' 
                : 'text-red-700 dark:text-red-200'
            }`}>
              {walletError}
            </p>
            {isWrongNetwork && (
              <button
                onClick={handleSwitchNetwork}
                disabled={isSwitching}
                className="mt-3 px-3 py-1.5 text-xs font-medium rounded bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50 transition-colors"
              >
                {isSwitching ? 'Switching...' : 'Switch Network'}
              </button>
            )}
          </div>
          <button
            onClick={() => setShowError(false)}
            className={`flex-shrink-0 ${
              isWrongNetwork 
                ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300' 
                : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
            }`}
          >
            ✕
          </button>
        </div>
      </div>
    )}
            </>
  );
}
