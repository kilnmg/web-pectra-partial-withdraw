import { writable } from 'svelte/store';
import type { Validator } from '$types/validator';

interface UIState {
	drawerOpen: boolean;
	selectedValidator: Validator | null;
	showEducational: boolean;
}

function createUIStore() {
	const { subscribe, update, set } = writable<UIState>({
		drawerOpen: false,
		selectedValidator: null,
		showEducational: false
	});

	return {
		subscribe,
		openDrawer: (validator: Validator) =>
			update((state) => ({
				...state,
				drawerOpen: true,
				selectedValidator: validator
			})),
		closeDrawer: () =>
			update((state) => ({
				...state,
				drawerOpen: false,
				selectedValidator: null
			})),
		toggleEducational: () =>
			update((state) => ({
				...state,
				showEducational: !state.showEducational
			})),
		reset: () =>
			set({
				drawerOpen: false,
				selectedValidator: null,
				showEducational: false
			})
	};
}

export const uiStore = createUIStore();
