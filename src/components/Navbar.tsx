'use client';

import Link from 'next/link';
// import { useRouter } from 'next/router'; // Not strictly needed if only using hash links
import WalletButton from '@/components/WalletButton';
import ClientSideThemeSwitcher from './ClientSideThemeSwitcher';
import React from 'react';

export default function Navbar() {
  // const router = useRouter(); // Can be used for more complex navigation if needed

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 sm:py-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-bold text-gray-800 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Campus<span className="text-blue-600 dark:text-blue-400">Carpool</span>
            </a>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/find-ride" legacyBehavior>
              <a className="text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Find a Ride
              </a>
            </Link>
            <Link href="/add-ride" legacyBehavior>
              <a className="text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Offer a Ride
              </a>
            </Link>
            {/* Assuming your Send SOL section in page.tsx has id="send-sol-section" */}
            <Link href="/#send-sol-section" legacyBehavior> 
              <a className="text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                Send SOL
              </a>
            </Link>
             {/* You might want a link to the counter too, e.g., /#counter-section */}
          </nav>
          <div className="flex items-center space-x-3">
            <ClientSideThemeSwitcher />
            <WalletButton />
          </div>
          {/* Mobile menu button (optional, can be added later) */}
        </div>
      </div>
    </header>
  );
} 