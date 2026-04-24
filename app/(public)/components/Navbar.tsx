"use client";

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useWeb3 } from '@/lib/web3/context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Temp: Removed useSession/useWeb3 - likely hydration crash cause
  // Add back after test pass

  return (

    <>
      {/* Mobile overlay */}
      {/* Full Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-white/20 supports-[backdrop-filter]:bg-white/60 dark:bg-black/80 dark:border-black/20 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden md:inline">CertChain</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">Home</a>
              <a href="/about" className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">About</a>
              <a href="/contact" className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">Contact</a>
              <a href="/login" className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">Login</a>
              <a href="/dashboard" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">Dashboard</a>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Fixed positioning */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-0 w-64 bg-white shadow-xl">
            <div className="flex flex-col p-4 space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Home</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Contact</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Login</Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-center">Dashboard</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

