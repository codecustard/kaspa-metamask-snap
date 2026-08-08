import { generateAddress } from '../src/rpc/generateAddress';
import { getWallet } from '../src/util/wallet';

// Mock the snap global that's provided by MetaMask
// @ts-expect-error - Override the MetaMask SDK's snap declaration for testing
global.snap = {
  request: jest.fn(),
};

describe('Wallet functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAddress', () => {
    it('should return a valid Hoosat address format', async () => {
      // Mock successful wallet retrieval
      // @ts-expect-error - snap mock
      (global.snap.request as jest.Mock).mockResolvedValue({
        wallet: {
          address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
          privateKey: 'test-private-key',
        },
      });

      const result = await generateAddress();

      expect(result).toHaveProperty('address');
      expect(result.address).toMatch(/^hoosat:/u);
      expect(typeof result.address).toBe('string');
    });

    it('should throw instead of returning a fabricated address on error', async () => {
      // Mock wallet error on every snap.request call (state lookup, entropy
      // derivation, and the generateKeyPair fallback all fail)
      // @ts-expect-error - snap mock
      (global.snap.request as jest.Mock).mockRejectedValue(
        new Error('Wallet error'),
      );

      await expect(generateAddress()).rejects.toThrow('Wallet error');
    });
  });

  describe('getWallet', () => {
    it('should return existing wallet from state', async () => {
      const mockWallet = {
        address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
        privateKey: 'test-private-key',
      };

      // @ts-expect-error - snap mock
      (global.snap.request as jest.Mock).mockResolvedValue({
        wallet: mockWallet,
      });

      const result = await getWallet();

      expect(result).toStrictEqual(mockWallet);
      // @ts-expect-error - snap mock
      expect(global.snap.request).toHaveBeenCalledWith({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });
    });

    it('should create new wallet if none exists', async () => {
      // Mock no existing wallet
      // @ts-expect-error - snap mock
      (global.snap.request as jest.Mock)
        .mockResolvedValueOnce(null) // First call - no existing state
        .mockResolvedValueOnce({
          // Second call - entropy
          privateKey:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        })
        .mockResolvedValueOnce(undefined); // Third call - save state

      // Mock HoosatCrypto
      const mockImportKeyPair = jest.fn().mockReturnValue({
        address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
      });

      jest.doMock('hoosat-sdk-web', () => ({
        HoosatCrypto: {
          importKeyPair: mockImportKeyPair,
          generateKeyPair: jest.fn().mockReturnValue({
            address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
            privateKey: Buffer.from('test-key', 'hex'),
          }),
        },
      }));

      const result = await getWallet();

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('privateKey');
      expect(result.address).toMatch(/^hoosat:/u);
    });
  });
});
