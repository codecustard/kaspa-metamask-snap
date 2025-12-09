# Hoosnap - Hoosat Wallet MetaMask Snap

A MetaMask Snap that provides wallet functionality for the Hoosat Network, enabling users to manage HTN tokens directly within MetaMask.

## Features

- **Wallet Management**: Generate and manage Hoosat Network addresses
- **Balance Tracking**: View HTN token balances in real-time
- **Transaction History**: Browse and view detailed transaction records with pagination
- **Send Transactions**: Send HTN tokens to other addresses with confirmation flow
- **UTXO Management**: View and compound UTXOs for optimal transaction efficiency
- **Address Generation**: Get receive addresses with QR codes
- **Security**: Uses MetaMask's secure entropy for private key generation

## Installation

### From NPM (Production)

```bash
# Install the snap from npm registry
npm install -g hoosnap@0.1.2
```

### Development Setup

```bash
# Clone the repository
git clone https://github.com/codecustard/kaspa-metamask-snap.git
cd kaspa-metamask-snap

# Install dependencies
yarn install

# Build the snap
yarn build

# Start development server
yarn start
```

## Usage

1. **Install MetaMask Flask** (required for snap development)
2. **Add the Snap** to MetaMask:

   - Production: `npm:hoosnap@0.1.2`
   - Development: Connect to `http://localhost:8000`

3. **Access Wallet Features**:
   - View your HTN balance on the home page
   - Send tokens using the "Send" button
   - Receive tokens by sharing your address/QR code
   - View transaction history with detailed information
   - Manage UTXOs and compound when needed

## API Methods

The snap exposes the following RPC methods for dApp integration:

### `getAddress`

Returns the current wallet address.

```javascript
const address = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:hoosnap',
    request: { method: 'getAddress' },
  },
});
```

### `getBalance`

Returns the current wallet balance.

```javascript
const balance = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:hoosnap',
    request: { method: 'getBalance' },
  },
});
```

### `sendTransaction`

Send HTN tokens to an address.

```javascript
const result = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:hoosnap',
    request: {
      method: 'sendTransaction',
      params: {
        to: 'hoosat:qr...',
        amount: '1.0',
      },
    },
  },
});
```

## Security

- **Private Key Management**: Uses MetaMask's BIP32 entropy for secure key generation
- **No Console Logging**: Production build removes all debug logging
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Testing

```bash
# Run unit tests
yarn test

# Run security scan
npm install -g @sayfer_io/snapper
snapper --path /path/to/snap

# Lint code
yarn lint
```

## Development

### Project Structure

```
src/
├── index.tsx              # Main snap entry point
├── listeners/             # Event handlers
│   ├── onHomePage.tsx    # Home page UI handler
│   ├── onUserInput.tsx   # User interaction handler
│   └── onRpcRequest.tsx  # RPC method handler
├── rpc/                  # RPC method implementations
│   ├── getBalance.ts     # Balance queries
│   ├── sendTransaction.ts # Transaction sending
│   ├── getUtxos.ts      # UTXO management
│   └── compoundTransaction.ts # UTXO compounding
├── ui/                   # User interface components
│   ├── home/            # Home page components
│   ├── send/            # Send transaction flow
│   └── components/      # Reusable UI components
└── util/                # Utility functions
    ├── client.ts        # API client
    └── wallet.ts        # Wallet management
```

### Building

```bash
# Build for production
yarn build

# Build and watch for changes
yarn dev
```

## Network Information

- **Network**: Hoosat Mainnet
- **API Endpoint**: https://proxy.hoosat.net
- **Explorer**: https://explorer.hoosat.fi
- **Token Symbol**: HTN
- **Decimals**: 8

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on [GitHub](https://github.com/codecustard/kaspa-metamask-snap/issues)
- Join the Hoosat community for network-specific questions

---

**Note**: This snap requires MetaMask Flask for development and testing. Production users can install directly from the npm registry once allowlisted by MetaMask.
