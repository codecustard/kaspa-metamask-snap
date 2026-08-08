import { HoosatCrypto } from 'hoosat-sdk-web';

export type WalletState = {
  address: string;
  privateKey: string;
};

/**
 * Get or create wallet from snap state
 *
 * @returns Promise that resolves to wallet state
 */
export async function getWallet(): Promise<WalletState> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as { wallet?: WalletState } | null;

  if (state?.wallet) {
    return state.wallet;
  }

  // Create deterministic wallet from MetaMask seed
  try {
    const entropy = await snap.request({
      method: 'snap_getBip32Entropy',
      params: {
        path: ['m', "44'", "999999'"],
        curve: 'secp256k1',
      },
    });

    if (!entropy.privateKey) {
      throw new Error('Failed to get private key from entropy');
    }

    const privateKeyHex = entropy.privateKey.slice(2);
    const wallet = HoosatCrypto.importKeyPair(privateKeyHex, 'mainnet');

    const walletData: WalletState = {
      address: wallet.address,
      privateKey: privateKeyHex,
    };

    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: { wallet: walletData },
      },
    });

    return walletData;
  } catch (entropyError) {
    // Deterministic derivation from the MetaMask seed failed. Fall back to a
    // freshly generated key pair (backed by a real CSPRNG), but never
    // fabricate key material — a wallet with guessable entropy is worse than
    // no wallet at all.
    try {
      const wallet = HoosatCrypto.generateKeyPair();
      const walletData: WalletState = {
        address: wallet.address,
        privateKey: wallet.privateKey.toString('hex'),
      };

      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { wallet: walletData },
        },
      });

      return walletData;
    } catch (generateError) {
      throw new Error(
        `Failed to create Hoosat wallet: unable to derive a key from the MetaMask seed (${
          entropyError instanceof Error
            ? entropyError.message
            : String(entropyError)
        }) and unable to generate a new key pair (${
          generateError instanceof Error
            ? generateError.message
            : String(generateError)
        }).`,
      );
    }
  }
}
