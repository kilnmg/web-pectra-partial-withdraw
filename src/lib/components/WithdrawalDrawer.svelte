<script lang="ts">
	import { uiStore } from '$stores/ui';
	import { transactionsStore } from '$stores/transactions';
	import { sendTransaction, waitForTransaction } from '@wagmi/core';
	import { Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';
	import Input from './ui/input.svelte';
	import Label from './ui/label.svelte';
	import Button from './ui/button.svelte';
	import Alert from './ui/alert.svelte';
	import ValidatorLink from './ValidatorLink.svelte';
	import { validateAmountInput } from '$utils/validation';
	import { validateWithdrawal, encodeWithdrawalData } from '$utils/transaction';
	import { WITHDRAWAL_CONTRACT_ADDRESS, getBlockExplorerUrl, getBlockExplorerName } from '$utils/constants';
	import { formatPubkey } from '$utils/formatting';

	export let chainId: number | undefined = undefined;

	let amountInput = '';
	let isSubmitting = false;
	let validationError = '';

	// Transaction status tracking
	let transactionHash: string | null = null;
	let transactionStatus: 'idle' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed' = 'idle';
	let transactionError: string | null = null;

	$: validator = $uiStore.selectedValidator;
	$: maxWithdrawable = validator?.maxWithdrawableETH || 0;

	function handleInput() {
		const inputValidation = validateAmountInput(amountInput);
		if (!inputValidation.valid) {
			validationError = inputValidation.error || '';
			return;
		}

		if (validator) {
			const withdrawalValidation = validateWithdrawal(validator.balanceETH, inputValidation.parsed!);
			validationError = withdrawalValidation.error || '';
		}
	}

	async function handlePartialWithdrawal() {
		if (!validator) return;

		const inputValidation = validateAmountInput(amountInput);
		if (!inputValidation.valid) return;

		const amount = inputValidation.parsed!;
		const withdrawalValidation = validateWithdrawal(validator.balanceETH, amount);
		if (!withdrawalValidation.valid) return;

		// Reset transaction state
		transactionHash = null;
		transactionStatus = 'signing';
		transactionError = null;
		isSubmitting = true;

		try {
			const txData = encodeWithdrawalData(validator.pubkey, amount);

			// User signing in wallet
			const { hash } = await sendTransaction({
				to: WITHDRAWAL_CONTRACT_ADDRESS,
				value: 1n,
				data: txData
			});

			// Transaction broadcast!
			transactionHash = hash;
			transactionStatus = 'broadcasting';

			transactionsStore.addTransaction({
				hash,
				validatorPubkey: validator.pubkey,
				amountETH: amount,
				isFull: false,
				status: 'pending',
				timestamp: Date.now()
			});

			// Wait for confirmation (show UI updates)
			transactionStatus = 'confirming';

			const receipt = await waitForTransaction({ hash });

			// Update based on result
			transactionStatus = receipt.status === 'success' ? 'confirmed' : 'failed';

			transactionsStore.updateTransaction(hash, {
				status: receipt.status === 'success' ? 'confirmed' : 'failed'
			});

			// Keep drawer open for 3 seconds to show success
			if (transactionStatus === 'confirmed') {
				await new Promise(resolve => setTimeout(resolve, 3000));
			}

			// Reset and close
			if (transactionStatus === 'confirmed') {
				uiStore.closeDrawer();
				amountInput = '';
				transactionHash = null;
				transactionStatus = 'idle';
				transactionError = null;
			}

		} catch (err) {
			console.error('Withdrawal error:', err);
			transactionStatus = 'failed';
			transactionError = err instanceof Error ? err.message : 'Transaction failed';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleFullWithdrawal() {
		if (!validator) return;

		const confirmed = confirm(
			`Are you sure you want to EXIT validator ${formatPubkey(validator.pubkey)}? This is permanent and irreversible.`
		);
		if (!confirmed) return;

		// Reset transaction state
		transactionHash = null;
		transactionStatus = 'signing';
		transactionError = null;
		isSubmitting = true;

		try {
			const txData = encodeWithdrawalData(validator.pubkey, 0);

			// User signing in wallet
			const { hash } = await sendTransaction({
				to: WITHDRAWAL_CONTRACT_ADDRESS,
				value: 1n,
				data: txData
			});

			// Transaction broadcast!
			transactionHash = hash;
			transactionStatus = 'broadcasting';

			transactionsStore.addTransaction({
				hash,
				validatorPubkey: validator.pubkey,
				amountETH: 0,
				isFull: true,
				status: 'pending',
				timestamp: Date.now()
			});

			// Wait for confirmation (show UI updates)
			transactionStatus = 'confirming';

			const receipt = await waitForTransaction({ hash });

			// Update based on result
			transactionStatus = receipt.status === 'success' ? 'confirmed' : 'failed';

			transactionsStore.updateTransaction(hash, {
				status: receipt.status === 'success' ? 'confirmed' : 'failed'
			});

			// Keep drawer open for 3 seconds to show success
			if (transactionStatus === 'confirmed') {
				await new Promise(resolve => setTimeout(resolve, 3000));
			}

			// Reset and close
			if (transactionStatus === 'confirmed') {
				uiStore.closeDrawer();
				amountInput = '';
				transactionHash = null;
				transactionStatus = 'idle';
				transactionError = null;
			}

		} catch (err) {
			console.error('Full withdrawal error:', err);
			transactionStatus = 'failed';
			transactionError = err instanceof Error ? err.message : 'Transaction failed';
		} finally {
			isSubmitting = false;
		}
	}

	function closeDrawer() {
		if (!isSubmitting) {
			uiStore.closeDrawer();
			amountInput = '';
			validationError = '';
			transactionHash = null;
			transactionStatus = 'idle';
			transactionError = null;
		}
	}
</script>

{#if $uiStore.drawerOpen}
	<!-- Drawer Overlay -->
	<div
		class="fixed inset-0 bg-black/50 z-40"
		on:click={closeDrawer}
		on:keydown={(e) => e.key === 'Escape' && closeDrawer()}
		role="button"
		tabindex="0"
	></div>

	<!-- Drawer Content -->
	<div
		class="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l border-border shadow-lg z-50 overflow-y-auto"
	>
		<div class="p-6">
			{#if validator}
				<!-- Header -->
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-2xl font-bold">Withdraw from Validator</h2>
					<button
						on:click={closeDrawer}
						class="text-muted-foreground hover:text-foreground"
						disabled={isSubmitting}
					>
						✕
					</button>
				</div>

				<!-- Validator Info -->
				<div class="space-y-6">
					<div>
						<p class="text-sm text-muted-foreground mb-1">Validator</p>
						<ValidatorLink pubkey={validator.pubkey} {chainId} showFull={true} className="text-xs break-all" />
					</div>

					<div>
						<p class="text-sm text-muted-foreground mb-1">Current Balance</p>
						<p class="text-3xl font-bold">{validator.balanceETH.toFixed(4)} ETH</p>
					</div>

					<div>
						<p class="text-sm text-muted-foreground mb-1">Max Partial Withdrawable Amount</p>
						<p class="text-2xl font-semibold text-green-600">
							{maxWithdrawable.toFixed(4)} ETH
						</p>
					</div>

					<!-- Amount Input -->
					<div class="space-y-2">
						<Label htmlFor="amount">Partial Withdrawal Amount (ETH)</Label>
						<Input
							id="amount"
							type="text"
							inputmode="decimal"
							placeholder="0.0"
							bind:value={amountInput}
							on:input={handleInput}
							disabled={isSubmitting}
						/>
						{#if validationError}
							<p class="text-sm text-destructive">{validationError}</p>
						{/if}
						<p class="text-xs text-muted-foreground">
							Maximum: {maxWithdrawable.toFixed(4)} ETH
						</p>
					</div>

					<!-- Info Alert -->
					<Alert>
						<strong>Important:</strong>
						<p class="text-sm mt-1">
							Validator must keep &gt;32 ETH. Partial withdrawals only affect excess balance.
						</p>
					</Alert>

					<!-- Action Buttons -->
					<div class="flex flex-col gap-3">
						<Button
							on:click={handlePartialWithdrawal}
							disabled={isSubmitting || !!validationError || !amountInput}
						>
							{isSubmitting ? 'Processing...' : 'Partial Withdrawal'}
						</Button>

						<Button variant="destructive" on:click={handleFullWithdrawal} disabled={isSubmitting}>
							Full Withdrawal (Exit)
						</Button>
					</div>

					<!-- Transaction Status Display -->
					{#if transactionHash}
						<div class="border-t pt-6 space-y-4">
							{#if transactionStatus === 'broadcasting'}
								<Alert>
									<div class="flex items-center gap-2">
										<Loader2 class="w-4 h-4 animate-spin" />
										<strong>Transaction Broadcast</strong>
									</div>
									<p class="text-sm mt-1">Your transaction has been broadcast to the network.</p>
								</Alert>
							{:else if transactionStatus === 'confirming'}
								<Alert>
									<div class="flex items-center gap-2">
										<Loader2 class="w-4 h-4 animate-spin" />
										<strong>Waiting for Confirmation</strong>
									</div>
									<p class="text-sm mt-1">Your transaction is being confirmed on-chain...</p>
								</Alert>
							{:else if transactionStatus === 'confirmed'}
								<Alert>
									<div class="flex items-center gap-2">
										<CheckCircle class="w-4 h-4 text-green-600" />
										<strong>Transaction Confirmed!</strong>
									</div>
									<p class="text-sm mt-1">Your withdrawal request has been successfully submitted.</p>
								</Alert>
							{:else if transactionStatus === 'failed'}
								<Alert variant="destructive">
									<div class="flex items-center gap-2">
										<AlertCircle class="w-4 h-4" />
										<strong>Transaction Failed</strong>
									</div>
									{#if transactionError}
										<p class="text-sm mt-1">{transactionError}</p>
									{/if}
								</Alert>
							{/if}

							<!-- Transaction Hash Link -->
							<div class="bg-muted p-3 rounded-lg space-y-2">
								<p class="text-xs font-semibold text-muted-foreground uppercase">Transaction Hash</p>
								<code class="block text-xs font-mono break-all">{transactionHash}</code>
								<a
									href={getBlockExplorerUrl(transactionHash, chainId)}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
								>
									View on {getBlockExplorerName(chainId)} →
								</a>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
