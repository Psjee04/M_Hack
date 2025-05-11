import { useState, useEffect } from "react";
import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";

// Native Counter class and serialization
class Counter {
  count = 0;
  constructor(fields) {
    if (fields) {
      this.count = fields.count;
    }
  }
}

function serializeCounter(counter) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(counter.count, 0);
  return buffer;
}

function deserializeCounter(buffer) {
  if (buffer.length < 4) {
    throw new Error("Buffer too small");
  }
  return new Counter({ count: buffer.readUInt32LE(0) });
}

const NativeCounter = ({ wallet, programId }) => {
  const { publicKey, sendTransaction } = wallet || {};
  const [counterAccount, setCounterAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create a counter account
  const createCounterAccount = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const newAccount = Keypair.generate();
      const dataSize = 4; // Counter is u32, so 4 bytes
      const lamports = await connection.getMinimumBalanceForRentExemption(dataSize);
      
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: newAccount.publicKey,
          lamports,
          space: dataSize,
          programId: new PublicKey(programId),
        })
      );
      
      const signature = await sendTransaction(transaction, connection, {
        signers: [newAccount]
      });
      
      await connection.confirmTransaction(signature);
      setCounterAccount(newAccount);
      // Initial fetch of count after account creation
      setTimeout(() => getCount(newAccount.publicKey), 2000); // Delay to allow account to be confirmed
      
    } catch (err) {
      setError(`Error creating account: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Send instruction to the counter program
  const sendInstruction = async (instructionCode) => {
    if (!publicKey || !counterAccount) {
      setError("Please connect wallet and create/set a counter account first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: counterAccount.publicKey, isSigner: false, isWritable: true }
        ],
        programId: new PublicKey(programId),
        data: Buffer.from([instructionCode]) // 1: Increment, 2: Decrement, 3: View (as per Rust contract)
      });
      
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction(signature);
      // Fetch the count after an operation
      setTimeout(() => getCount(counterAccount.publicKey), 2000); // Delay for confirmation
      
    } catch (err) {
      setError(`Error sending instruction: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get the current count from the account
  const getCount = async (pubkey) => {
    const accountKeyToUse = pubkey || (counterAccount ? counterAccount.publicKey : null);
    if (!accountKeyToUse) {
      // setError("No counter account specified to fetch count.");
      return;
    }
    
    try {
      setLoading(true); // Indicate loading while fetching count
      setError("");
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const accountInfo = await connection.getAccountInfo(accountKeyToUse);
      
      if (accountInfo && accountInfo.data) {
        try {
          const counter = deserializeCounter(accountInfo.data);
          setCount(counter.count);
        } catch (deserializeError) {
          console.error("Error deserializing counter:", deserializeError);
          setError("Failed to read counter data from account.");
          setCount(null); // Reset count if deserialization fails
        }
      } else {
        setError("Counter account not found or has no data.");
        setCount(null);
      }
    } catch (fetchError) {
      console.error("Error fetching count:", fetchError);
      setError("Error fetching count from blockchain.");
      setCount(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to fetch count when counterAccount changes and is not null
  useEffect(() => {
    if (counterAccount && counterAccount.publicKey) {
      getCount(counterAccount.publicKey);
    } else {
      setCount(null); // Clear count if no account
    }
  }, [counterAccount]);


  // Increment the counter
  const incrementCounter = () => sendInstruction(1);
  
  // Decrement the counter
  const decrementCounter = () => sendInstruction(2);
  
  // View counter (using transaction - costs gas, but confirms state via program logic)
  // const viewCounterWithTransaction = () => sendInstruction(3); // Instruction 3 in Rust contract is also a view

  // View counter (direct account read - free, no gas, but might be slightly delayed)
  const viewCounterFree = () => {
    if (counterAccount && counterAccount.publicKey) {
      getCount(counterAccount.publicKey);
    } else {
      setError("No counter account to view.");
    }
  };

  // Allow user to set an existing counter account public key
  const [existingAccountInput, setExistingAccountInput] = useState("");
  const handleSetExistingAccount = () => {
    try {
      const pubkey = new PublicKey(existingAccountInput);
      setCounterAccount({ publicKey: pubkey }); // This will trigger the useEffect to fetch count
      setError("");
    } catch (err) {
      setError("Invalid public key entered.");
      console.error("Invalid PubKey:", err);
      setCounterAccount(null);
    }
  };

  return (
    <div>
      {/* Wallet Connection Check */}
      {!publicKey ? (
        <p className="text-orange-500">Please connect your wallet to interact with the counter.</p>
      ) : (
        <div className="space-y-4">
          {/* Account Creation / Setting */}
          {!counterAccount ? (
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Setup Counter Account</h3>
              <button 
                onClick={createCounterAccount}
                disabled={loading}
                className="w-full btn-primary mb-3"
              >
                {loading ? "Creating..." : "Create New Counter Account"}
              </button>
              <div className="flex items-center my-2">
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Existing Account Public Key"
                value={existingAccountInput}
                onChange={(e) => setExistingAccountInput(e.target.value)}
                className="input-field w-full mb-2"
              />
              <button
                onClick={handleSetExistingAccount}
                disabled={loading || !existingAccountInput}
                className="w-full btn-secondary"
              >
                Set Existing Account
              </button>
            </div>
          ) : (
            // Counter Interaction
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">Counter Account:</p>
              <p className="mb-3 font-mono text-xs break-all text-blue-600 dark:text-blue-400">{counterAccount.publicKey.toString()}</p>
              
              {count !== null ? (
                <p className="text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Count: {count}</p>
              ) : (
                <p className="text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">Fetching count...</p>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={incrementCounter}
                  disabled={loading}
                  className="btn-success"
                >
                  {loading ? "..." : "Increment"}
                </button>
                <button 
                  onClick={decrementCounter}
                  disabled={loading}
                  className="btn-warning"
                >
                  {loading ? "..." : "Decrement"}
                </button>
                <button 
                  onClick={viewCounterFree} // Using free view by default
                  disabled={loading}
                  className="col-span-2 btn-info" 
                >
                  {loading ? "..." : "Refresh Count (View Free)"}
                </button>
              </div>
              <button
                onClick={() => {
                  setCounterAccount(null);
                  setCount(null);
                  setExistingAccountInput("");
                  setError("");
                }}
                className="w-full mt-4 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                Use Different Account
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Status Messages */}
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</p>}
      {loading && !error && <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">Loading...</p>}
    </div>
  );
};

export default NativeCounter;
