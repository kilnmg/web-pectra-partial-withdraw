<script lang="ts">
	import { account, chainId } from '$stores/wallet';
	import { switchNetwork } from '@wagmi/core';

	const MAINNET_CHAIN_ID = 1;
	const HOODI_CHAIN_ID = 560048;

	let isOpen = false;
	let isSwitching = false;

	$: currentChain = $chainId === MAINNET_CHAIN_ID ? 'mainnet' : $chainId === HOODI_CHAIN_ID ? 'hoodi' : 'unknown';
	$: isSupported = $chainId === MAINNET_CHAIN_ID || $chainId === HOODI_CHAIN_ID;

	async function switchToChain(targetChainId: number) {
		isSwitching = true;
		try {
			await switchNetwork({ chainId: targetChainId });
			isOpen = false;
		} catch (error) {
			console.error('Failed to switch network:', error);
		} finally {
			isSwitching = false;
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.chain-selector-wrapper')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

{#if $account.isConnected}
	<div class="chain-selector-wrapper relative">
		<button
			on:click|stopPropagation={toggleDropdown}
			class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted transition-colors text-sm font-medium"
			class:border-destructive={!isSupported}
		>
			<span class="w-2 h-2 rounded-full" class:bg-green-500={isSupported} class:bg-red-500={!isSupported}></span>
			<span>
				{#if currentChain === 'mainnet'}
					Ethereum
				{:else if currentChain === 'hoodi'}
					Hoodi
				{:else}
					Unknown Network
				{/if}
			</span>
			<svg
				class="w-4 h-4 transition-transform"
				class:rotate-180={isOpen}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if isOpen}
			<div class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border z-50">
				<div class="py-1">
					<div class="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
						Select Network
					</div>

					<button
						on:click={() => switchToChain(MAINNET_CHAIN_ID)}
						disabled={isSwitching || $chainId === MAINNET_CHAIN_ID}
						class="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 disabled:opacity-50"
					>
						<span class="w-2 h-2 rounded-full" class:bg-green-500={$chainId === MAINNET_CHAIN_ID} class:bg-gray-300={$chainId !== MAINNET_CHAIN_ID}></span>
						<div class="flex-1">
							<div class="text-sm font-medium">Ethereum Mainnet</div>
							<div class="text-xs text-muted-foreground">Chain ID: 1</div>
						</div>
						{#if $chainId === MAINNET_CHAIN_ID}
							<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{/if}
					</button>

					<button
						on:click={() => switchToChain(HOODI_CHAIN_ID)}
						disabled={isSwitching || $chainId === HOODI_CHAIN_ID}
						class="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 disabled:opacity-50"
					>
						<span class="w-2 h-2 rounded-full" class:bg-green-500={$chainId === HOODI_CHAIN_ID} class:bg-gray-300={$chainId !== HOODI_CHAIN_ID}></span>
						<div class="flex-1">
							<div class="text-sm font-medium">Hoodi Testnet</div>
							<div class="text-xs text-muted-foreground">Chain ID: 560048</div>
						</div>
						{#if $chainId === HOODI_CHAIN_ID}
							<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
