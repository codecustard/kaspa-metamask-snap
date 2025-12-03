
import { HoosatTxBuilder, HoosatUtils } from 'hoosat-sdk-web';
import { client } from '../util/client';
import { getWallet } from '../util/wallet';

export interface SendTransactionParams {
  to?: string;
  amount?: string;
  fromPrivateKey?: string;
  [key: string]: any;
}

export interface SendTransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Send transaction
 */
export async function sendTransaction(params: SendTransactionParams): Promise<SendTransactionResult> {
  try {
    const wallet = await getWallet();
    const amount = params.amount || '0.1';
    const recipientAddress = params.to || 'hoosat:qr1234567890abcdef1234567890abcdef12345678';

    // Get UTXOs using SDK
    const utxos = await client.getUtxos([wallet.address]);

    console.log('SDK UTXO response:', utxos);

    if (!utxos || !utxos.utxos || utxos.utxos.length === 0) {
      return {
        success: false,
        error: `No UTXOs available from SDK. Response: ${JSON.stringify(utxos)}`,
      };
    }

    // Build transaction using Hoosat SDK
    const builder = new HoosatTxBuilder();

    // Add inputs from UTXOs
    utxos.utxos.forEach(utxo => {
      const privateKeyBuffer = Buffer.from(wallet.privateKey, 'hex');
      builder.addInput(utxo, privateKeyBuffer);
    });

    // Add outputs and change
    builder
      .addOutput(recipientAddress, HoosatUtils.amountToSompi(amount))
      .setFee('5000')
      .addChangeOutput(wallet.address);

    // Sign the transaction
    const signedTx = builder.sign();
    console.log('SDK signed transaction:', signedTx);

    // Submit to network using SDK
    const result = await client.submitTransaction(signedTx);
    console.log('SDK submit result:', result);

    if (result && result.transactionId) {
      return {
        success: true,
        txId: result.transactionId,
      };
    } else {
      return {
        success: false,
        error: `SDK submit failed: ${JSON.stringify(result)}`,
      };
    }
  } catch (error) {
    console.error('Send transaction error:', error);

    // Try to show UTXO data if available
    let debugInfo = '';
    try {
      const debugWallet = await getWallet();
      const debugUtxos = await client.getUtxos([debugWallet.address]);
      debugInfo = ` UTXO Debug: ${JSON.stringify(debugUtxos?.utxos?.[0] || 'No UTXOs')}`;
    } catch (debugError) {
      debugInfo = ' (Debug fetch failed)';
    }

    return {
      success: false,
      error: `Transaction failed: ${error instanceof Error ? error.message : String(error)}.${debugInfo}`,
    };
  }
}

/**
 * Test TxBuilder functionality
 */
export async function testTxBuilder(): Promise<SendTransactionResult> {
  try {
    const wallet = await getWallet();

    // Fetch UTXOs
    const utxosResponse = await fetch(`https://proxy.hoosat.net/api/v1/address/utxos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: [wallet.address] })
    });
    const utxosResult = await utxosResponse.json();

    if (!utxosResult.success || !utxosResult.data || !utxosResult.data.utxos || utxosResult.data.utxos.length === 0) {
      return {
        success: false,
        error: `No UTXOs available for test`,
      };
    }

    // Try to isolate the HoosatTxBuilder issue
    try {
      new HoosatTxBuilder();
      return {
        success: true,
        error: 'TxBuilder created successfully - no immediate error'
      };
    } catch (builderError) {
      return {
        success: false,
        error: `TxBuilder creation failed: ${builderError instanceof Error ? builderError.message : 'Unknown error'}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}