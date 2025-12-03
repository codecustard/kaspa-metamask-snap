export interface TransactionDetail {
  transaction_id: string;
  block_time?: string;
  is_accepted?: boolean;
  inputs?: Array<{
    previous_outpoint_address?: string;
    previous_outpoint_amount?: string;
  }>;
  outputs?: Array<{
    script_public_key_address?: string;
    amount?: string;
  }>;
}

/**
 * Get detailed transaction information from Hoosat explorer API
 */
export async function getTransactionDetails(txId: string): Promise<TransactionDetail | null> {
  try {
    const response = await fetch(`https://api.network.hoosat.fi/transactions/${txId}?resolve_previous_outpoints=light`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.error('Failed to fetch transaction details:', response.statusText);
      return null;
    }

    const transactionData = await response.json();
    return transactionData;

  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}