import { writable, derived } from 'svelte/store';
import { getAccount, watchAccount, connect, disconnect, switchNetwork, getNetwork, watchNetwork } from '@wagmi/core';
import { config } from '$config/wagmi';
import { mainnet } from '@wagmi/core/chains';
import type { GetAccountResult } from '@wagmi/core';

// Create a store for the account state
function createAccountStore() {
	const { subscribe, set } = writable<GetAccountResult>(getAccount());

	// Watch for account changes
	const unwatch = watchAccount((account) => {
		set(account);
	});

	return {
		subscribe,
		connect: async (connectorId?: string) => {
			try {
				const connector = connectorId
					? config.connectors.find((c) => c.id === connectorId)
					: config.connectors[0];

				if (!connector) {
					throw new Error('No connector found');
				}

				await connect({ connector });
			} catch (error) {
				console.error('Failed to connect:', error);
				throw error;
			}
		},
		disconnect: async () => {
			try {
				await disconnect();
			} catch (error) {
				console.error('Failed to disconnect:', error);
				throw error;
			}
		},
		switchToMainnet: async () => {
			try {
				await switchNetwork({ chainId: mainnet.id });
			} catch (error) {
				console.error('Failed to switch network:', error);
				throw error;
			}
		}
	};
}

// Create a store for network/chain state
function createNetworkStore() {
	const { subscribe, set } = writable(getNetwork());

	// Watch for network changes
	const unwatch = watchNetwork((network) => {
		set(network);
	});

	return { subscribe };
}

export const account = createAccountStore();
export const network = createNetworkStore();

// Derived stores for convenience
export const isConnected = derived(account, ($account) => $account.isConnected);
export const address = derived(account, ($account) => $account.address);
export const chainId = derived(network, ($network) => $network.chain?.id);
