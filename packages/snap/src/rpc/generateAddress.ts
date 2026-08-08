import { getWallet } from '../util/wallet';

/**
 * Generate or retrieve wallet address
 *
 * @returns Promise that resolves to wallet address object
 */
export async function generateAddress(): Promise<{ address: string }> {
  const wallet = await getWallet();
  return { address: wallet.address };
}
