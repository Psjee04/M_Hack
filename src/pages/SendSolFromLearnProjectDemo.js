import { useState, useCallback } from 'react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';

const SendSolFromLearnProjectDemo = ({ wallet }) => {
  // Assuming wallet prop provides: publicKey, sendTransaction, and connection can be made separately or part of wallet
  const { publicKey, sendTransaction } = wallet || {};
  // const connection = wallet?.connection || new Connection(clusterApiUrl('devnet'), 'confirmed'); 
  // ^ If your wallet object provides a connection. Otherwise, create one as below.

  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  const handleSendSol = useCallback(async () => {
    if (!publicKey || !sendTransaction) {
      setError('Wallet not connected or sendTransaction not available.');
      return;
    }
    if (!receiver || !amount) {
      setError('Receiver address and amount are required.');
      return;
    }

    setError('');
    setTxSignature('');
    setSending(true);

    try {
      const receiverPublicKey = new PublicKey(receiver);
      const calculatedAmountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(calculatedAmountLamports) || calculatedAmountLamports <= 0) {
        setError(`Invalid amount: ${amount}. Please enter a positive number.`);
        setSending(false);
        return;
      }
      
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Create connection here

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPublicKey,
          lamports: calculatedAmountLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection); // Pass connection if required by your sendTransaction
      
      // The confirmation logic from solana-learn-main is slightly different, using getLatestBlockhash.
      // Adapting to a simpler confirmTransaction for now, but this might depend on your wallet adapter's sendTransaction behavior.
      await connection.confirmTransaction(signature, 'processed'); 
      // For more robust confirmation, consider the getLatestBlockhash approach if issues arise:
      // const latestBlockHash = await connection.getLatestBlockhash();
      // await connection.confirmTransaction({
      //   blockhash: latestBlockHash.blockhash,
      //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      //   signature: signature,
      // }, 'processed');

      setTxSignature(signature);
      setReceiver('');
      setAmount('');
      setError('');
    } catch (err) {
      console.error('Error sending SOL:', err);
      setError(err instanceof Error ? `Transaction failed: ${err.message}` : 'An unknown error occurred.');
      setTxSignature(''); 
    } finally {
      setSending(false);
    }
  }, [publicKey, receiver, amount, sendTransaction, setError, setTxSignature, setSending, setReceiver, setAmount]);

  return (
    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Send SOL (Adapted from Solana-Learn)</h3>
      {!publicKey ? (
        <p className="text-orange-500">Connect your wallet to send SOL.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="receiverLearn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Receiver Address
            </label>
            <input
              type="text"
              id="receiverLearn"
              className="input-field w-full mt-1"
              placeholder="Enter receiver's Solana address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              disabled={sending || !publicKey}
            />
          </div>
          <div>
            <label htmlFor="amountLearn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (SOL)
            </label>
            <input
              type="number"
              id="amountLearn"
              className="input-field w-full mt-1"
              placeholder="Enter amount of SOL to send"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={sending || !publicKey}
              step="any"
            />
          </div>
          <button
            onClick={handleSendSol}
            disabled={sending || !publicKey || !receiver || !amount}
            className="btn-primary w-full"
          >
            {sending ? 'Sending...' : 'Send SOL'}
          </button>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</p>
      )}
      {txSignature && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400 text-center bg-green-100 dark:bg-green-900/30 p-2 rounded">
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
  );
};

export default SendSolFromLearnProjectDemo; 