'use client';

import { FC, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

// Dynamically import wallet components with SSR disabled
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletButton: FC = () => {
  const { wallet, connected, disconnect, connecting, disconnecting, publicKey } = useWallet();

  useEffect(() => {
    console.log('[WalletButton] Hook Values:');
    console.log('  Connected:', connected);
    console.log('  Wallet:', wallet?.adapter.name);
    console.log('  PublicKey:', publicKey?.toBase58());
    console.log('  Connecting:', connecting);
    console.log('  Disconnecting:', disconnecting);
  }, [wallet, connected, publicKey, connecting, disconnecting]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // Optionally, show a notification to the user
    }
  }, [disconnect]);

  return (
    <div className="flex items-center justify-center space-x-3">
      {!connected ? (
        <WalletMultiButtonDynamic className="wallet-button btn-primary" />
      ) : (
        <>
          {wallet && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Connected: {wallet.adapter.name} ({publicKey?.toBase58().substring(0,6)}...)
            </span>
          )}
          <button 
            onClick={handleDisconnect} 
            disabled={disconnecting || !connected}
            className="btn-secondary"
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </>
      )}
      {connecting && !connected && <p className="text-sm text-gray-500 ml-2">(Connecting...)</p>}
    </div>
  );
};

export default WalletButton; 