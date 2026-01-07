<script lang="ts">
	import { account } from '$stores/wallet';
	import Button from './ui/button.svelte';
	import { formatAddress } from '$utils/formatting';

	async function handleConnect() {
		try {
			await account.connect();
		} catch (error) {
			console.error('Failed to connect:', error);
		}
	}

	async function handleDisconnect() {
		try {
			await account.disconnect();
		} catch (error) {
			console.error('Failed to disconnect:', error);
		}
	}
</script>

{#if $account.isConnected && $account.address}
	<div class="flex items-center gap-2">
		<span class="text-sm font-medium">{formatAddress($account.address)}</span>
		<Button variant="outline" size="sm" on:click={handleDisconnect}>Disconnect</Button>
	</div>
{:else}
	<Button on:click={handleConnect}>Connect Wallet</Button>
{/if}
