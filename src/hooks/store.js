// src/hooks/store.js

// This declares a global interface for WindowEventMap. 
// In a JS project, this mainly serves as documentation unless you have a jsconfig.json 
// or are using JSDoc types for type checking.
/**
 * @global
 * @typedef {Object} EIP6963AnnounceProviderEventDetail
 * @property {any} info - EIP6963ProviderInfo
 * @property {any} provider - EIP1193Provider
 */
/**
 * @global
 * @typedef {CustomEvent & { detail: EIP6963AnnounceProviderEventDetail }} EIP6963AnnounceProviderEvent
 */
/**
 * @global 
 * @interface WindowEventMap 
 * @property {EIP6963AnnounceProviderEvent} "eip6963:announceProvider"
 */

/**
 * @typedef {Object} EIP6963ProviderDetail
 * @property {any} info - EIP6963ProviderInfo, typically { uuid: string, name: string, icon: string, rdns: string }
 * @property {any} provider - EIP1193Provider
 */

/** @type {EIP6963ProviderDetail[]} */
let providers = [];

export const store = {
  /**
   * Returns the current list of detected providers.
   * @returns {EIP6963ProviderDetail[]}
   */
  value: () => providers,

  /**
   * Subscribes to provider announcements and updates the local store.
   * @param {() => void} callback - A function to call when the providers list is updated.
   * @returns {() => void} A function to unsubscribe from the announcements.
   */
  subscribe: (callback) => {
    /** @param {Event} event */
    function onAnnouncement(event) {
      // Assuming event is CustomEvent with detail property based on EIP-6963
      /** @type {EIP6963AnnounceProviderEvent} */
      const announceEvent = /** @type {any} */ (event);
      if (providers.some((p) => p.info.uuid === announceEvent.detail.info.uuid)) {
        return;
      }
      providers = [...providers, announceEvent.detail];
      callback();
    }

    window.addEventListener("eip6963:announceProvider", onAnnouncement);

    // Dispatch the event to request providers to announce themselves.
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    // Return a function to remove the event listener, for cleanup.
    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnouncement);
    };
  },
}; 