import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

import {
  getBalance,
  debugBalance,
  sendTransaction,
  generateAddress,
  getTransactions,
  getUtxos,
  testTxBuilder,
  clearWallet,
} from '../rpc';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const params = request.params as any;

  switch (request.method) {
    case 'clearWallet':
      return await clearWallet();

    case 'debugBalance':
      return await debugBalance();

    case 'getBalance':
      return await getBalance(params?.address);

    case 'testTxBuilder':
      return await testTxBuilder();

    case 'sendTransaction':
      return await sendTransaction(params);

    case 'getTransactions':
      return await getTransactions();

    case 'getUtxos':
      return await getUtxos(params?.address);

    case 'generateAddress':
      return await generateAddress();

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};
