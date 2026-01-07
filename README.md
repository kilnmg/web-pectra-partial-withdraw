# Pectra Validator Withdrawal

A production-ready web application that provides a simple, guided interface for Ethereum validators to perform **partial** and **full withdrawals** using the EIP-7002 withdrawal system. Built with SvelteKit and powered by the Kiln Connect API.

## Purpose

This application universally allows any Ethereum validator operator to:

- **Withdraw excess balance** (partial withdrawals) while keeping their validator active
- **Permanently exit validators** (full withdrawals) through an intuitive interface
- **Monitor transaction status** in real-time with block explorer integration
- **Manage multiple validators** from a single wallet connection

The interface guides users through the withdrawal process with built-in validation, educational content, and comprehensive error handling - making validator management accessible to operators of all experience levels.

## Features

### Core Functionality
- 🔌 **Multi-Wallet Support**: Connect with MetaMask or Coinbase Wallet
- 💰 **Partial Withdrawals**: Withdraw excess balance (above 32 ETH) while maintaining validator status
- 🚪 **Full Withdrawals**: Initiate permanent validator exits with confirmation prompts
- 🌐 **Multi-Chain Support**: Works on Ethereum Mainnet and Hoodi Testnet
- 📊 **Validator Dashboard**: View all your validators with real-time balance information

### Transaction Management
- ⚡ **Real-Time Status Updates**: Track transactions from signing through confirmation
- 🔗 **Block Explorer Integration**: Direct links to Etherscan (mainnet) or Hoodi Scan (testnet)
- 📜 **Transaction History**: View recent withdrawal transactions with status
- 🎯 **Smart Validation**: Automatic checks to prevent invalid withdrawals

### User Experience
- 📚 **Educational Content**: Comprehensive guides about validator withdrawals and EIP-7002
- ❓ **FAQ Section**: Common questions and answers about the withdrawal process
- ⚠️ **Error Handling**: Clear error messages and recovery suggestions
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile devices

## How It Works

### Partial Withdrawals

1. **Connect your wallet** that controls validator withdrawal credentials
2. **Select a validator** from your dashboard
3. **Enter amount** to withdraw (only excess balance above 32 ETH)
4. **Sign transaction** in your wallet
5. **Monitor status** as transaction is broadcast and confirmed
6. **View on block explorer** to track on-chain progress

### Full Withdrawals (Validator Exit)

