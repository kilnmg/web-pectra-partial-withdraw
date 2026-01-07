/**
 * Format ETH amount with appropriate decimals
 */
export function formatETH(wei: bigint, decimals: number = 4): string {
	const eth = Number(wei) / 1e18;
	return eth.toFixed(decimals);
}

/**
 * Format address for display (shortened)
 */
export function formatAddress(address: string): string {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format validator pubkey (shortened)
 */
export function formatPubkey(pubkey: string): string {
	if (!pubkey) return '';
	return `${pubkey.slice(0, 10)}...${pubkey.slice(-8)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
	return new Date(timestamp).toLocaleString();
}

/**
 * Convert wei to ETH (bigint safe)
 */
export function weiToETH(wei: bigint): number {
	return Number(wei) / 1e18;
}

/**
 * Convert ETH to wei (bigint safe)
 */
export function ethToWei(eth: number): bigint {
	return BigInt(Math.floor(eth * 1e18));
}
