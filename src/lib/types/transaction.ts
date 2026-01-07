import type { Hash } from 'viem';

export interface WithdrawalTransaction {
	hash: Hash;
	validatorPubkey: string;
	amountETH: number;
	isFull: boolean;
	status: 'pending' | 'confirmed' | 'failed';
	timestamp: number;
	confirmations?: number;
	error?: string;
}

export interface TransactionState {
	transactions: WithdrawalTransaction[];
	currentTx?: WithdrawalTransaction;
}
