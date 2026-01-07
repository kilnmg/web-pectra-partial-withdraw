// EIP-7002 Withdrawal System Contract
export const WITHDRAWAL_CONTRACT_ADDRESS =
	'0x00000961Ef480Eb55e80D19ad83579A64c007002' as const;

// Etherscan link to withdrawal contract
export const WITHDRAWAL_CONTRACT_ETHERSCAN_URL = `https://etherscan.io/address/${WITHDRAWAL_CONTRACT_ADDRESS}` as const;

// Minimum ETH that must remain in validator
export const MIN_VALIDATOR_BALANCE_ETH = 32;

// Conversion constants
export const GWEI_PER_ETH = 1_000_000_000n;
export const WEI_PER_ETH = 1_000_000_000_000_000_000n;
export const WEI_PER_GWEI = 1_000_000_000n;

// Educational link
export const PECTRA_SIMULATOR_URL = 'https://pectrified.com/mainnet/simulator/withdrawals';

// Chain IDs
export const ETHEREUM_MAINNET_CHAIN_ID = 1;
export const HOODI_CHAIN_ID = 560048;

// Block explorer base URLs
export const ETHERSCAN_BASE_URL = 'https://etherscan.io';
export const HOODI_SCAN_BASE_URL = 'https://hoodi.etherscan.io';

/**
 * Get block explorer URL for a transaction hash based on chain ID
 */
export function getBlockExplorerUrl(hash: string, chainId: number | undefined): string {
	const baseUrl = chainId === HOODI_CHAIN_ID ? HOODI_SCAN_BASE_URL : ETHERSCAN_BASE_URL;
	return `${baseUrl}/tx/${hash}`;
}

/**
 * Get block explorer name based on chain ID
 */
export function getBlockExplorerName(chainId: number | undefined): string {
	return chainId === HOODI_CHAIN_ID ? 'Hoodi Scan' : 'Etherscan';
}
