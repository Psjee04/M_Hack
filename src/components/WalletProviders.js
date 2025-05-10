import React, { useState } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { formatAddress } from "../utils";

/**
 * @typedef {import('../hooks/store').EIP6963ProviderDetail} EIP6963ProviderDetail
 */

export const DiscoverWalletProviders = () => {
  /** @type {[EIP6963ProviderDetail | undefined, React.Dispatch<React.SetStateAction<EIP6963ProviderDetail | undefined>>]} */
  const [selectedWallet, setSelectedWallet] = useState();
  const [userAccount, setUserAccount] = useState("");
  const providers = useSyncProviders(); // Custom hook to get providers

  /**
   * Handles the connection to the selected wallet provider.
   * @param {EIP6963ProviderDetail} providerWithInfo - The provider detail object.
   */
  const handleConnect = async (providerWithInfo) => {
    try {
      const accounts = await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      });
      // @ts-ignore TS doesn't know accounts is string[] here without more checks
      if (accounts && accounts[0]) {
        // @ts-ignore
        setSelectedWallet(providerWithInfo);
        // @ts-ignore
        setUserAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Failed to connect to provider:", error);
      // Check if the error is due to user rejection
      if (error.code === 4001) { // 4001 is a common code for user rejection
        alert('Connection request was rejected by the user. Please approve the request in your wallet to connect.');
      } else {
        alert('An error occurred while connecting to the wallet. Please try again or check your wallet settings.');
      }
      // Handle connection error (e.g., user rejected request)
      setUserAccount("");
      setSelectedWallet(undefined);
    }
  };

  return (
    <div className="wallet-providers-container p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Wallets Detected:</h2>
      <div className="provider-buttons grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {providers.length > 0 ? (
          providers.map((provider) => (
            <button
              key={provider.info.uuid}
              onClick={() => handleConnect(provider)}
              className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <img 
                src={provider.info.icon} 
                alt={`${provider.info.name} icon`} 
                className="w-8 h-8 mr-3 rounded-full object-contain"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">{provider.info.name}</span>
            </button>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 col-span-full">No Announced Wallet Providers. Make sure MetaMask or another EIP-6963 compatible wallet is installed and active.</p>
        )}
      </div>
      
      {userAccount && selectedWallet && (
        <div className="selected-wallet-info mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Connected Wallet:</h3>
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <img 
              src={selectedWallet.info.icon} 
              alt={`${selectedWallet.info.name} icon`} 
              className="w-10 h-10 mr-3 rounded-full object-contain"
            />
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-100">{selectedWallet.info.name}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-mono" title={userAccount}>{formatAddress(userAccount)}</div>
            </div>
          </div>
        </div>
      )}
       {!userAccount && providers.length > 0 && (
         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Select a wallet to connect.</p>
       )}
    </div>
  );
}; 