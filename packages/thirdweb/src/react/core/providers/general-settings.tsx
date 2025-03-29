"use client";

import { createContext, useContext } from "react";
import type { Chain } from "../../../chains/types.js";
import type { InAppWalletAuth } from "../../../wallets/in-app/core/wallet/types.js";
import type { SupportedTokens } from "../utils/defaultTokens.js";

export type GeneralSettings = {
  /**
   * The default chain to use for the SDK.
   * This is used when no chain is specified in the SDK methods.
   * @example 
   * ```ts
   * import { base } from "thirdweb/chains";
   * defaultChain: base
   * ```
  */
  defaultChain: Chain;

  /**
   * The default authentication options to use for the SDK.
   * This is used when no authentication options are specified in the SDK methods.
   * @example ["email", "phone", "google"]
   */
  defaultAuthOptions: InAppWalletAuth[];

  /**
   * The default wallet to use for the SDK.
   * This is used when no wallet is specified in the SDK methods.
   * @example
   * ```ts
   * import { base } from 'thirdweb/chains';
   * const token = getDefaultToken(base, 'USDC');
   * 
   * supportedTokens: {
   *   [String(base.id)]: [token!],
   * }
   * ```
   * 
   */
  defaultSupportedTokens: SupportedTokens;
};


export const GeneralSettingsCtx = createContext<
  GeneralSettings | undefined
>(
undefined);


/**
 * @internal
 */
export function useGeneralSettings(): GeneralSettings {
  const connectionManager = useGeneralSettingsCtx("useGeneralSettings");
  if (!connectionManager) {
    throw new Error(
      "useGeneralSettings must be used within a <ThirdwebProvider> Provider",
    );
  }
  return connectionManager;
}

/**
 * Use this instead of `useGeneralSettings` to throw a more specific error message when used outside of a provider.
 * @internal
 */
export function useGeneralSettingsCtx(hookname: string) {
  const manager = useContext(GeneralSettingsCtx);
  if (!manager) {
    throw new Error(`${hookname} must be used within <ThirdwebProvider>`);
  }

  return manager;
}
