<script lang="ts">
	import Card from './ui/card.svelte';
	import Alert from './ui/alert.svelte';
	import {
		PECTRA_SIMULATOR_URL,
		WITHDRAWAL_CONTRACT_ADDRESS,
		WITHDRAWAL_CONTRACT_ETHERSCAN_URL
	} from '$utils/constants';

	const EIP_7002_URL = 'https://eips.ethereum.org/EIPS/eip-7002';
</script>

<div class="space-y-6">
	<!-- Overview -->
	<Card>
		<div class="p-6 space-y-4">
			<h2 class="text-3xl font-bold">📚 Validator Withdrawal Guide</h2>
			<p class="text-muted-foreground">
				Learn how to safely withdraw ETH from your validators using the
				<a
					href={EIP_7002_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline font-semibold"
				>
					EIP-7002
				</a>
				execution layer triggerable withdrawals system.
				This guide will help you understand the process, requirements, and safety considerations.
			</p>
		</div>
	</Card>

	<!-- What is EIP-7002 -->
	<Card>
		<div class="p-6 space-y-4">
			<h2 class="text-2xl font-bold">🔐 What is EIP-7002?</h2>
			<p class="text-sm text-muted-foreground">
				<a
					href={EIP_7002_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline font-semibold"
				>
					EIP-7002: Execution Layer Triggerable Withdrawals
				</a>
				is an Ethereum Improvement Proposal that enables validators to initiate partial
				withdrawals directly from their execution layer (0x01) withdrawal credentials.
			</p>

			<div class="bg-blue-50 border border-blue-200 rounded p-4 space-y-3">
				<h4 class="font-semibold text-blue-900">
					🎯 Why EIP-7002 Matters
				</h4>
				<div class="text-sm text-blue-800 space-y-2">
					<p>
						<strong>Before EIP-7002:</strong> Only a validator's active BLS signing key (hot key) could
						trigger exits. If you entrusted your validator operations to a third party, you couldn't
						independently exit your validator without their cooperation.
					</p>
					<p>
						<strong>After EIP-7002:</strong> The owner of the withdrawal credentials (cold key) can now
						independently trigger exits and partial withdrawals directly from the execution layer,
						eliminating the need to trust third-party operators with exit control.
					</p>
					<p class="pt-2 border-t border-blue-300">
						<strong>Security Benefit:</strong> This separates custody (who owns the funds) from operations
						(who runs the validator), allowing you to maintain full control over your staked ETH while
						delegating validator operations.
					</p>
				</div>
			</div>
		</div>
	</Card>

	<!-- Withdrawal Types -->
	<div class="grid gap-4">
		<Card>
			<div class="p-6 space-y-3">
				<div class="flex items-start gap-3">
					<div class="text-2xl">💰</div>
					<div class="flex-1">
						<h3 class="text-xl font-semibold mb-2">Partial Withdrawal</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Withdraw excess balance above 32 ETH while keeping your validator active.
						</p>
						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="text-green-600">✓</span>
								<span>Validator continues validating</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-green-600">✓</span>
								<span>Keeps earning rewards</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-green-600">✓</span>
								<span>Can repeat multiple times</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>

	</div>

	<!-- How It Works -->
	<Card>
		<div class="p-6 space-y-4">
			<h3 class="text-xl font-bold">🔧 How Withdrawals Work</h3>

			<div class="space-y-4">
				<div class="flex gap-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
						1
					</div>
					<div>
						<h4 class="font-semibold mb-1">Connect Your Wallet</h4>
						<p class="text-sm text-muted-foreground">
							Connect the wallet that controls your validator's withdrawal credentials.
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
						2
					</div>
					<div>
						<h4 class="font-semibold mb-1">Select a Validator</h4>
						<p class="text-sm text-muted-foreground">
							Choose which validator to withdraw from. Only validators with >32 ETH can make partial withdrawals.
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
						3
					</div>
					<div>
						<h4 class="font-semibold mb-1">Specify Amount</h4>
						<p class="text-sm text-muted-foreground">
							Enter the withdrawal amount in ETH. Your validator must retain at least 32 ETH.
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
						4
					</div>
					<div>
						<h4 class="font-semibold mb-1">Sign Transaction</h4>
						<p class="text-sm text-muted-foreground">
							Review and sign the transaction. It's sent to the EIP-7002 withdrawal system contract.
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
						5
					</div>
					<div>
						<h4 class="font-semibold mb-1">Wait for Processing</h4>
						<p class="text-sm text-muted-foreground">
							Your withdrawal request is queued and processed by the beacon chain.
						</p>
					</div>
				</div>
			</div>
		</div>
	</Card>

	<!-- How It Works (Simplified) -->
	<Card>
		<div class="p-6 space-y-4">
			<h3 class="text-xl font-bold">⚙️ How the Withdrawal System Works</h3>

			<p class="text-sm text-muted-foreground">
				The EIP-7002 withdrawal system uses a smart contract on Ethereum to handle withdrawal
				requests. When you submit a withdrawal, your transaction goes into a queue and gets
				processed by the network.
			</p>

			<div class="space-y-4 text-sm">
				<div>
					<h4 class="font-semibold mb-2">The Withdrawal Contract</h4>
					<a
						href={WITHDRAWAL_CONTRACT_ETHERSCAN_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="block bg-muted p-3 rounded font-mono text-xs break-all hover:bg-muted/80 transition-colors text-primary hover:underline"
					>
						{WITHDRAWAL_CONTRACT_ADDRESS}
					</a>
					<p class="text-muted-foreground mt-2 text-xs">
						<strong>Always verify this contract address before signing!</strong> This is the official
						EIP-7002 withdrawal system contract. Click to view on Etherscan.
					</p>
				</div>

				<div class="bg-blue-50 border border-blue-200 rounded p-4 space-y-2">
					<h4 class="font-semibold text-blue-900 text-sm">
						📋 What Information is Sent?
					</h4>
					<ul class="space-y-1 text-xs text-blue-800">
						<li class="flex items-start gap-2">
							<span>•</span>
							<span
								><strong>Your Wallet Address:</strong> Proves you own the withdrawal credentials</span
							>
						</li>
						<li class="flex items-start gap-2">
							<span>•</span>
							<span><strong>Validator Public Key:</strong> Which validator to withdraw from</span>
						</li>
						<li class="flex items-start gap-2">
							<span>•</span>
							<span><strong>Amount:</strong> How much ETH to withdraw (in Gwei)</span>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="font-semibold mb-2">💰 Transaction Fee</h4>
					<p class="text-muted-foreground text-xs">
						The minimum fee is <strong>1 wei</strong> (plus regular gas fees). In times of high demand,
						the contract may charge more to prevent spam. This application automatically handles the fee
						for you.
					</p>
				</div>

				<div>
					<h4 class="font-semibold mb-2">🔒 Security</h4>
					<p class="text-muted-foreground text-xs">
						Only the owner of the validator's withdrawal credentials (your wallet) can initiate
						withdrawals. The contract verifies your ownership before accepting the request.
					</p>
				</div>

				<div class="text-xs text-center pt-2">
					<a
						href={EIP_7002_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:underline font-semibold"
					>
						Read the full EIP-7002 technical specification →
					</a>
				</div>

			</div>
		</div>
	</Card>

	<!-- Transaction Example -->
	<Card id="transaction-example">
		<div class="p-6 space-y-4">
			<h3 class="text-xl font-bold">📝 Transaction Example</h3>
			<p class="text-sm text-muted-foreground">
				A withdrawal request is executed via a regular Ethereum transaction. The transaction is sent
				to the withdrawals system contract with a message containing the validator public key and
				the amount to be withdrawn, signed with your wallet (the withdrawal credential owner).
			</p>

			<Alert>
				<strong>⚠️ Always verify the transaction details before signing!</strong>
			</Alert>

			<div class="space-y-4">
				<div>
					<h4 class="font-semibold mb-3 text-sm">
						Example: Partial Withdrawal of ~0.2 ETH from Validator
					</h4>
					<div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
						<!-- From -->
						<div class="space-y-1">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								From
							</div>
							<code
								class="block text-xs font-mono bg-background px-3 py-2 rounded border break-all"
							>
								0x02D50e49e11Fef1CA36660113b53fc5494DB7c2f
							</code>
							<p class="text-xs text-muted-foreground">
								Your wallet address (must own the validator's withdrawal credentials)
							</p>
						</div>

						<!-- To -->
						<div class="space-y-1">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								To
							</div>
							<a
								href={WITHDRAWAL_CONTRACT_ETHERSCAN_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="block text-xs font-mono bg-background px-3 py-2 rounded border break-all hover:bg-muted transition-colors text-primary hover:underline"
							>
								{WITHDRAWAL_CONTRACT_ADDRESS}
							</a>
							<p class="text-xs text-muted-foreground">
								EIP-7002 withdrawal system contract (always verify this address!). Click to view on
								Etherscan.
							</p>
						</div>

						<!-- Value -->
						<div class="space-y-1">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Value
							</div>
							<code class="block text-xs font-mono bg-background px-3 py-2 rounded border">
								1 wei
							</code>
							<p class="text-xs text-muted-foreground">
								Minimum fee to submit the withdrawal request
							</p>
						</div>

						<!-- Message Data -->
						<div class="space-y-2">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Transaction Data (Message)
							</div>
							<div
								class="block text-xs font-mono bg-background px-3 py-2 rounded border break-all leading-relaxed"
							>
								<span class="text-muted-foreground">0x</span><span
									class="bg-blue-200 text-blue-900 px-0.5"
									>a70f6d3541ddbc148f6fa4d3f4a576b42f468f3979cae7ee6d44fe48131fd5c93aaf08c09ceda8a3284a590c756ba624</span
								><span
									class="bg-green-200 text-green-900 px-0.5"
									>000000000c0e2864</span
								>
							</div>
							<div class="flex items-center gap-4 text-xs">
								<div class="flex items-center gap-1.5">
									<div class="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
									<span class="text-muted-foreground">Validator Pubkey (48 bytes)</span>
								</div>
								<div class="flex items-center gap-1.5">
									<div class="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
									<span class="text-muted-foreground">Amount (8 bytes)</span>
								</div>
							</div>

							<div class="bg-blue-50 border border-blue-200 rounded p-3 space-y-2 mt-2">
								<p class="text-xs font-semibold text-blue-900">
									Message Breakdown:
								</p>
								<div class="space-y-2 text-xs font-mono">
									<div class="bg-background rounded p-2 border border-blue-300">
										<div class="text-blue-600 font-semibold mb-1">
											Validator Public Key (48 bytes):
										</div>
										<code class="break-all text-foreground">
											a70f6d3541ddbc148f6fa4d3f4a576b42f468f3979cae7ee6d44fe48131fd5c93aaf08c09ceda8a3284a590c756ba624
										</code>
									</div>
									<div class="bg-background rounded p-2 border border-green-300">
										<div class="text-green-600 font-semibold mb-1">
											Amount (8 bytes):
										</div>
										<code class="break-all text-foreground">000000000c0e2864</code>
										<div class="mt-1 text-muted-foreground">
											= 0x0c0e2864 = 202,254,436 Gwei = <strong
												class="text-green-600">0.202254436 ETH</strong
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-3 text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-3">
						<strong class="text-yellow-900">Note:</strong> The amount is encoded
						in Gwei (1 ETH = 1,000,000,000 Gwei) as an 8-byte big-endian unsigned integer. This application
						handles the conversion automatically for you.
					</div>
				</div>
			</div>
		</div>
	</Card>

	<!-- Safety -->
	<Card>
		<div class="p-6 space-y-4">
			<h3 class="text-xl font-bold">🛡️ Safety & Best Practices</h3>

			<Alert>
				<strong>⚠️ Important Safety Tips:</strong>
				<ul class="list-disc list-inside mt-2 space-y-1 text-sm">
					<li>Always verify the contract address before signing</li>
					<li>Ensure validator has >32 ETH for partial withdrawals</li>
					<li>Double-check amount sent to the contract here it should be always about 1 wei</li>
				</ul>
			</Alert>

			<div class="bg-blue-50 border border-blue-200 rounded p-4">
				<h4 class="font-semibold mb-2 text-blue-900">
					💡 Alternative: Explore the Pectrified Simulator for manual partial withdraw with your Ledger
				</h4>
				<p class="text-sm text-blue-800 mb-3">
					Before submitting any transaction, test it and review it, Pectrified withdrawal simulator is a good way to do it out side of this app.
				</p>
				<a
					href={PECTRA_SIMULATOR_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
				>
					Open Pectrified Simulator →
				</a>
			</div>
		</div>
	</Card>

</div>
