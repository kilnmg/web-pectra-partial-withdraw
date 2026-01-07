<script lang="ts">
	import { validatorsStore } from '$stores/validators';
	import { uiStore } from '$stores/ui';
	import ValidatorCard from './ValidatorCard.svelte';
	import LoadingState from './LoadingState.svelte';
	import Alert from './ui/alert.svelte';

	export let chainId: number | undefined = undefined;

	$: withdrawableValidators = $validatorsStore.data.filter(
		(v) => v.state === 'active' && v.maxWithdrawableETH > 0
	);

	$: activeValidators = $validatorsStore.data.filter((v) => v.state === 'active');
</script>

{#if $validatorsStore.loading}
	<LoadingState />
{:else if $validatorsStore.error}
	<Alert variant="destructive">
		<strong>Error:</strong> {$validatorsStore.error}
	</Alert>
{:else if $validatorsStore.data.length === 0}
	<Alert>
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">
				No Validators Found, connect another wallet
			</h2>
		</div>
		<p class="mt-1 text-sm">
			No validators found for this wallet address. Make sure your wallet controls validator withdrawal credentials.
		</p>
	</Alert>
{:else if withdrawableValidators.length === 0}
	<Alert>
		<strong>No Withdrawable Validators</strong>
		<p class="mt-1 text-sm">
			You have {activeValidators.length} active validator(s), but none have excess balance available for withdrawal.
			Validators must have more than 32 ETH to make partial withdrawals.
		</p>
	</Alert>
{:else}
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">
				Validators ({activeValidators.length})
			</h2>
		</div>

		<div class="grid gap-4">
			{#each activeValidators as validator (validator.pubkey)}
				<ValidatorCard {validator} {chainId} onWithdraw={uiStore.openDrawer} />
			{/each}
		</div>
	</div>
{/if}
