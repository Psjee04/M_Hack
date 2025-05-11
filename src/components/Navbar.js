import Link from 'next/link';
import { useRouter } from 'next/router';
// import ThemeSwitcher from './ThemeSwitcher'; // Old import
import ClientSideThemeSwitcher from './ClientSideThemeSwitcher'; // New import
import React, { useState } from 'react';
import { DiscoverWalletProviders } from './WalletProviders';

export default function Navbar() {
  const router = useRouter();
  const [showWalletProviders, setShowWalletProviders] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 sm:py-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Campus Carpool
            </a>
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/search-ride" legacyBehavior>
              <a className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 sm:px-0">
                Find a Ride
              </a>
            </Link>
            <Link href="/add-ride" legacyBehavior>
              <a className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 sm:px-0">
                Add a Ride
              </a>
            </Link>
            <Link href="/send-sol" legacyBehavior>
              <a className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 sm:px-0">
                Send SOL
              </a>
            </Link>
            <button
              onClick={() => setShowWalletProviders(!showWalletProviders)}
              className="btn-primary py-1.5 sm:py-2 px-3 sm:px-5 text-xs sm:text-sm"
            >
              {showWalletProviders ? 'Hide Wallets' : 'Connect Wallet'}
            </button>
            {/* <ThemeSwitcher /> */}{/* Old usage */}
            <ClientSideThemeSwitcher /> {/* New usage */}
          </nav>
        </div>
        {showWalletProviders && (
          <div className="mt-4 max-w-md mx-auto">
            <DiscoverWalletProviders />
          </div>
        )}
      </div>
    </header>
  );
} 