/// <reference types="vite/client" />
// ^ Note: The above reference might not be directly applicable in Next.js
// but is kept from the original EIP-6963 guide.
// You might need to adjust your tsconfig.json or jsconfig.json if using TypeScript.

interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string; // Typically a data URI for an image
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

// This type represents the structure of the event dispatched by wallet providers
type EIP6963AnnounceProviderEvent = Event & { // Or CustomEvent if preferred and WindowEventMap is augmented
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

// EIP-1193 Provider interface (base for Ethereum wallet interactions)
interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

// Augment the global WindowEventMap to include the EIP-6963 event
declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": EIP6963AnnounceProviderEvent; // Or CustomEvent if using CustomEvent for EIP6963AnnounceProviderEvent
    "eip6963:requestProvider": Event; // Event dispatched to request providers
  }
}

// To make this file a module and avoid global scope issues if not intended
export type { EIP6963ProviderInfo, EIP6963ProviderDetail, EIP6963AnnounceProviderEvent, EIP1193Provider }; 