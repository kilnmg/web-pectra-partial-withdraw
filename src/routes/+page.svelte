<script lang="ts">
	import { account, chainId } from '$stores/wallet';
	import { validatorsStore } from '$stores/validators';
	import WalletConnect from '$components/WalletConnect.svelte';
	import ChainSelector from '$components/ChainSelector.svelte';
	import ValidatorList from '$components/ValidatorList.svelte';
	import WithdrawalDrawer from '$components/WithdrawalDrawer.svelte';
	import TransactionStatus from '$components/TransactionStatus.svelte';
	import EducationalContent from '$components/EducationalContent.svelte';
	import FAQ from '$components/FAQ.svelte';
	import type { Validator } from '$types/validator';

	const MAINNET_CHAIN_ID = 1;
	const HOODI_CHAIN_ID = 560048;

	// Fetch validators when connected on supported networks
	$: if ($account.isConnected && $account.address && $chainId) {
		if ($chainId === MAINNET_CHAIN_ID || $chainId === HOODI_CHAIN_ID) {
			fetchValidators($account.address, $chainId);
		}
	} else if (!$account.isConnected) {
		validatorsStore.reset();
	}

	async function switchToMainnet() {
		try {
			await account.switchToMainnet();
		} catch (error) {
			console.error('Failed to switch to mainnet:', error);
			validatorsStore.setError(
				'Please switch to Ethereum Mainnet in your wallet to use this application.'
			);
		}
	}

	async function fetchValidators(address: string, chainId: number) {
		validatorsStore.setLoading(true);

		try {
			const response = await fetch(`/api/validators?address=${address}&chainId=${chainId}`);

			if (!response.ok) {
				throw new Error(`API error: ${response.statusText}`);
			}

			const data = await response.json();
			const validators: Validator[] = data.validators.map((v: any) => ({
				...v,
				balance: BigInt(v.balance),
				effectiveBalance: BigInt(v.effectiveBalance)
			}));

			validatorsStore.setData(validators);
		} catch (err) {
			console.error('Failed to fetch validators:', err);
			validatorsStore.setError(
				err instanceof Error ? err.message : 'Failed to fetch validators'
			);
		}
	}
</script>

<svelte:head>
	<title>Pectra Validator Withdrawal - Validator ETH Withdrawals</title>
	<meta
		name="description"
		content="Withdraw ETH from your validators using EIP-7002 withdrawal system"
	/>
</svelte:head>

<main class="min-h-screen bg-background">
	<div class="container mx-auto px-4 py-8 max-w-7xl">
		<!-- Header -->
		<header class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h1 class="text-4xl font-bold">Pectra Validator Withdrawal</h1>
				<p class="text-muted-foreground mt-2">
					Withdraw ETH from your validators using EIP-7002
				</p>
			</div>
			<div class="flex items-center gap-3">
				<ChainSelector />
				<WalletConnect />
			</div>
		</header>

		<!-- Educational Content - Always Visible -->
		<div class="mb-12">
			<EducationalContent />
		</div>

		{#if !$account.isConnected}
			<!-- Empty State: Not Connected -->
			<div class="text-center py-16 border-2 border-dashed border-border rounded-lg bg-card">
				<div class="text-6xl mb-4">🔌</div>
				<h2 class="text-2xl font-bold mb-2">Connect Your Wallet</h2>
				<p class="text-muted-foreground mb-6 max-w-md mx-auto">
					Connect your Ethereum wallet to view your validators and manage withdrawals. Only wallets
					with validator withdrawal credentials can access this feature.
				</p>
				<div class="flex justify-center">
					<WalletConnect />
				</div>
			</div>
		{:else if $chainId && $chainId !== MAINNET_CHAIN_ID && $chainId !== HOODI_CHAIN_ID}
			<!-- Unsupported Network -->
			<div class="text-center py-16 border-2 border-dashed border-destructive rounded-lg bg-card">
				<div class="text-6xl mb-4">⚠️</div>
				<h2 class="text-2xl font-bold mb-2 text-destructive">Unsupported Network</h2>
				<p class="text-muted-foreground mb-6 max-w-md mx-auto">
					This application only works on Ethereum Mainnet and Hoodi Testnet. Please switch your wallet to one of these networks.
				</p>
				<button
					on:click={switchToMainnet}
					class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
				>
					Switch to Ethereum Mainnet
				</button>
			</div>
		{:else}
			<!-- Validators & Transactions -->
			<div class="space-y-8">
				<ValidatorList chainId={$chainId} />
				<FAQ />
				<TransactionStatus chainId={$chainId} />
			</div>
		{/if}

		<!-- Withdrawal Drawer (Modal) -->
		<WithdrawalDrawer chainId={$chainId} />

		<!-- Footer -->
		<footer class="p-2 my-6 flex flex-wrap items-center justify-center gap-x-1 text-center text-muted-foreground">
			made with
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-red-500">
				<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
			</svg>
			by <a href="https://www.nakamotards.com/" class="underline hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">nakamotards</a>
			and powered by
			<a href="https://docs.api.kiln.fi/docs/quickstart" class="underline hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Kiln Connect API</a>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" fill="none" class="w-5 h-5">
				<path d="M18.1623 10.8522C18.3729 10.6355 18.6629 10.5031 18.9848 10.5031C19.3066 10.5031 19.5927 10.6315 19.7994 10.8442L24.9093 16.0042C25.3225 16.4215 25.9941 16.4215 26.4073 16.0042L30.4722 11.8994C30.8854 11.4821 30.8854 10.804 30.4722 10.3867L21.957 1.77597C20.3199 0.122853 17.6616 0.122853 16.0245 1.77597L7.50134 10.3827C7.08809 10.8 7.08809 11.4781 7.50134 11.8954L11.5662 16.0002C11.9795 16.4175 12.651 16.4175 13.0643 16.0002L18.1662 10.8482L18.1623 10.8522Z" fill="#FF6521"></path>
				<path d="M36.0476 16.0084L34.1999 14.1426C33.7866 13.7253 33.1151 13.7253 32.7019 14.1426L19.7999 27.171C19.5933 27.3797 19.3032 27.5121 18.9853 27.5121C18.6674 27.5121 18.3813 27.3837 18.1707 27.175L5.27273 14.1426C4.85948 13.7253 4.18796 13.7253 3.77472 14.1426L1.92703 16.0084C0.289947 17.6615 0.289947 20.3458 1.92703 21.999L16.0211 36.2312C17.6582 37.8844 20.3164 37.8844 21.9535 36.2312L36.0476 21.999C37.6847 20.3458 37.6847 17.6615 36.0476 16.0084Z" fill="#FFF"></path>
			</svg>
		</footer>
	</div>
</main>
