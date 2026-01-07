import { writable } from 'svelte/store';
import type { WithdrawalTransaction } from '$types/transaction';

interface TransactionsState {
	history: WithdrawalTransaction[];
	pending: WithdrawalTransaction[];
}

function createTransactionsStore() {
	const { subscribe, update } = writable<TransactionsState>({
		history: [],
		pending: []
	});

	return {
		subscribe,
		addTransaction: (tx: WithdrawalTransaction) =>
			update((state) => ({
				history: [tx, ...state.history],
				pending: tx.status === 'pending' ? [...state.pending, tx] : state.pending
			})),
		updateTransaction: (hash: string, updates: Partial<WithdrawalTransaction>) =>
			update((state) => ({
				history: state.history.map((tx) => (tx.hash === hash ? { ...tx, ...updates } : tx)),
				pending: state.pending.filter((tx) => {
					if (tx.hash === hash) {
						return updates.status === 'pending';
					}
					return true;
				})
			})),
		clearHistory: () => update((state) => ({ ...state, history: [] }))
	};
}

export const transactionsStore = createTransactionsStore();
