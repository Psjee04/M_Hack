'use client';

import CounterProgram from "@/components/CounterProgram";
import Navbar from "@/components/Navbar";
import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import Link from 'next/link';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  const handleSendSol = useCallback(async () => {
    console.log('[Send SOL] Initiated');
    if (!publicKey) {
      const errMsg = 'Wallet not connected. Please connect your wallet first. [Code: HSPK1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    console.log('[Send SOL] Wallet connected, public key:', publicKey.toBase58());

    if (!receiver) {
      const errMsg = 'Receiver address is required. [Code: HSRA1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    if (!amount) {
      const errMsg = 'Amount is required. [Code: HSAM1]';
      console.error('[Send SOL] Error: ', errMsg);
      setError(errMsg);
      return;
    }
    console.log(`[Send SOL] Receiver: ${receiver}, Amount: ${amount} SOL`);

    setError('');
    setTxSignature('');
    setSending(true);
    console.log('[Send SOL] State: Preparing to send transaction.');
    console.log('[Send SOL] Raw receiver input string:', receiver);

    let calculatedAmountLamports = 0;
    try {
      const receiverPublicKey = new PublicKey(receiver);
      console.log('[Send SOL] Parsed receiver PublicKey:', receiverPublicKey.toBase58());
      calculatedAmountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(calculatedAmountLamports) || calculatedAmountLamports <= 0) {
        const errMsg = `Invalid amount: ${amount}. Please enter a positive number. [Code: HSIA1]`;
        console.error('[Send SOL] Error: ', errMsg, "Raw amount:", amount, "Lamports:", calculatedAmountLamports);
        setError(errMsg);
        setSending(false);
        return;
      }
      console.log(`[Send SOL] Transaction details: To ${receiverPublicKey.toBase58()}, Lamports: ${calculatedAmountLamports}`);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPublicKey,
          lamports: calculatedAmountLamports,
        })
      );
      console.log('[Send SOL] Transaction object created.');

      console.log('[Send SOL] Calling sendTransaction via wallet adapter...');
      const signature = await sendTransaction(transaction, connection);
      console.log('[Send SOL] sendTransaction returned signature:', signature);

      console.log('[Send SOL] Confirming transaction...');
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      }, 'processed');
      console.log('[Send SOL] Transaction confirmed successfully.');

      setTxSignature(signature);
      console.log('[Send SOL] State: txSignature set.');
      setReceiver('');
      setAmount('');
      console.log('[Send SOL] State: Receiver and amount fields reset.');
      setError('');
    } catch (err) {
      console.error('[Send SOL] Caught error during transaction process:', err);
      let uiError = 'An unknown error occurred during the transaction. [Code: HSCE2]';
      if (err instanceof Error) {
        if (err.message && (err.message.includes('Invalid public key input') || err.message.includes('is not a valid public key'))) {
          uiError = "Invalid receiver address format. Please ensure it's a valid Solana address. [Code: HSINVADDRFMT]";
        } else if (err.name === 'WalletSendTransactionError' && err.message && err.message.toLowerCase().includes('invalid account')) {
          uiError = "The receiver account address appears to be invalid. Please double-check it and ensure it is a valid Solana account. [Code: HSINVACCNT]";
        } else {
          uiError = `Transaction failed: ${err.name} - ${err.message} [Code: HSCE1]`;
        }
      }
      setError(uiError);
      setTxSignature('');
    } finally {
      setSending(false);
      console.log('[Send SOL] State: sending set to false in finally block.');
      console.log('[Send SOL] Finished.');
    }
  }, [publicKey, receiver, amount, connection, sendTransaction, setError, setTxSignature, setSending, setReceiver, setAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-50/70 to-indigo-100/60 dark:from-slate-900 dark:via-gray-800/90 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-8 py-28 pt-52 md:pt-60 animate-fade-in-up">
        
        <div className="text-center mb-32 md:mb-40 max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100">
              University Carpool Platform
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-gray-800 dark:text-gray-50 leading-tight">
            Smart Campus <span className="text-blue-600 dark:text-blue-400">Carpooling</span> Made Simple
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Connect with fellow students, share rides, and make campus travel sustainable
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/learn-more" legacyBehavior>
              <a className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                Learn More
              </a>
            </Link>
            <Link href="/add-ride" legacyBehavior>
              <a className="px-6 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                Offer a Ride
              </a>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-32 md:mb-40">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="text-blue-600 dark:text-blue-400 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Save Time</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Find rides that match your schedule and avoid waiting for campus shuttles</p>
          </div>
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="text-blue-600 dark:text-blue-400 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Save Money</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Split costs with fellow students and reduce your transportation expenses</p>
          </div>
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="text-blue-600 dark:text-blue-400 mb-6">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Go Green</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Reduce carbon footprint and contribute to a sustainable campus environment</p>
          </div>
        </div>

        <main className="w-full max-w-md mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-center text-blue-700 dark:text-blue-400 mb-6">Solana Counter</h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
            <CounterProgram />
          </div>
        </main>
        
        <section id="send-sol-section" className="my-8 max-w-2xl w-full mx-auto scroll-mt-20">
          <div className="text-center mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-teal-700 bg-teal-100 rounded-full dark:bg-teal-700 dark:text-teal-100">
              Solana Features
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-400 mb-6 text-center">Send SOL</h2>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div>
                <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Receiver Address
                </label>
                <input
                  type="text"
                  name="receiver"
                  id="receiver"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter receiver's Solana address"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  disabled={sending || !publicKey}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter amount of SOL to send"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={sending || !publicKey}
                />
              </div>
              <button
                onClick={handleSendSol}
                disabled={sending || !publicKey || !receiver || !amount}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {sending ? 'Sending...' : 'Send SOL'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
            {txSignature && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400 text-center">
                <p>Transaction Successful!</p>
                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700 dark:hover:text-green-300"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="text-center mb-32 md:mb-40">
          <div className="inline-block mb-8">
            <span className="px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-700 dark:text-purple-100">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full dark:bg-blue-900 ring-4 ring-blue-200 dark:ring-blue-800">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Post a Ride</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Share your route and schedule</p>
            </div>
            <div className="text-center group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full dark:bg-blue-900 ring-4 ring-blue-200 dark:ring-blue-800">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Find Rides</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Search for available rides</p>
            </div>
            <div className="text-center group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full dark:bg-blue-900 ring-4 ring-blue-200 dark:ring-blue-800">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Connect</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Book and ride together</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-3xl p-12 sm:p-16 text-center text-white relative overflow-hidden mb-32 md:mb-40">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" style={{backgroundSize: '30px 30px'}}></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-50">Ready to Start Carpooling?</h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100/80 max-w-2xl mx-auto leading-relaxed">Join thousands of students already saving time and money while making campus travel more sustainable</p>
            <Link href="/add-ride" legacyBehavior>
              <a className="px-8 py-4 text-xl font-medium text-blue-600 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors dark:text-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700">
                Get Started
              </a>
            </Link>
          </div>
        </div>

      </div>

      <footer className="bg-gray-100/70 dark:bg-slate-900/70 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Campus Carpool</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">Making campus travel smarter and more sustainable.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">About Us</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">How It Works</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Safety</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Support</h4>
              <ul className="space-y-3">
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Help Center</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Contact Us</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">FAQs</a></Link></li>
                <li><Link href="/learn-more" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Learn More</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Terms of Service</a></Link></li>
                <li><Link href="#" legacyBehavior><a className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Cookie Policy</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 pt-10 text-center">
            <p className="text-base text-gray-600 dark:text-gray-400">© 2025 Campus Carpool. All rights reserved.</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Original Counter dApp elements by Atan0707, integrated into Carpool Theme.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
