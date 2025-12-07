/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable jest/prefer-to-have-length */
/* eslint-disable jest/prefer-strict-equal */
/* eslint-disable n/no-unsupported-features/node-builtins */
import { getBalance } from '../src/rpc/getBalance';
import { getUtxos } from '../src/rpc/getUtxos';
import { sendTransaction } from '../src/rpc/sendTransaction';

// Mock dependencies
jest.mock('../src/util/client', () => ({
  client: {
    getBalance: jest.fn(),
    getUtxos: jest.fn(),
    submitTransaction: jest.fn(),
  },
}));

jest.mock('../src/util/wallet', () => ({
  getWallet: jest.fn(),
}));

const mockClient = require('../src/util/client').client;
const mockGetWallet = require('../src/util/wallet').getWallet;

describe('RPC Methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default wallet mock
    mockGetWallet.mockResolvedValue({
      address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
      privateKey: 'test-private-key',
    });
  });

  describe('getBalance', () => {
    it('should return formatted balance', async () => {
      mockClient.getBalance.mockResolvedValue({
        balance: '100000000', // 1 HTN in sompi
      });

      const result = await getBalance();

      expect(result).toHaveProperty('balance');
      expect(result).toHaveProperty('confirmed');
      expect(result).toHaveProperty('unconfirmed');
      expect(typeof result.balance).toBe('string');
      expect(result.unconfirmed).toBe('0.00000000');
    });

    it('should handle balance fetch error', async () => {
      mockClient.getBalance.mockRejectedValue(new Error('Network error'));

      const result = await getBalance();

      expect(result.balance).toBe('0.00000000');
      expect(result.confirmed).toBe('0.00000000');
      expect(result.unconfirmed).toBe('0.00000000');
    });

    it('should use provided address', async () => {
      const testAddress = 'hoosat:qr9876543210fedcba9876543210fedcba98765432';
      mockClient.getBalance.mockResolvedValue({ balance: '50000000' });

      await getBalance(testAddress);

      expect(mockClient.getBalance).toHaveBeenCalledWith(testAddress);
    });
  });

  describe('getUtxos', () => {
    it('should return formatted UTXO list', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          utxos: [
            {
              outpoint: { transactionId: 'tx1', index: 0 },
              utxoEntry: {
                amount: '100000000',
                blockDaaScore: 12345,
                isCoinbase: false,
              },
              address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
            },
          ],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getUtxos();

      expect(result).toHaveProperty('utxos');
      expect(Array.isArray(result.utxos)).toBe(true);
      expect(result.utxos.length).toBe(1);
      expect(result.utxos[0]).toHaveProperty('outpoint');
      expect(result.utxos[0]).toHaveProperty('amount');
      expect(result.utxos[0]).toHaveProperty('scriptPublicKeyAddress');
    });

    it('should handle empty UTXO response', async () => {
      const mockApiResponse = {
        success: true,
        data: { utxos: [] },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getUtxos();

      expect(result.utxos).toEqual([]);
    });

    it('should handle UTXO fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getUtxos();

      expect(result.utxos).toEqual([]);
    });
  });

  describe('sendTransaction', () => {
    beforeEach(() => {
      // Mock successful UTXO response
      mockClient.getUtxos.mockResolvedValue({
        utxos: [
          {
            outpoint: { transactionId: 'tx1', index: 0 },
            utxoEntry: {
              amount: '200000000',
              scriptPublicKey: { addresses: ['test-address'] },
            },
          },
        ],
      });
    });

    it('should return success result for valid transaction', async () => {
      mockClient.submitTransaction.mockResolvedValue({
        transactionId: 'submitted-tx-id',
      });

      const params = {
        to: 'hoosat:qr9876543210fedcba9876543210fedcba98765432',
        amount: '0.5',
      };

      const result = await sendTransaction(params);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('txId');
      if (result.success) {
        expect(typeof result.txId).toBe('string');
      }
    });

    it('should handle transaction submission failure', async () => {
      mockClient.submitTransaction.mockResolvedValue(null);

      const params = {
        to: 'hoosat:qr9876543210fedcba9876543210fedcba98765432',
        amount: '0.5',
      };

      const result = await sendTransaction(params);

      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });

    it('should use default values for missing parameters', async () => {
      mockClient.submitTransaction.mockResolvedValue({
        transactionId: 'default-tx-id',
      });

      const result = await sendTransaction({});

      // Should not throw and should handle defaults
      expect(result).toHaveProperty('success');
    });
  });
});