1. **Select validator** to exit
2. **Confirm exit** (permanent and irreversible)
3. **Sign transaction** to submit exit request
4. **Track confirmation** in real-time
5. **Wait for exit processing** on the beacon chain (can take days/weeks)

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **pnpm**
- **Kiln API Keys** (get from [Kiln Connect](https://kiln.fi))
- **Ethereum Wallet** with validator withdrawal credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-pectra-partial-withdraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Kiln API keys:
   ```env
   # Required: Kiln API key for Ethereum Mainnet
   KILN_API_KEY=your_mainnet_api_key_here

   # Optional: Kiln API key for Hoodi Testnet
   KILN_TESTNET_API_KEY=your_testnet_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**

   Navigate to [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## Deployment

This application is optimized for deployment on **Vercel**.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

**Required Environment Variables:**
- `KILN_API_KEY` - Your Kiln API key for mainnet

**Optional Environment Variables:**
- `KILN_TESTNET_API_KEY` - For Hoodi testnet support

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Deployment Checklist

✅ Using `@sveltejs/adapter-auto` (auto-detects Vercel)
✅ Node.js 18+ specified in package.json
✅ Build scripts configured
✅ Environment variables documented
✅ SSR and API routes supported

The application will work on other platforms (Netlify, Cloudflare Pages) but Vercel is recommended for optimal performance.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KILN_API_KEY` | Yes | Kiln API key for Ethereum Mainnet validator data |
| `KILN_TESTNET_API_KEY` | No | Kiln API key for Hoodi Testnet validator data |

### Getting API Keys

- **Kiln API Key**: Sign up at [kiln.fi](https://kiln.fi) to get your API credentials

## Supported Networks

| Network | Chain ID | Block Explorer |
|---------|----------|----------------|
| Ethereum Mainnet | 1 | [etherscan.io](https://etherscan.io) |
| Hoodi Testnet | 560048 | [hoodi.etherscan.io](https://hoodi.etherscan.io) |

## Tech Stack

### Frontend
- **SvelteKit** - Full-stack framework with SSR
- **Svelte 5** - Reactive UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn-svelte** - Component library

### Web3 Integration
- **@wagmi/core** - Ethereum wallet connection and management
- **viem** - TypeScript interface for Ethereum

### APIs & Services
- **Kiln Connect API** - Validator data and staking information
- **EIP-7002 Contract** - Execution layer withdrawal system

## Architecture

```
src/
├── lib/
│   ├── components/         # Svelte components
│   │   ├── ui/            # Reusable UI components
│   │   ├── ValidatorList.svelte
│   │   ├── ValidatorCard.svelte
│   │   ├── WithdrawalDrawer.svelte    # Main withdrawal interface
│   │   ├── TransactionStatus.svelte   # Transaction history
│   │   └── ...
│   ├── stores/            # Svelte stores for state management
│   │   ├── wallet.ts      # Wallet connection state
│   │   ├── validators.ts  # Validator data
│   │   └── transactions.ts # Transaction history
│   ├── utils/             # Utility functions
│   │   ├── constants.ts   # Contract addresses, chain configs
│   │   ├── transaction.ts # EIP-7002 encoding/decoding
│   │   ├── validation.ts  # Input validation
│   │   └── formatting.ts  # Display formatting
│   └── types/             # TypeScript type definitions
├── routes/
│   ├── api/
│   │   └── validators/    # API endpoint for validator data
│   └── +page.svelte       # Main application page
└── app.html               # HTML template
```

## Key Components

### WithdrawalDrawer
Side drawer interface for initiating withdrawals with:
- Real-time balance display
- Amount input with validation
- Transaction status tracking
- Block explorer links

### ValidatorList
Dashboard showing all validators with:
- Current balance and effective balance
- Withdrawable amount calculation
- Validator state (active/pending/exited)
- Quick action buttons

### TransactionStatus
Transaction history component displaying:
- Recent withdrawal transactions (last 5)
- Transaction status (pending/confirmed/failed)
- Links to block explorers
- Validator information

## Development

### Type Checking
```bash
npm run check
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## Important Notes

### Security
- **Never share your private keys or seed phrases**
- This application only requests transaction signatures - it never has access to your private keys
- Always verify transaction details in your wallet before signing
- Use hardware wallets for maximum security

### Withdrawal Mechanics
- **Partial withdrawals** withdraw excess balance but keep validator active
- **Full withdrawals** are permanent and irreversible - validator cannot be reactivated
- Validators must maintain **at least 32 ETH** balance
- Withdrawal processing time varies based on network conditions and exit queue

### EIP-7002
This application uses the [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) execution layer triggerable withdrawals system, allowing validators to trigger exits and partial withdrawals directly from the execution layer.

**Withdrawal Contract Address**: `0x00000961Ef480Eb55e80D19ad83579A64c007002`

## Testing

For testing on mainnet, you can use this example wallet address: `0x02D50e49e11Fef1CA36660113b53fc5494DB7c2f`

For Hoodi testnet, make sure you have:
1. Set `KILN_TESTNET_API_KEY` in your `.env`
2. Switched your wallet to Hoodi network (Chain ID: 560048)
3. Have Hoodi testnet ETH for gas fees

## Resources

- **EIP-7002 Specification**: [eips.ethereum.org/EIPS/eip-7002](https://eips.ethereum.org/EIPS/eip-7002)
- **Withdrawal Simulator**: [pectrified.com](https://pectrified.com/mainnet/simulator/withdrawals)
- **Kiln Documentation**: [docs.api.kiln.fi](https://docs.api.kiln.fi/docs/quickstart)
- **Ethereum Staking Guide**: [ethereum.org/staking](https://ethereum.org/en/staking/)

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the FAQ section in the application
- Review the educational content for guidance

## License

MIT

---

**Made with ❤️ by [nakamotards](https://www.nakamotards.com/) • Powered by [Kiln Connect API](https://docs.api.kiln.fi/docs/quickstart)**
