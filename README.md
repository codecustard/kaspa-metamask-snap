# Hoosnap - Hoosat Network MetaMask Snap

> **Experience the power of Hoosat's lightning-fast transactions directly in MetaMask**

Hoosnap is a MetaMask Snap that brings native Hoosat Network (HTN) support to MetaMask, enabling users to send, receive, and manage HTN tokens with secure, non-custodial wallet functionality and fast transaction speeds.

## 🚀 Features

- **⚡ Lightning Fast Transactions** - Experience near-instant confirmations with Hoosat's blockDAG technology
- **🔒 Secure & Non-Custodial** - Your private keys never leave MetaMask
- **📊 Real-Time Insights** - Track transaction history and monitor UTXO health
- **🔧 Advanced UTXO Management** - UTXO compounding and optimization tools
- **🌐 Seamless Integration** - Built natively for MetaMask using Snaps technology
- **🌍 Open Source** - Fully open source and community-driven

## 🏁 Quick Start

### Prerequisites

- [MetaMask Flask](https://metamask.io/flask/) (required for Snaps)
- Node.js 18.6.0 or higher
- Yarn package manager

### Installation

1. **Clone the repository**

   ```shell
   git clone https://github.com/your-org/kaspa-metamask-snap.git
   cd kaspa-metamask-snap
   ```

2. **Install dependencies**

   ```shell
   yarn install
   ```

3. **Start development environment**

   ```shell
   yarn start
   ```

4. **Open the local website**
   - Navigate to `http://localhost:8000`
   - Follow the installation prompts to connect Hoosnap to MetaMask Flask

## 🏗️ Architecture

This monorepo contains two main packages:

### 📦 Packages

- **`packages/snap/`** - The MetaMask Snap implementation

  - Written in TypeScript
  - Handles Hoosat wallet operations, transactions, and UTXO management
  - Integrates with Hoosat Network APIs

- **`packages/site/`** - The landing page and documentation
  - Built with Gatsby and React
  - Modern UI for snap installation and interaction
  - Real-time connection status and error handling

## 🛠️ Development

### Running the Snap

```shell
# Start both snap and website in development mode
yarn start

# Or run individually
yarn workspace snap start    # Snap development
yarn workspace site start   # Website development
```

### Testing

```shell
# Run all tests
yarn test

# Run snap tests only
yarn workspace snap test

# Run tests with coverage
yarn test --coverage
```

### Linting and Formatting

```shell
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Format code
yarn prettier:write
```

## 📚 Snap Functionality

### Core Features

- **Wallet Management** - Generate and manage Hoosat addresses
- **Balance Checking** - Real-time HTN balance updates
- **Transaction Sending** - Send HTN with custom fees and recipients
- **Transaction History** - View complete transaction history with pagination
- **UTXO Operations** - View, compound, and optimize UTXOs
- **Network Status** - Monitor connection to Hoosat Network

### API Integration

The snap integrates with:

- **Hoosat Network APIs** for transaction broadcasting
- **Hoosat Explorer** for transaction details and history
- **Hoosat SDK** for cryptographic operations and UTXO management

## 🌐 Network Information

- **Network**: Hoosat Mainnet
- **Token**: HTN (Hoosat Token)
- **Explorer**: [https://explorer.hoosat.fi/](https://explorer.hoosat.fi/)
- **API**: Hoosat Network REST API

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective packages:

**`packages/snap/.env`**

```env
# Snap configuration
SNAP_ENV=development
```

**`packages/site/.env`**

```env
# Website configuration
GATSBY_SNAP_ORIGIN=local:http://localhost:8080
```

### Customization

- **Snap behavior** - Modify `packages/snap/src/index.ts`
- **UI components** - Update files in `packages/snap/src/ui/`
- **API endpoints** - Configure in `packages/snap/src/api/`

## 🚀 Deployment

### Building for Production

```shell
# Build both packages
yarn build

# Build snap only
yarn workspace snap build

# Build website only
yarn workspace site build
```

### Publishing the Snap

1. Update version in `packages/snap/package.json`
2. Build the snap: `yarn workspace snap build`
3. The built snap will be in `packages/snap/dist/`
4. Follow MetaMask's publishing guidelines for snap distribution

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `yarn test`
5. Lint your code: `yarn lint:fix`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🔒 Security

Hoosnap prioritizes security:

- **No Private Key Exposure** - Private keys are generated and stored securely within MetaMask
- **Isolated Execution** - Runs in MetaMask's secure Snaps environment
- **Open Source** - All code is publicly auditable
- **Regular Updates** - Actively maintained with security patches

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Hoosat Network**: [https://network.hoosat.fi/](https://network.hoosat.fi/)
- **Hoosat Explorer**: [https://explorer.hoosat.fi/](https://explorer.hoosat.fi/)
- **MetaMask Snaps**: [https://metamask.io/snaps/](https://metamask.io/snaps/)
- **MetaMask Flask**: [https://metamask.io/flask/](https://metamask.io/flask/)

## ❓ Support

Need help?

- 📖 Check the [documentation](docs/)
- 🐛 Report issues on [GitHub Issues](https://github.com/your-org/kaspa-metamask-snap/issues)
- 💬 Join our community discussions
- 📧 Contact the development team

---

**Built with ❤️ for the Hoosat Network community**
