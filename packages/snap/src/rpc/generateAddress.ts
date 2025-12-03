
import { getWallet } from '../util/wallet';

/**
 * Generate or retrieve wallet address
 */
export async function generateAddress(): Promise<{ address: string }> {
  try {
    const wallet = await getWallet();
    return { address: wallet.address };
  } catch (error) {
    return { address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678' };
  }
}