<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let variant: 'default' | 'destructive' = 'default';

	const variants = {
		default: 'bg-background text-foreground',
		destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive'
	};
</script>

<div
	class={cn(
		'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
		variants[variant],
		$$props.class
	)}
>
	<slot />
</div>
