// Kiln API Response Types
export interface KilnStake {
	validator_address: string;
	validator_index?: number;
	state:
		| 'active_ongoing'
		| 'active_slashing'
		| 'pending_initialized'
		| 'pending_queued'
		| 'exited_unslashed'
		| 'exited_slashed'
		| 'withdrawal_possible'
		| 'withdrawal_done'
		| 'deposit_in_progress';
	balance?: string; // in wei - optional for deposit_in_progress validators
	effective_balance?: string; // in wei - optional for deposit_in_progress validators
	activated_at?: string;
	activated_epoch?: number;
	delegated_block?: number;
	delegated_at?: string;
	exited_at?: string;
	exited_epoch?: number;
	consensus_rewards?: string;
	execution_rewards?: string;
	rewards?: string;
	gross_apy?: number;
	deposit_tx_sender?: string;
	execution_fee_recipient?: string;
	withdrawal_credentials?: string;
	claimable_execution_rewards?: string;
	claimable_consensus_rewards?: string;
	is_kiln?: boolean;
	activation_eligibility_epoch?: number;
	activation_eligibility_at?: string;
	updated_at?: string;
	exit_requested?: boolean;
}

export interface KilnValidatorsResponse {
	data: KilnStake[];
	meta?: {
		page?: number;
		total?: number;
	};
}
