<script lang="ts">
	import Card from './ui/card.svelte';
</script>

<Card>
	<div class="p-6 space-y-4">
		<h3 class="text-2xl font-bold">❓ Frequently Asked Questions</h3>

		<div class="space-y-4">

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					How long does a withdrawal take? Does it go into a queue like validator exits?
				</h4>
				<p class="text-sm text-muted-foreground mb-2">
					Yes, partial withdrawals go through the same exit queue as full validator exits. The process
					consists of three phases:
				</p>
				<ul class="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-2">
					<li>
						<strong>Exit Queue:</strong> Between 0 and 7 days (varies based on network demand)
					</li>
					<li><strong>Processing Delay:</strong> Additional 27 hours 50 minutes</li>
					<li>
						<strong>Sweep Delay:</strong> Partial withdrawals <strong
							class="text-green-600">skip this step</strong
						> (full exits wait up to 8.7 days)
					</li>
				</ul>
				<p class="text-sm text-muted-foreground mb-2">
					<strong>Key Advantage:</strong> While both partial withdrawals and full exits go through the
					same initial queue, partial withdrawals bypass the sweep delay that exited validators must
					wait through. This makes partial withdrawals significantly faster overall than full validator
					exits.
				</p>
				<div
					class="text-xs bg-blue-50 border border-blue-200 rounded p-2 mt-2"
				>
					<p class="text-blue-900">
						📊 Check current queue times:
						<a
							href="https://www.validatorqueue.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="text-primary hover:underline font-semibold ml-1"
						>
							ValidatorQueue.com →
						</a>
					</p>
				</div>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					Does my validator continue earning rewards while the withdrawal is processing?
				</h4>
				<p class="text-sm text-muted-foreground mb-2">
					<strong class="text-green-600">Yes!</strong> Your validator continues
					to earn rewards on the it's effective balance until the withdrawal actually completes and hits your
					wallet.
				</p>
				<p class="text-sm text-muted-foreground mb-2">
					For example, if your validator has 50 ETH and you withdraw 10 ETH:
				</p>
				<ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
					<li>
						<strong>During the queue:</strong> Your validator keeps earning rewards on all 50 ETH
					</li>
					<li>
						<strong>After withdrawal completes:</strong> Your effective balance drops to 40 ETH and
						rewards adjust accordingly
					</li>
				</ul>
				<p class="text-sm text-muted-foreground mt-2">
					This means you continue to benefit from your excess balance throughout the entire withdrawal
					process - from the moment you submit the transaction until the ETH arrives in your wallet.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					What happens after my validator exits? Can I withdraw my full balance?
				</h4>
				<p class="text-sm text-muted-foreground">
					After a full exit, your validator stops validating and all remaining ETH is sent to your
					withdrawal address. However, full exits require waiting through the sweep delay (up to 8.7
					days) in addition to the exit queue. The validator cannot be reactivated once exited.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">Can I cancel a withdrawal request?</h4>
				<p class="text-sm text-muted-foreground">
					No. Once a withdrawal transaction is confirmed on-chain, it cannot be cancelled. The
					request enters the queue and will be processed. Always verify all details before signing the
					transaction.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">Can I do multiple partial withdrawals?</h4>
				<p class="text-sm text-muted-foreground">
					Yes! You can perform multiple partial withdrawals as long as your validator maintains a
					balance above 32 ETH after each withdrawal. There's no limit to the number of partial
					withdrawals you can make.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					How does the ethereum protocol fee mechanism work? Why sometimes more than 1 wei?
				</h4>
				<p class="text-sm text-muted-foreground">
					The contract uses dynamic pricing similar to EIP-1559. The minimum fee is 1 wei when the
					queue is empty or below target. If many people are requesting withdrawals at once (more than
					2 per block), the fee increases exponentially to prevent spam. The formula is approximately:
					<code class="text-xs">fee = 1 wei × e^(excess_requests/17)</code>.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">How many withdrawal requests can be processed per block?</h4>
				<p class="text-sm text-muted-foreground">
					The system can process up to <strong>16 withdrawal requests per block</strong>. If there
					are more than 16 pending requests, they wait in a queue. Don't worry - your transaction
					won't fail if the queue is full; it will just wait its turn to be processed.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">What if I send the wrong amount of ETH with the transaction?</h4>
				<p class="text-sm text-muted-foreground">
					You must send at least the minimum fee (1 wei or more if dynamic pricing is active).
					<strong>Overpayments are not refunded</strong>, so only send the exact amount required. This
					application handles the fee calculation automatically to prevent overpaying.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					How is the transaction data encoded? What is big-endian?
				</h4>
				<p class="text-sm text-muted-foreground">
					The transaction message contains your validator's 48-byte public key followed by an 8-byte
					amount in Gwei (1 ETH = 1 billion Gwei). The amount is encoded as a "big-endian" number,
					which means the most significant byte comes first. For example, 0.2 ETH = 200,000,000 Gwei
					= 0x0BEBC200 in hex = 000000000BEBC200 when padded to 8 bytes. This application handles all
					encoding automatically.
				</p>
			</div>

			<div class="border-t pt-4">
				<h4 class="font-semibold mb-1">
					Can someone else withdraw my validator if they know my validator public key?
				</h4>
				<p class="text-sm text-muted-foreground">
					No! The contract verifies that the transaction sender (your wallet address) matches the
					validator's withdrawal credentials. Only you can withdraw from your validator - knowing the
					public key alone is not enough. Your wallet must control the withdrawal credentials.
				</p>
			</div>
		</div>
	</div>
</Card>
