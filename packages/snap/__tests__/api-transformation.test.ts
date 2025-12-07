/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable n/no-unsupported-features/node-builtins */
import { getTransactionDetails } from '../src/rpc/getTransactionDetails';

describe('API Transformation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionDetails', () => {
    it('should transform snake_case API response to camelCase', async () => {
      const mockApiResponse = {
        transaction_id: 'abc123',
        block_time: '2023-12-06T10:00:00Z',
        is_accepted: true,
        inputs: [
          {
            previous_outpoint_address:
              'hoosat:qr1234567890abcdef1234567890abcdef12345678',
            previous_outpoint_amount: '100000000',
          },
        ],
        outputs: [
          {
            script_public_key_address:
              'hoosat:qr9876543210fedcba9876543210fedcba98765432',
            amount: '50000000',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getTransactionDetails('abc123');

      expect(result).not.toBeNull();

      // Check camelCase transformation
      expect(result!.transactionId).toBe('abc123');
      expect(result!.blockTime).toBe('2023-12-06T10:00:00Z');
      expect(result!.isAccepted).toBe(true);

      // Check inputs transformation
      expect(result!.inputs).toBeDefined();
      expect(result!.inputs?.[0]?.previousOutpointAddress).toBe(
        'hoosat:qr1234567890abcdef1234567890abcdef12345678',
      );
      expect(result!.inputs?.[0]?.previousOutpointAmount).toBe('100000000');

      // Check outputs transformation
      expect(result!.outputs).toBeDefined();
      expect(result!.outputs?.[0]?.scriptPublicKeyAddress).toBe(
        'hoosat:qr9876543210fedcba9876543210fedcba98765432',
      );
      expect(result!.outputs?.[0]?.amount).toBe('50000000');

      // Ensure snake_case properties don't exist
      expect((result as any).transaction_id).toBeUndefined();
      expect((result as any).block_time).toBeUndefined();
      expect((result as any).is_accepted).toBeUndefined();
    });

    it('should handle API response with missing optional fields', async () => {
      const mockApiResponse = {
        transaction_id: 'def456',
        // Missing block_time, is_accepted, inputs, outputs
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await getTransactionDetails('def456');

      expect(result).not.toBeNull();

      expect(result!.transactionId).toBe('def456');
      expect(result!.blockTime).toBeUndefined();
      expect(result!.isAccepted).toBeUndefined();
      expect(result!.inputs).toBeUndefined();
      expect(result!.outputs).toBeUndefined();
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getTransactionDetails('error-tx');

      expect(result).toBeNull();
    });

    it('should handle HTTP error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      const result = await getTransactionDetails('not-found');

      expect(result).toBeNull();
    });

    it('should make request to correct API endpoint', async () => {
      const mockApiResponse = {
        transaction_id: 'test123',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      await getTransactionDetails('test123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.network.hoosat.fi/transactions/test123?resolve_previous_outpoints=light',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
    });
  });
});
