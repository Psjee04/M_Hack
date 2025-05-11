import Navbar from '../components/Navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import SendSolFromLearnProjectDemo from './SendSolFromLearnProjectDemo'; // Direct import
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function SendSolPage() {
  const { publicKey, sendTransaction, connected, wallet: connectedWallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const walletProp = connected && publicKey && sendTransaction ? {
    publicKey,
    sendTransaction,
    connected,
    adapter: connectedWallet?.adapter
  } : null;

  return (
    <>
      <Head>
        <title>Send SOL | Campus Carpool</title>
        <meta name="description" content="Send SOL transactions using your connected Solana wallet." />
      </Head>
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900`}>
        <Navbar />
        
        <div className="container mx-auto px-6 md:px-8 py-28 pt-40 md:pt-48 animate-fade-in-up">
          <div className="max-w-xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 text-center">
              Send SOL Transaction
            </h1>
            {!mounted ? (
              <div className="text-center p-4">
                 <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                  Loading wallet status...
                </p>
              </div>
            ) : !connected || !walletProp ? (
              <div className="text-center p-4">
                <p className="text-lg text-red-500 dark:text-red-400 mb-4">
                  Please connect your wallet to send SOL.
                </p>
              </div>
            ) : (
              <SendSolFromLearnProjectDemo wallet={walletProp} />
            )}
          </div>
        </div>
      </div>
    </>
  );
} 