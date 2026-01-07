import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { KILN_API_KEY, KILN_TESTNET_API_KEY } from '$env/static/private';
import type { KilnValidatorsResponse, KilnStake } from '$types/kiln';
import type { Validator } from '$types/validator';

const KILN_API_MAINNET = 'https://api.kiln.fi/v1';
const KILN_API_TESTNET = 'https://api.testnet.kiln.fi/v1';

// Supported chain IDs
const ETHEREUM_MAINNET_CHAIN_ID = 1;
const HOODI_CHAIN_ID = 560048;

/**
 * Get the appropriate Kiln API base URL for the chain
 */
function getKilnApiBase(chainId: number): string {
	if (chainId === HOODI_CHAIN_ID) {
		return KILN_API_TESTNET;
	}
	return KILN_API_MAINNET;
}

/**
 * Get the appropriate Kiln API key for the chain
 */
function getKilnApiKey(chainId: number): string {
	if (chainId === HOODI_CHAIN_ID) {
		return KILN_TESTNET_API_KEY;
	}
	return KILN_API_KEY;
}

/**
 * Transform Kiln stake data to internal Validator format
 * Note: balance and effectiveBalance are returned as strings because BigInt can't be JSON serialized.
 * The client will convert them to BigInt.
 * Returns null if the stake doesn't have required fields (e.g., deposit_in_progress validators).
 */
function transformKilnStake(stake: KilnStake): any | null {
	// Skip validators without balance or effective_balance (e.g., deposit_in_progress)
	if (!stake.balance || !stake.effective_balance) {
		console.log(`[API] Skipping validator ${stake.validator_address} - missing balance or effective_balance (state: ${stake.state})`);
		return null;
	}

	const balance = BigInt(stake.balance);
	const effectiveBalance = BigInt(stake.effective_balance);
	const balanceETH = Number(balance) / 1e18;
	const effectiveBalanceETH = Number(effectiveBalance) / 1e18;

	// Map Kiln state to our internal state type
	let state: 'active' | 'pending' | 'exited' | 'slashed';
	if (stake.state === 'active_ongoing' || stake.state === 'active_slashing') {
		state = 'active';
	} else if (
		stake.state === 'pending_initialized' ||
		stake.state === 'pending_queued' ||
		stake.state === 'exited_unslashed' ||
		stake.state === 'withdrawal_possible' ||
		stake.state === 'withdrawal_done'
	) {
		state = 'exited';
	} else if (stake.state === 'exited_slashed') {
		state = 'slashed';
	} else {
		state = 'pending';
	}

	return {
		pubkey: stake.validator_address,
		state,
		balance: stake.balance, // Keep as string for JSON serialization
		effectiveBalance: stake.effective_balance, // Keep as string for JSON serialization
		balanceETH,
		effectiveBalanceETH,
		maxWithdrawableETH: Math.max(0, balanceETH - 32)
	};
}

/**
 * GET /api/validators?address=0x...
 * Fetch validators for a wallet address from Kiln API
 */
export const GET: RequestHandler = async ({ url }) => {
	const address = url.searchParams.get('address');
	const chainIdParam = url.searchParams.get('chainId');

	if (!address) {
		throw error(400, 'Missing address parameter');
	}

	// Validate address format (basic check)
	if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
		throw error(400, 'Invalid Ethereum address format');
	}

	// Parse and validate chainId
	const chainId = chainIdParam ? parseInt(chainIdParam, 10) : ETHEREUM_MAINNET_CHAIN_ID;
	if (chainId !== ETHEREUM_MAINNET_CHAIN_ID && chainId !== HOODI_CHAIN_ID) {
		throw error(400, `Unsupported chain ID: ${chainId}`);
	}

	// Get the appropriate Kiln API key and base URL
	const kilnApiKey = getKilnApiKey(chainId);
	const kilnApiBase = getKilnApiBase(chainId);

	// Check for API key
	if (!kilnApiKey) {
		const keyName = chainId === HOODI_CHAIN_ID ? 'KILN_TESTNET_API_KEY' : 'KILN_API_KEY';
		throw error(500, `${keyName} not configured`);
	}

	const apiUrl = `${kilnApiBase}/eth/stakes?wallets=${address}`;

	console.log(`[API] Fetching validators for chain ${chainId} from ${apiUrl}`);

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${kilnApiKey}`,
				'Content-Type': 'application/json'
			}
		});

		console.log(`[API] Kiln response status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[API] Kiln API error response:`, errorText);

			if (response.status === 401) {
				throw error(500, 'Invalid Kiln API key');
			}
			if (response.status === 404) {
				// No validators found - return empty array
				return json({ validators: [] });
			}
			throw error(response.status, `Kiln API error: ${response.statusText} - ${errorText}`);
		}

		const data: KilnValidatorsResponse = await response.json();

		console.log(`[API] Kiln response data:`, JSON.stringify(data, null, 2));

		// Handle null or empty data
		if (!data || !data.data) {
			console.log(`[API] No data returned from Kiln, returning empty array`);
			return json({ validators: [] });
		}

		// Transform to internal format (balance/effectiveBalance as strings for JSON serialization)
		// Filter out null/undefined stakes and null results from transformKilnStake
		const validators = data.data
			.filter((stake) => stake !== null && stake !== undefined)
			.map(transformKilnStake)
			.filter((validator) => validator !== null);

		console.log(`[API] Returning ${validators.length} validators (filtered from ${data.data.length} total)`);

		return json({ validators });
	} catch (e) {
		console.error('[API] Error fetching validators:', e);
		console.error('[API] Error details:', JSON.stringify(e, null, 2));

		if (e && typeof e === 'object' && 'status' in e) {
			throw e; // Re-throw SvelteKit errors
		}

		const errorMessage = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, `Failed to fetch validators from Kiln API: ${errorMessage}`);
	}
};
