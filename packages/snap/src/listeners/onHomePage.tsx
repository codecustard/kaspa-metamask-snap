import type { OnHomePageHandler } from '@metamask/snaps-sdk';
import { HoosatUtils } from 'hoosat-sdk-web';

import { getTransactions } from '../rpc/getTransactions';
import { home } from '../ui/home';
import { client } from '../util/client';
import { getWallet } from '../util/wallet';

export const onHomePage: OnHomePageHandler = async () => {
  let balance = '0.00000000';
  let address = 'hoosat:qr1234567890abcdef1234567890abcdef12345678';

  try {
    const wallet = await getWallet();
    address = wallet.address;

    try {
      const balanceResult = await client.getBalance(address);

      if (typeof balanceResult?.balance !== 'undefined') {
        const balanceAmount = HoosatUtils.sompiToAmount(balanceResult.balance);
        balance = balanceAmount.toString();
      }
    } catch {
      // Balance fetch failed
    }
  } catch {
    // Wallet access failed
  }

  // Get transaction history
  const transactionHistory = await getTransactions();

  const interfaceId = await snap.request({
    method: 'snap_createInterface',
    params: {
      ui: home({
        balance,
        address,
        hideBalance: false,
        transactions: transactionHistory.transactions,
      }),
    },
  });

  return {
    id: interfaceId,
  };
};
