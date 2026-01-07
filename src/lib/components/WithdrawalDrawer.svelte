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

	export let chainId: number | undefined = undefined;

	let amountInput = '';
	let isSubmitting = false;
	let validationError = '';
	let verificationChecked = false;

	// Transaction status tracking
	let transactionHash: string | null = null;
	let transactionStatus: 'idle' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed' = 'idle';
	let transactionError: string | null = null;

	$: validator = $uiStore.selectedValidator;
	$: maxWithdrawable = validator?.maxWithdrawableETH || 0;

	// Calculate transaction data preview for partial withdrawal
	$: transactionDataPreview = validator && amountInput
		? (() => {
				const inputValidation = validateAmountInput(amountInput);
				if (!inputValidation.valid) return null;
				try {
					return encodeWithdrawalData(validator.pubkey, inputValidation.parsed!);
				} catch {
					return null;
				}
			})()
		: null;

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

	function closeDrawer() {
		if (!isSubmitting) {
			uiStore.closeDrawer();
			amountInput = '';
			validationError = '';
			verificationChecked = false;
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
		class="fixed right-0 top-0 h-full w-full sm:w-90 bg-background border-l border-border shadow-lg z-50 overflow-y-auto"
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

					<!-- Transaction Verification Section -->
					<div class="border border-orange-300 bg-orange-50 rounded-lg p-4 space-y-3">
						<div class="flex items-start gap-2">
							<div class="text-orange-600 font-bold text-xl mt-0.5">⚠️</div>
							<div class="flex-1">
								<h4 class="font-semibold text-orange-900 mb-2">Verify Transaction on Your Device</h4>
								<p class="text-sm text-orange-800 mb-3">
									Before signing, you MUST verify these 3 items on your wallet screen:
								</p>

								<div class="space-y-3 text-sm">
									<!-- 1. Contract Address -->
									<div class="bg-white rounded p-3 border border-orange-200">
										<p class="font-semibold text-orange-900 mb-1">1. Contract Address (To)</p>
										<code class="block text-xs font-mono break-all bg-orange-100 p-2 rounded">
											{WITHDRAWAL_CONTRACT_ADDRESS}
										</code>
										<a
											href={chainId === 560048
												? `https://hoodi.etherscan.io/address/${WITHDRAWAL_CONTRACT_ADDRESS}`
												: `https://etherscan.io/address/${WITHDRAWAL_CONTRACT_ADDRESS}`}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
										>
											View on {chainId === 560048 ? 'Hoodi Scan' : 'Etherscan'} →
										</a>
										<p class="text-xs text-orange-700 mt-1">
											⚠️ This is the official EIP-7002 withdrawal contract. Never sign if it's different!
										</p>
									</div>

									<!-- 2. Value -->
									<div class="bg-white rounded p-3 border border-orange-200">
										<p class="font-semibold text-orange-900 mb-1">2. Value</p>
										<code class="block text-xs font-mono bg-orange-100 p-2 rounded">
											1 Wei (0.000000000000000001 ETH)
										</code>
										<p class="text-xs text-orange-700 mt-1">
											This is the required fee to call the withdrawal contract.
										</p>
									</div>

									<!-- 3. Data -->
									<div class="bg-white rounded p-3 border border-orange-200">
										<p class="font-semibold text-orange-900 mb-1">3. Data (Hex)</p>
										{#if transactionDataPreview}
											<div class="space-y-2">
												<!-- Color-coded hex data -->
												<div class="bg-orange-100 p-2 rounded max-h-20 overflow-y-auto">
													<code class="block text-xs font-mono break-all">
														<span class="text-gray-600">0x</span><span class="bg-blue-200 text-blue-900 px-0.5">{transactionDataPreview.slice(2, 98)}</span><span class="bg-green-200 text-green-900 px-0.5">{transactionDataPreview.slice(98)}</span>
													</code>
												</div>

												<!-- Legend -->
												<div class="flex flex-wrap gap-2 text-xs">
													<div class="flex items-center gap-1.5">
														<div class="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
														<span class="text-orange-900">Validator Public Key (96 chars)</span>
													</div>
													<div class="flex items-center gap-1.5">
														<div class="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
														<span class="text-orange-900">Withdrawal Amount (16 chars)</span>
													</div>
												</div>

												<!-- Detailed breakdown -->
												<div class="pt-2 border-t border-orange-200 space-y-2 text-xs text-orange-700">
													<div class="bg-blue-50 p-2 rounded">
														<p class="font-semibold text-blue-900 mb-1">📋 Validator Public Key:</p>
														<code class="block font-mono text-blue-800 break-all">
															0x{transactionDataPreview.slice(2, 98)}
														</code>
													</div>

													<div class="bg-green-50 p-2 rounded">
														<p class="font-semibold text-green-900 mb-1">💰 Withdrawal Amount:</p>
														<code class="block font-mono text-green-800">
															0x{transactionDataPreview.slice(98)}
														</code>
														{#if amountInput}
															<p class="mt-1 text-green-800">
																= <strong>{parseFloat(amountInput).toFixed(9)} ETH</strong> (the amount you entered above)
															</p>
														{/if}
													</div>
												</div>
											</div>
										{:else}
											<p class="text-xs text-orange-600 italic">
												Enter a withdrawal amount above to see the transaction data preview
											</p>
										{/if}
									</div>
								</div>

								<div class="mt-3 pt-3 border-t border-orange-300 space-y-2">
									<label class="flex items-start gap-2 cursor-pointer">
										<input
											type="checkbox"
											bind:checked={verificationChecked}
											class="mt-1 w-4 h-4 rounded border-orange-300"
											disabled={isSubmitting}
										/>
										<span class="text-sm text-orange-900 font-medium">
											I acknowledge that I am solely responsible for verifying the contract address, transaction value, and transaction data displayed in my wallet prior to signing. I further acknowledge that Kiln and its team shall not be liable for any loss of funds resulting from my actions, omissions, or mismanagement of my validator.
										</span>
									</label>
								</div>
							</div>
						</div>
					</div>

					<!-- Action Button -->
					<div>
						<Button
							on:click={handlePartialWithdrawal}
							disabled={isSubmitting || !!validationError || !amountInput || !verificationChecked}
							class="w-full"
						>
							{isSubmitting ? 'Processing...' : 'Withdraw'}
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
