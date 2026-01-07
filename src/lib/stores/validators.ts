import { writable, derived } from 'svelte/store';
import type { Validator } from '$types/validator';

export interface ValidatorsState {
	data: Validator[];
	loading: boolean;
	error: string | null;
	lastFetch: number | null;
}

function createValidatorsStore() {
	const { subscribe, set, update } = writable<ValidatorsState>({
		data: [],
		loading: false,
		error: null,
		lastFetch: null
	});

	return {
		subscribe,
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setData: (data: Validator[]) =>
			update((state) => ({
				...state,
				data,
				loading: false,
				error: null,
				lastFetch: Date.now()
			})),
		setError: (error: string) =>
			update((state) => ({
				...state,
				error,
				loading: false
			})),
		reset: () =>
			set({
				data: [],
				loading: false,
				error: null,
				lastFetch: null
			})
	};
}

export const validatorsStore = createValidatorsStore();

// Derived store for active validators only
export const activeValidators = derived(validatorsStore, ($validators) =>
	$validators.data.filter((v) => v.state === 'active')
);
