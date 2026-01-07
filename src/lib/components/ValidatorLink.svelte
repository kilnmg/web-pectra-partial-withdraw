<script lang="ts">
	import { formatPubkey } from '$utils/formatting';

	export let pubkey: string;
	export let chainId: number | undefined = undefined;
	export let showFull = false;
	export let className = '';

	const HOODI_CHAIN_ID = 560048;

	$: beaconchainBaseUrl = chainId === HOODI_CHAIN_ID ? 'https://hoodi.beaconcha.in' : 'https://beaconcha.in';
	$: beaconchainUrl = `${beaconchainBaseUrl}/validator/${pubkey}`;
	$: displayText = showFull ? pubkey : formatPubkey(pubkey);
</script>

<a
	href={beaconchainUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="font-mono text-primary hover:underline {className}"
	title={pubkey}
>
	{displayText}
</a>
