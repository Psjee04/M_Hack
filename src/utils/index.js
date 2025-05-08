/**
 * Formats a raw balance string (assumed to be in wei) to a more readable format (e.g., ETH).
 * @param {string} rawBalance - The balance in wei as a string.
 * @returns {string} The formatted balance with 2 decimal places.
 */
export const formatBalance = (rawBalance) => {
  // Convert a large number string to a BigInt if necessary, or directly to number if safe.
  // For wei to ETH, divide by 10^18.
  const balance = (parseInt(rawBalance, 10) / 1000000000000000000).toFixed(2);
  return balance;
};

/**
 * Converts a hexadecimal chain ID to its decimal number representation.
 * @param {string} chainIdHex - The chain ID in hexadecimal format (e.g., "0x1").
 * @returns {number} The chain ID as a decimal number.
 */
export const formatChainAsNum = (chainIdHex) => {
  const chainIdNum = parseInt(chainIdHex, 16);
  return chainIdNum;
};

/**
 * Formats an Ethereum address to a shortened version (e.g., "0x123...abc").
 * @param {string} addr - The Ethereum address string.
 * @returns {string} The formatted address string.
 */
export const formatAddress = (addr) => {
  if (!addr || addr.length < 42) { // Basic check for typical Ethereum address length
    return addr; // Return original or handle error as appropriate
  }
  // The EIP guide example: addr.slice(0, 2) + addr.slice(2)
  // This doesn't change the address for formatting, let's assume typical 0x-prefix format.
  // A common format is 0x1234...7890
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}; 