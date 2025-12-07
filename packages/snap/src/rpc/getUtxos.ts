import { HoosatUtils } from 'hoosat-sdk-web';

import { getWallet } from '../util/wallet';

export type UTXO = {
  outpoint: {
    transactionId: string;
    index: number;
  };
  amount: string;
  rawAmount?: string;
  scriptPublicKeyAddress: string;
  blockDaaScore?: number;
  isCoinbase?: boolean;
  [key: string]: any;
};

/**
 * Get UTXOs for an address from Hoosat network
 *
 * @param address - Wallet address to fetch UTXOs for
 * @returns Promise that resolves to UTXOs list
 */
export async function getUtxos(address?: string): Promise<{ utxos: UTXO[] }> {
  try {
    let walletAddress = address;

    if (!walletAddress) {
      const wallet = await getWallet();
      walletAddress = wallet.address;
    }

    // Fetch UTXOs using the Hoosat API
    const utxosResponse = await fetch(
      `https://proxy.hoosat.net/api/v1/address/utxos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: [walletAddress] }),
      },
    );

    if (!utxosResponse.ok) {
      console.error('Failed to fetch UTXOs:', utxosResponse.statusText);
      return { utxos: [] };
    }

    const utxosData = await utxosResponse.json();

    if (!utxosData.success || !utxosData.data) {
      console.error('Invalid UTXOs response:', utxosData);
      return { utxos: [] };
    }

    const utxos: UTXO[] = [];

    if (utxosData.data.utxos && Array.isArray(utxosData.data.utxos)) {
      for (const utxo of utxosData.data.utxos) {
        // Parse the correct API structure
        const rawAmount = utxo.utxoEntry?.amount || '0';
        const amountInHst = HoosatUtils.sompiToAmount(rawAmount);

        utxos.push({
          outpoint: {
            transactionId: utxo.outpoint?.transactionId || 'unknown',
            index: utxo.outpoint?.index ?? 0,
          },
          amount: amountInHst.toString(),
          rawAmount: rawAmount.toString(), // Add for debugging
          scriptPublicKeyAddress: utxo.address || walletAddress,
          blockDaaScore: utxo.utxoEntry?.blockDaaScore,
          isCoinbase: utxo.utxoEntry?.isCoinbase || false,
        });
      }
    }

    // Sort by amount (largest first)
    utxos.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    return { utxos };
  } catch (error) {
    console.error('Error fetching UTXOs:', error);
    return { utxos: [] };
  }
}
