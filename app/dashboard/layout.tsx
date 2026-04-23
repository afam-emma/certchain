"use client";

import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Home, Verified, Settings } from 'lucide-react';
import Link from 'next/link';
import { Header } from './components/Header';
import { useWeb3 } from '@/lib/web3/context';

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      router.refresh();
    }
  }, [session, status, router]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected } = useWeb3();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Issuance', href: '/dashboard/issuance', icon: Verified },
    { name: 'Templates', href: '/dashboard/templates', icon: Settings },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Desktop Sidebar - Always visible */}
        <aside className="fixed top-14 left-0 z-40 hidden lg:block w-64 h-[calc(100vh-3.5rem)] border-r bg-card shadow-lg p-6 overflow-y-auto">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors block w-full",
                    isActive
                      ? "bg-slate-800/20 border-r-2 border-accent text-accent-foreground"
                      : "hover:bg-accent text-foreground hover:text-accent-foreground"
                  )}
                >
                  <div className="flex flex-row gap-4 items-center">
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-accent-foreground" : "")} />
                    <div>{item.name}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sheet Overlay */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 border-r bg-card shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                      isActive
                        ? "bg-accent/20 border-r-2 border-accent text-accent-foreground"
                        : "hover:bg-accent text-foreground hover:text-accent-foreground"
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-accent-foreground" : "")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        
        <main className="pt-2 pb-8 px-6 lg:ml-64 lg:px-12 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SessionProvider>
  );
}
