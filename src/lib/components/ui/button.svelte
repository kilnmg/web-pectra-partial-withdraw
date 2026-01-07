<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
	export let size: 'default' | 'sm' | 'lg' = 'default';
	export let disabled = false;

	const variants = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
	};

	const sizes = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3',
		lg: 'h-11 rounded-md px-8'
	};
</script>

<button
	{disabled}
	class={cn(
		'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
		variants[variant],
		sizes[size],
		$$props.class
	)}
	on:click
>
	<slot />
</button>
