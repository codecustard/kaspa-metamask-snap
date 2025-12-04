import { HoosatTxBuilder, HoosatUtils } from 'hoosat-sdk-web';
import { client } from '../util/client';
import { getWallet } from '../util/wallet';

export interface CompoundTransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
  utxosConsolidated?: number;
  totalAmount?: string;
  [key: string]: any;
}

/**
 * Compound/consolidate UTXOs by sending all available UTXOs to yourself
 * This creates fewer, larger UTXOs which reduces transaction complexity
 */
export async function compoundTransaction(): Promise<CompoundTransactionResult> {
  try {
    const wallet = await getWallet();

    // Get fresh UTXOs (wait a moment to ensure we have the latest state)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const utxos = await client.getUtxos([wallet.address]);

    console.log('Compound - UTXO response:', utxos);

    if (!utxos || !utxos.utxos || utxos.utxos.length === 0) {
      return {
        success: false,
        error: 'No UTXOs available to compound',
        utxosConsolidated: 0,
      };
    }

    // Check if we have enough UTXOs to make compounding worthwhile
    if (utxos.utxos.length < 2) {
      return {
        success: false,
        error: 'Only one UTXO available - compounding not necessary',
        utxosConsolidated: utxos.utxos.length,
      };
    }

    // Calculate total available amount
    let totalAmount = 0;
    utxos.utxos.forEach(utxo => {
      totalAmount += parseInt(utxo.utxoEntry?.amount || '0');
    });

    console.log(`Compounding ${utxos.utxos.length} UTXOs with total amount: ${totalAmount} sompi`);

    // Build transaction using Hoosat SDK
    const builder = new HoosatTxBuilder();

    // Add all UTXOs as inputs
    utxos.utxos.forEach(utxo => {
      const privateKeyBuffer = Buffer.from(wallet.privateKey, 'hex');
      builder.addInput(utxo, privateKeyBuffer);
    });

    // Set fee (0.0001 KAS per UTXO as per Kaspa docs)
    const feePerUtxo = 10000; // 0.0001 KAS in sompi
    const totalFee = (utxos.utxos.length * feePerUtxo).toString();

    // Add single output back to yourself (minus fees)
    // This will consolidate all UTXOs into one
    const outputAmount = totalAmount - parseInt(totalFee);

    if (outputAmount <= 0) {
      return {
        success: false,
        error: `Insufficient funds to cover fees. Total: ${HoosatUtils.sompiToAmount(totalAmount.toString())} HTN, Fee: ${HoosatUtils.sompiToAmount(totalFee)} HTN`,
        utxosConsolidated: utxos.utxos.length,
      };
    }

    builder
      .addOutput(wallet.address, outputAmount.toString())
      .setFee(totalFee);

    // Sign the transaction
    const signedTx = builder.sign();
    console.log('Compound - signed transaction:', signedTx);

    // Submit to network using SDK
    const result = await client.submitTransaction(signedTx);
    console.log('Compound - submit result:', result);

    if (result && result.transactionId) {
      const totalAmountHTN = HoosatUtils.sompiToAmount(totalAmount.toString());
      return {
        success: true,
        txId: result.transactionId,
        utxosConsolidated: utxos.utxos.length,
        totalAmount: totalAmountHTN.toString(),
      };
    } else {
      return {
        success: false,
        error: `Compound transaction submit failed: ${JSON.stringify(result)}`,
        utxosConsolidated: utxos.utxos.length,
      };
    }
  } catch (error) {
    console.error('Compound transaction error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for common error patterns
    if (errorMessage.toLowerCase().includes('spent') ||
        errorMessage.toLowerCase().includes('missing') ||
        errorMessage.toLowerCase().includes('not found')) {
      return {
        success: false,
        error: 'UTXOs already spent or unavailable. Please refresh your UTXOs and try again.',
        utxosConsolidated: 0,
      };
    }

    // Try to get debug info
    let debugInfo = '';
    try {
      const debugWallet = await getWallet();
      const debugUtxos = await client.getUtxos([debugWallet.address]);
      debugInfo = ` Current UTXO Count: ${debugUtxos?.utxos?.length || 0}`;
    } catch (debugError) {
      debugInfo = ' (Debug fetch failed)';
    }

    return {
      success: false,
      error: `Compound transaction failed: ${errorMessage}.${debugInfo}`,
      utxosConsolidated: 0,
    };
  }
}

/**
 * Check if wallet should suggest compounding
 * Returns true if UTXO count is high enough to warrant consolidation
 */
export async function shouldSuggestCompound(): Promise<{ suggest: boolean; utxoCount: number }> {
  try {
    const wallet = await getWallet();
    const utxos = await client.getUtxos([wallet.address]);

    const utxoCount = utxos?.utxos?.length || 0;

    // Suggest compounding if more than 10 UTXOs
    // Based on Kaspa limits: ~85 UTXOs max per transaction, so suggest well before that
    const suggest = utxoCount > 10;

    return { suggest, utxoCount };
  } catch (error) {
    console.error('Error checking compound suggestion:', error);
    return { suggest: false, utxoCount: 0 };
  }
}