import type { Metadata } from "next";
// import { GeistSans } from 'geist/font/sans';

// import { AuthProvider } from "@/dashboard/components/SessionProvider";

import { Web3Provider } from "@/lib/web3/context";
import Navbar from '@/app/(public)/components/Navbar';

import "./globals.css";


// const geistSans = GeistSans({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "CertChain - Blockchain Certificate Platform",
  description: "Issue, verify, and manage tamper-proof certificates on blockchain. Secure, instant, forever.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
          <main className="min-h-[calc(100vh-5rem)]">
            <Navbar />
              {children}
            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <a href="/" className="flex items-center space-x-2 mb-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"></div>
                      <span className="text-xl font-bold">CertChain</span>
                    </a>
                    <p className="text-gray-400 mb-4">Secure blockchain certificates for the future.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Product</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                      <li><a href="/verify/demohash" className="hover:text-white transition-colors">Verify Demo</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                      <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Built by</h3>
                    <p className="text-gray-400">afamefune emmanuel</p>
                    <p className="text-sm text-gray-500 mt-2">&copy; 2024 CertChain. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </footer>
            </main>
    </>      
          
  );
}
