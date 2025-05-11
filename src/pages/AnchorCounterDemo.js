import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils } from '@coral-xyz/anchor';
import idl from '../../contract_cpi_idl.json'; // Path to the updated IDL

const ANCHOR_COUNTER_SEED = "counter";

const AnchorCounterDemo = ({ wallet, programId }) => {
  const { publicKey, signTransaction, signAllTransactions } = wallet || {};
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(null);
  const [counterPda, setCounterPda] = useState(null);

  const getProvider = useCallback(() => {
    if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
        const dummySigner = { 
            publicKey: publicKey || web3.Keypair.generate().publicKey,
            signTransaction: async (tx) => tx,
            signAllTransactions: async (txs) => txs,
        };
        const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        return new AnchorProvider(connection, dummySigner, AnchorProvider.defaultOptions());
    }
    const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const providerWallet = { publicKey, signTransaction, signAllTransactions };
    return new AnchorProvider(connection, providerWallet, AnchorProvider.defaultOptions());
  }, [wallet, publicKey, signTransaction, signAllTransactions]);

  const program = useMemo(() => {
    const provider = getProvider();
    return new Program(idl, new PublicKey(programId), provider);
  }, [programId, getProvider]);

  const findCounterPda = useCallback(async (authority) => {
    if (!authority) return null;
    const [pda, _bump] = await PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode(ANCHOR_COUNTER_SEED), authority.toBuffer()],
      program.programId
    );
    return pda;
  }, [program.programId]);

  useEffect(() => {
    if (publicKey) {
      findCounterPda(publicKey).then(pda => {
        setCounterPda(pda);
        if (pda) fetchCount(pda); // Fetch count if PDA is found
      });
    }
  }, [publicKey, findCounterPda]);

  const fetchCount = useCallback(async (pda) => {
    if (!pda) {
      // If no PDA, means it might not be initialized for this user yet.
      // Or if you want to allow fetching from any PDA, remove this check and pass PDA directly.
      // For this demo, we assume we only care about the user-specific counter PDA.
      setCount(null); 
      setMessage('Counter not initialized for this wallet or PDA not found.');
      return;
    }
    setLoading(true);
    try {
      const counterAccount = await program.account.counter.fetch(pda);
      setCount(counterAccount.count.toNumber()); // count is u64, convert to number
      setMessage('Count fetched successfully.');
    } catch (error) {
      console.error("Error fetching count:", error);
      // setMessage(`Error fetching count: ${error.message}`);
      // Common case: Account not found if not initialized, this is expected.
      if (error.message.includes("Account does not exist")) {
        setMessage("Counter account not initialized. Click 'Initialize Counter' first.");
      } else {
        setMessage(`Error fetching count: ${error.message}`);
      }
      setCount(null);
    }
    setLoading(false);
  }, [program]);
  
  const handleInitialize = async () => {
    if (!publicKey || !counterPda) {
      setMessage('Wallet not connected or Counter PDA not determined.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const txSignature = await program.methods
        .initialize()
        .accounts({
          counter: counterPda,      // The PDA for the counter account
          authority: publicKey,     // The user's wallet public key
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setMessage(`Initialize transaction successful! Signature: ${txSignature}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for state to settle
      fetchCount(counterPda);
    } catch (err) {
      console.error('Error during initialize:', err);
      setMessage(`Error initializing: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (!publicKey || !counterPda) return;
    setLoading(true); setMessage('');
    try {
      await program.methods.increment().accounts({ counter: counterPda, authority: publicKey }).rpc();
      setMessage('Increment successful!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchCount(counterPda);
    } catch (err) { console.error('Error incrementing:', err); setMessage(`Error: ${err.message}`); }
    setLoading(false);
  };

  const handleDecrement = async () => {
    if (!publicKey || !counterPda) return;
    setLoading(true); setMessage('');
    try {
      await program.methods.decrement().accounts({ counter: counterPda, authority: publicKey }).rpc();
      setMessage('Decrement successful!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchCount(counterPda);
    } catch (err) { console.error('Error decrementing:', err); setMessage(`Error: ${err.message}`); }
    setLoading(false);
  };
  
  useEffect(() => {
    // Fetch count when component mounts if PDA is available
    if (counterPda) {
        fetchCount(counterPda);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counterPda]); // fetchCount is memoized, so it's stable if program is stable

  return (
    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Anchor Counter Demo</h3>
      {!publicKey ? (
        <p className="text-orange-500">Connect wallet to use Anchor Counter.</p>
      ) : (
        <div className="space-y-3">
          {counterPda && <p className="text-xs text-gray-500 dark:text-gray-400">Counter PDA: {counterPda.toBase58()}</p>}
          {count !== null ? (
            <p className="text-3xl font-bold text-center text-gray-700 dark:text-gray-200">Count: {count}</p>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">{loading ? 'Loading count...' : 'Counter not initialized or unable to fetch.'}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button onClick={handleInitialize} disabled={loading || !publicKey || !counterPda} className="btn-primary">Initialize</button>
            <button onClick={handleIncrement} disabled={loading || !publicKey || !counterPda || count === null} className="btn-success">Increment</button>
            <button onClick={handleDecrement} disabled={loading || !publicKey || !counterPda || count === null} className="btn-warning">Decrement</button>
          </div>
          <button onClick={() => fetchCount(counterPda)} disabled={loading || !publicKey || !counterPda} className="btn-info w-full mt-2">Refresh Count</button>
        </div>
      )}
      {message && <p className={`mt-2 text-sm p-2 rounded ${message.startsWith('Error') || message.startsWith('Counter not initialized') ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' : 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'}`}>{message}</p>}
    </div>
  );
};

export default AnchorCounterDemo; // Renamed component export 