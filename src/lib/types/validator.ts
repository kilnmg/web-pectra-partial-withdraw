export interface Validator {
	pubkey: string; // 48-byte hex string (0x prefixed)
	state: 'active' | 'pending' | 'exited' | 'slashed';
	balance: bigint; // in wei
	effectiveBalance: bigint; // in wei
	balanceETH: number; // human readable
	effectiveBalanceETH: number; // human readable
	maxWithdrawableETH: number; // balance - 32 ETH (if > 0)
}

export interface ValidatorWithdrawal {
	validator: Validator;
	amountETH: number;
	amountGwei: bigint;
	isFull: boolean;
	transactionData: `0x${string}`;
}
