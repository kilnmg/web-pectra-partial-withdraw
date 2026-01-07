<script lang="ts">
	import { cn } from '$lib/utils/cn';
</script>

<div
	class={cn(
		'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
		$$props.class
	)}
>
	<slot />
</div>
