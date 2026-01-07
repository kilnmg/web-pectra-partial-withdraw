<script lang="ts">
	import { transactionsStore } from '$stores/transactions';
	import { getBlockExplorerUrl, getBlockExplorerName } from '$utils/constants';
	import Card from './ui/card.svelte';
	import Badge from './ui/badge.svelte';
	import ValidatorLink from './ValidatorLink.svelte';

	export let chainId: number | undefined = undefined;

	$: transactions = $transactionsStore.history.slice(0, 5);
</script>

{#if transactions.length > 0}
	<Card>
		<div class="p-6">
			<h3 class="font-semibold mb-4">Recent Transactions</h3>
			<div class="space-y-4">
				{#each transactions as tx}
					<div class="text-sm border-b pb-3 last:border-0 last:pb-0">
						<div class="flex items-center justify-between mb-1">
							<span class="font-mono text-xs">{tx.hash.slice(0, 10)}...</span>
							<Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
								{tx.status}
							</Badge>
						</div>
						<p class="text-muted-foreground text-xs mb-1">
							{tx.isFull ? 'Full Exit' : `Withdraw ${tx.amountETH} ETH`}
						</p>
						<p class="text-muted-foreground text-xs mb-2">
							Validator: <ValidatorLink pubkey={tx.validatorPubkey} {chainId} className="text-xs" />
						</p>
						<a
							href={getBlockExplorerUrl(tx.hash, chainId)}
							target="_blank"
							rel="noopener noreferrer"
							class="text-primary hover:underline text-xs"
						>
							View on {getBlockExplorerName(chainId)} →
						</a>
					</div>
				{/each}
			</div>
		</div>
	</Card>
{/if}
