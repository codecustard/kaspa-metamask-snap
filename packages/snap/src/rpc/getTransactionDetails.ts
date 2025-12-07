export type TransactionDetail = {
  transactionId: string;
  blockTime?: string;
  isAccepted?: boolean;
  inputs?: {
    previousOutpointAddress?: string;
    previousOutpointAmount?: string;
  }[];
  outputs?: {
    scriptPublicKeyAddress?: string;
    amount?: string;
  }[];
};

/**
 * Get detailed transaction information from Hoosat explorer API
 *
 * @param txId - Transaction ID to fetch details for
 * @returns Promise that resolves to transaction detail or null
 */
export async function getTransactionDetails(
  txId: string,
): Promise<TransactionDetail | null> {
  try {
    const response = await fetch(
      `https://api.network.hoosat.fi/transactions/${txId}?resolve_previous_outpoints=light`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!response.ok) {
      console.error(
        'Failed to fetch transaction details:',
        response.statusText,
      );
      return null;
    }

    const transactionData = await response.json();

    // Transform snake_case API response to camelCase for our code
    return {
      transactionId: transactionData.transaction_id,
      blockTime: transactionData.block_time,
      isAccepted: transactionData.is_accepted,
      inputs: transactionData.inputs?.map((input: any) => ({
        previousOutpointAddress: input.previous_outpoint_address,
        previousOutpointAmount: input.previous_outpoint_amount,
      })),
      outputs: transactionData.outputs?.map((output: any) => ({
        scriptPublicKeyAddress: output.script_public_key_address,
        amount: output.amount,
      })),
    };
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}
