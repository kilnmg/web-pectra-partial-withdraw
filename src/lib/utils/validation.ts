import { isAddress } from 'viem';

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): boolean {
	return isAddress(address);
}

/**
 * Validate validator public key format
 */
export function validatePubkey(pubkey: string): boolean {
	const hex = pubkey.startsWith('0x') ? pubkey.slice(2) : pubkey;
	return /^[0-9a-fA-F]{96}$/.test(hex);
}

/**
 * Validate withdrawal amount input
 */
export function validateAmountInput(value: string | number): {
	valid: boolean;
	error?: string;
	parsed?: number;
} {
	// Convert to string for validation
	const strValue = String(value);

	if (!strValue || strValue.trim() === '' || strValue === 'NaN') {
		return { valid: false, error: 'Amount is required' };
	}

	const num = parseFloat(strValue);

	if (isNaN(num)) {
		return { valid: false, error: 'Invalid number format' };
	}

	if (num <= 0) {
		return { valid: false, error: 'Amount must be greater than 0' };
	}

	return { valid: true, parsed: num };
}
