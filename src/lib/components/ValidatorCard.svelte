<script lang="ts">
	import type { Validator } from '$types/validator';
	import Card from './ui/card.svelte';
	import Badge from './ui/badge.svelte';
	import Button from './ui/button.svelte';
	import ValidatorLink from './ValidatorLink.svelte';

	export let validator: Validator;
	export let chainId: number | undefined = undefined;
	export let onWithdraw: (v: Validator) => void;

	$: badgeVariant = (validator.state === 'active' ? 'default' : 'secondary') as
		| 'default'
		| 'secondary';
</script>

<Card>
	<div class="p-6">
		<div class="flex items-start justify-between mb-4">
			<div class="space-y-2">
				<ValidatorLink pubkey={validator.pubkey} {chainId} className="text-sm text-muted-foreground" />
				<Badge variant={badgeVariant}>
					{validator.state}
				</Badge>
			</div>
			<Button size="sm" on:click={() => onWithdraw(validator)} disabled={validator.maxWithdrawableETH <= 0}>
				Withdraw
			</Button>
		</div>

		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Balance:</span>
				<span class="font-semibold">{validator.balanceETH.toFixed(4)} ETH</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Effective Balance:</span>
				<span class="font-medium">{validator.effectiveBalanceETH.toFixed(4)} ETH</span>
			</div>
		</div>
	</div>
</Card>
