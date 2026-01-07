import type { Hex } from 'viem';
import { GWEI_PER_ETH } from './constants';

/**
 * Encode withdrawal transaction data for EIP-7002
 * @param validatorPubkey - 48-byte validator public key (with or without 0x prefix)
 * @param amountETH - Amount in ETH (0 for full withdrawal)
 * @returns Hex string suitable for transaction data field
 */
export function encodeWithdrawalData(validatorPubkey: string, amountETH: number): Hex {
	// Remove 0x prefix if present
	const pubkeyHex = validatorPubkey.startsWith('0x')
		? validatorPubkey.slice(2)
		: validatorPubkey;

	// Validate pubkey length (should be 96 hex characters = 48 bytes)
	if (pubkeyHex.length !== 96) {
		throw new Error(
			`Invalid validator pubkey length: ${pubkeyHex.length}. Expected 96 hex characters.`
		);
	}

	// Convert ETH to Gwei (8 bytes, big-endian)
	const amountGwei = BigInt(Math.floor(amountETH * Number(GWEI_PER_ETH)));

	// Convert to 16-character hex string (8 bytes, padded with zeros)
	const amountHex = amountGwei.toString(16).padStart(16, '0');

	// Combine pubkey + amount
	return `0x${pubkeyHex}${amountHex}` as Hex;
}

/**
 * Decode withdrawal data back to readable format (for verification)
 */
export function decodeWithdrawalData(data: Hex): {
	pubkey: string;
	amountGwei: bigint;
	amountETH: number;
} {
	const hex = data.startsWith('0x') ? data.slice(2) : data;

	if (hex.length !== 112) {
		// 96 + 16
		throw new Error('Invalid withdrawal data length');
	}

	const pubkey = `0x${hex.slice(0, 96)}`;
	const amountHex = hex.slice(96);
	const amountGwei = BigInt(`0x${amountHex}`);
	const amountETH = Number(amountGwei) / Number(GWEI_PER_ETH);

	return { pubkey, amountGwei, amountETH };
}

/**
 * Validate withdrawal amount
 */
export function validateWithdrawal(
	currentBalanceETH: number,
	withdrawalAmountETH: number,
	minBalanceETH: number = 32
): { valid: boolean; error?: string } {
	if (withdrawalAmountETH <= 0) {
		return { valid: false, error: 'Withdrawal amount must be greater than 0' };
	}

	const remainingBalance = currentBalanceETH - withdrawalAmountETH;

	if (remainingBalance < minBalanceETH) {
		return {
			valid: false,
			error: `Validator must have at least ${minBalanceETH} ETH remaining. Current: ${currentBalanceETH} ETH, After withdrawal: ${remainingBalance.toFixed(4)} ETH`
		};
	}

	if (withdrawalAmountETH > currentBalanceETH) {
		return {
			valid: false,
			error: `Cannot withdraw more than current balance (${currentBalanceETH} ETH)`
		};
	}

	return { valid: true };
}
