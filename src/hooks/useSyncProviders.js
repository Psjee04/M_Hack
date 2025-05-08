// src/hooks/useSyncProviders.js
import { useSyncExternalStore } from "react";
import { store } from "./store";

/**
 * Custom React hook to get the list of EIP-6963 wallet providers.
 * It uses useSyncExternalStore to subscribe to the provider store 
 * and update components when the list of providers changes.
 * 
 * @returns {import("./store").EIP6963ProviderDetail[]} An array of detected EIP-6963 provider details.
 */
export const useSyncProviders = () => {
  // The useSyncExternalStore hook takes three arguments:
  // 1. subscribe: A function that subscribes to the store and returns an unsubscribe function.
  // 2. getSnapshot: A function that returns the current value of the store.
  // 3. getServerSnapshot (optional): A function that returns the server-side value of the store (for SSR).
  const providers = useSyncExternalStore(
    store.subscribe, // The subscribe function from our store
    store.value,     // The function to get the current value from our store
    store.value      // The function to get the server snapshot (can be same as getSnapshot if no specific SSR logic)
  );
  return providers;
}; 