import { HoosatUtils } from 'hoosat-sdk-web';

import { client } from '../util/client';
import { getWallet } from '../util/wallet';

export type BalanceResult = {
  balance: string;
  confirmed: string;
  unconfirmed: string;
  [key: string]: any;
};

export type DebugBalanceResult = {
  address: string;
  rawBalance: string;
  isRealAddress: boolean;
  [key: string]: any;
};

/**
 * Get balance for an address
 *
 * @param address - Wallet address to get balance for
 * @returns Promise that resolves to balance result
 */
export async function getBalance(address?: string): Promise<BalanceResult> {
  try {
    const wallet = await getWallet();
    const targetAddress = address ?? wallet.address;

    const balanceResult = await client.getBalance(targetAddress);
    const confirmedBalance = HoosatUtils.sompiToAmount(
      balanceResult.balance || '0',
    );

    return {
      balance: confirmedBalance.toString(),
      confirmed: confirmedBalance.toString(),
      unconfirmed: '0.00000000',
    };
  } catch {
    return {
      balance: '0.00000000',
      confirmed: '0.00000000',
      unconfirmed: '0.00000000',
    };
  }
}

/**
 * Debug balance call for troubleshooting
 *
 * @returns Promise that resolves to debug balance result or error
 */
export async function debugBalance(): Promise<
  DebugBalanceResult | { error: string }
> {
  try {
    const wallet = await getWallet();
    const balanceResult = await client.getBalance(wallet.address);

    return {
      address: wallet.address,
      rawBalance: JSON.stringify(balanceResult),
      isRealAddress:
        wallet.address.startsWith('hoosat:') &&
        !wallet.address.includes('qr1234'),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
