/* eslint-disable no-restricted-globals */
// Global test setup
import { jest } from '@jest/globals';

// Mock fetch globally for all tests
// @ts-expect-error - Override fetch for testing environment
global.fetch = jest.fn();

// Mock the snap global that's provided by MetaMask
// @ts-expect-error - Override the MetaMask SDK's snap declaration for testing
global.snap = {
  request: jest.fn(),
};

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock HoosatSDK
jest.mock('hoosat-sdk-web', () => ({
  HoosatUtils: {
    sompiToAmount: jest.fn((amount: string) => {
      // Convert sompi to HTN (divide by 100000000)
      const sompi = parseInt(amount, 10);
      return sompi / 100000000;
    }),
    amountToSompi: jest.fn((amount: string | number) => {
      // Convert HTN to sompi (multiply by 100000000)
      const htn = typeof amount === 'string' ? parseFloat(amount) : amount;
      return (htn * 100000000).toString();
    }),
  },
  HoosatTxBuilder: jest.fn().mockImplementation(() => ({
    addInput: jest.fn().mockReturnThis(),
    addOutput: jest.fn().mockReturnThis(),
    setFee: jest.fn().mockReturnThis(),
    addChangeOutput: jest.fn().mockReturnThis(),
    sign: jest.fn().mockReturnValue('signed-transaction-data'),
  })),
  HoosatCrypto: {
    importKeyPair: jest.fn().mockReturnValue({
      address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
    }),
    generateKeyPair: jest.fn().mockReturnValue({
      address: 'hoosat:qr1234567890abcdef1234567890abcdef12345678',
      privateKey: Buffer.from('test-private-key', 'hex'),
    }),
  },
}));

export {};
