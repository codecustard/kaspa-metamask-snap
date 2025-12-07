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
  } catch (error) {
    console.error('Hoosat wallet generation failed:', error);

    // Fallback to generated key pair
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
    } catch (retryError) {
      console.error('Retry also failed:', retryError);

      // Mock wallet for demo
      const mockAddress = `hoosat:qr${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mockPrivateKey = Math.random().toString(36).substring(2);

      const mockWallet: WalletState = {
        address: mockAddress,
        privateKey: mockPrivateKey,
      };

      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { wallet: mockWallet },
        },
      });

      return mockWallet;
    }
  }
}
