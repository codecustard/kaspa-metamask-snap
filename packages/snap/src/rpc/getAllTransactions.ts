import { HoosatUtils } from 'hoosat-sdk-web';

import { getWallet } from '../util/wallet';

export type Transaction = {
  txid: string;
  amount: string;
  type: 'received' | 'sent';
  timestamp: number;
  [key: string]: any;
};

/**
 * Get full transaction history from Hoosat network (more transactions than the home page)
 *
 * @param address - Wallet address to fetch transactions for
 * @param limit - Maximum number of transactions to fetch
 * @returns Promise that resolves to transaction history object
 */
export async function getAllTransactions(
  address?: string,
  limit = 50,
): Promise<{ transactions: Transaction[] }> {
  try {
    let walletAddress = address;

    if (!walletAddress) {
      const wallet = await getWallet();
      walletAddress = wallet.address;
    }

    // Fetch transaction history using the Hoosat explorer API with resolved inputs
    const transactionsResponse = await fetch(
      `https://api.network.hoosat.fi/addresses/${walletAddress}/full-transactions?limit=${limit}&offset=0&resolve_previous_outpoints=light`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const transactions: Transaction[] = [];

    if (transactionsResponse.ok) {
      const transactionsData = await transactionsResponse.json();

      if (Array.isArray(transactionsData)) {
        // Process transactions from the explorer API
        for (const tx of transactionsData) {
          if (!tx.transaction_id) {
            continue;
          }

          // Determine if this transaction involves our address and calculate amounts
          let totalReceived = 0;
          let totalSent = 0;
          let hasIncomingOutput = false;
          let hasOutgoingInput = false;

          // Check outputs for incoming transactions
          if (tx.outputs && Array.isArray(tx.outputs)) {
            for (const output of tx.outputs) {
              if (output.script_public_key_address === walletAddress) {
                totalReceived += parseInt(output.amount || '0', 10);
                hasIncomingOutput = true;
              }
            }
          }

          // Check inputs for outgoing transactions
          if (tx.inputs && Array.isArray(tx.inputs)) {
            for (const input of tx.inputs) {
              if (input.previous_outpoint_address === walletAddress) {
                hasOutgoingInput = true;
                totalSent += parseInt(
                  input.previous_outpoint_amount || '0',
                  10,
                );
              }
            }
          }

          // Calculate net amount and determine transaction type
          let amount = '0';
          let type: 'received' | 'sent' = 'received';

          if (hasOutgoingInput) {
            // If we have outgoing inputs, this is a sent transaction (even if we also receive change)
            type = 'sent';
            const netSent = totalSent - totalReceived;
            amount = HoosatUtils.sompiToAmount(
              Math.abs(netSent).toString(),
            ).toString();
          } else if (hasIncomingOutput) {
            // Pure incoming transaction (no outgoing inputs)
            type = 'received';
            amount = HoosatUtils.sompiToAmount(
              totalReceived.toString(),
            ).toString();
          }

          if (amount !== '0') {
            transactions.push({
              txid: tx.transaction_id,
              amount,
              type,
              timestamp: tx.block_time
                ? new Date(tx.block_time).getTime()
                : Date.now(),
            });
          }
        }
      }
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    return {
      transactions,
    };
  } catch {
    return {
      transactions: [],
    };
  }
}
