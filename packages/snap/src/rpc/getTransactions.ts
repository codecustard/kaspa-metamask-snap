
import { getWallet } from '../util/wallet';
import { HoosatUtils } from 'hoosat-sdk-web';

export interface Transaction {
  txid: string;
  amount: string;
  type: 'received' | 'sent';
  timestamp: number;
  confirmations: number;
  [key: string]: any;
}

/**
 * Get transaction history from Hoosat network
 */
export async function getTransactions(address?: string): Promise<{ transactions: Transaction[] }> {
  try {
    let walletAddress = address;

    if (!walletAddress) {
      const wallet = await getWallet();
      walletAddress = wallet.address;
    }

    // Fetch pending transactions from mempool using the correct API
    const mempoolResponse = await fetch(`https://proxy.hoosat.net/api/v1/mempool/entries-by-addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: [walletAddress] })
    });

    const transactions: Transaction[] = [];

    if (mempoolResponse.ok) {
      const mempoolData = await mempoolResponse.json();

      if (mempoolData.success && mempoolData.data) {
        // Check if data is an array or has entries
        let entries = [];
        if (Array.isArray(mempoolData.data)) {
          entries = mempoolData.data;
        } else if (mempoolData.data.entries && Array.isArray(mempoolData.data.entries)) {
          entries = mempoolData.data.entries;
        } else if (typeof mempoolData.data === 'object') {
          // If it's an object, try to get values or convert to array
          entries = Object.values(mempoolData.data);
        }


        // Process mempool transactions (pending transactions)
        for (const entry of entries) {
          if (entry.transaction) {
            const tx = entry.transaction;

            // Determine if this transaction involves our address
            const isIncoming = tx.outputs?.some((output: any) =>
              output.scriptPublicKeyAddress === walletAddress
            );

            const isOutgoing = tx.inputs?.some((input: any) =>
              input.previousOutpoint?.address === walletAddress
            );

            if (isIncoming || isOutgoing) {
              let amount = '0';
              let type: 'received' | 'sent' = 'received';

              if (isIncoming && !isOutgoing) {
                // Pure incoming transaction
                type = 'received';
                const relevantOutputs = tx.outputs?.filter((output: any) =>
                  output.scriptPublicKeyAddress === walletAddress
                );
                const totalReceived = relevantOutputs?.reduce((sum: number, output: any) =>
                  sum + parseInt(output.amount || '0'), 0
                ) || 0;
                amount = HoosatUtils.sompiToAmount(totalReceived.toString()).toString();
              } else if (isOutgoing) {
                // Outgoing transaction
                type = 'sent';
                const totalSent = tx.outputs?.reduce((sum: number, output: any) => {
                  if (output.scriptPublicKeyAddress !== walletAddress) {
                    return sum + parseInt(output.amount || '0');
                  }
                  return sum;
                }, 0) || 0;
                amount = HoosatUtils.sompiToAmount(totalSent.toString()).toString();
              }

              if (amount !== '0') {
                transactions.push({
                  txid: tx.id || entry.id || 'unknown',
                  amount: amount,
                  type: type,
                  timestamp: Date.now(), // Mempool transactions are recent
                  confirmations: 0, // Mempool transactions are pending
                });
              }
            }
          }
        }
      }
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    return {
      transactions: transactions.slice(0, 10)
    };

  } catch (error) {
    return {
      transactions: []
    };
  }
}