import { configureChains, createConfig } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import type { Chain } from '@wagmi/core/chains';

// Define Holesky (Hoodi) testnet chain
export const hoodi: Chain = {
	id: 560048,
	name: 'Holesky (Hoodi)',
	network: 'hoodi',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH'
	},
	rpcUrls: {
		default: { http: ['https://0xrpc.io/hoodi'] },
		public: { http: ['https://0xrpc.io/hoodi'] }
	},
	testnet: true
};

// Configure chains with both mainnet and Hoodi
const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet, hoodi],
	[
		jsonRpcProvider({
			rpc: (chain) => ({
				http: chain.id === 560048 ? 'https://0xrpc.io/hoodi' : 'https://eth.llamarpc.com'
			})
		})
	]
);

// Create wagmi config for Ethereum mainnet and Hoodi testnet
export const config = createConfig({
	autoConnect: true,
	connectors: [
		new InjectedConnector({
			chains,
			options: {
				name: 'MetaMask'
			}
		}),
		new InjectedConnector({
			chains,
			options: {
				name: 'Coinbase Wallet'
			}
		})
	],
	publicClient,
	webSocketPublicClient
});

export { chains };
