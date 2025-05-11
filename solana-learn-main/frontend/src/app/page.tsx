'use client';

import CounterProgram from "@/components/CounterProgram";
import WalletButton from "@/components/WalletButton";
import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

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

    let calculatedAmountLamports = 0;
    try {
      const receiverPublicKey = new PublicKey(receiver);
      calculatedAmountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(calculatedAmountLamports) || calculatedAmountLamports <= 0) {
        const errMsg = `Invalid amount: ${amount}. Please enter a positive number. [Code: HSIA1]`;
        console.error('[Send SOL] Error: ', errMsg, "Raw amount:", amount, "Lamports:", calculatedAmountLamports);
        setError(errMsg);
        setSending(false); // Reset sending state here
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
      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error('[Send SOL] Caught error during transaction process:', err);
      let uiError = 'An unknown error occurred during the transaction. [Code: HSCE2]';
      if (err instanceof Error) {
        uiError = `Transaction failed: ${err.name} - ${err.message} [Code: HSCE1]`;
      }
      // Specific check for WalletSendTransactionError if its name is known
      // For example: if (err.name === 'WalletSendTransactionError') { ... }
      setError(uiError);
      // Ensure txSignature is not set if an error occurs before it's meant to be set
      setTxSignature(''); 
    } finally {
      setSending(false);
      console.log('[Send SOL] State: sending set to false in finally block.');
      console.log('[Send SOL] Finished.');
    }
  }, [publicKey, receiver, amount, connection, sendTransaction, setError, setTxSignature, setSending, setReceiver, setAmount]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-400 mb-4">Solana Counter dApp</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          A simple counter application built on the Solana blockchain. Connect your wallet to initialize and increment a counter.
        </p>
      </header>
      
      <div className="mb-6 w-full max-w-md">
        <WalletButton />
      </div>
      
      <main className="w-full max-w-md mb-12">
        <CounterProgram />
      </main>
      
      <section className="my-8 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-4 text-center">Send SOL</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
      
      <section className="my-8 max-w-2xl text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-2">Initialize</h3>
            <p>Creates a new counter account unique to your wallet address with an initial value of 0.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-2">Increment</h3>
            <p>Increases your counter by 1. Each transaction is recorded on the Solana blockchain.</p>
          </div>
        </div>
      </section>
      
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Built with Next.js, Tailwind CSS, and Solana Web3.js</p>
        <p className="mt-1">
          <a 
            href="https://github.com/Atan0707/solana-learn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
