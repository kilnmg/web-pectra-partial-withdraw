<script lang="ts">
	import Card from './ui/card.svelte';
</script>

<div class="space-y-4">
	<Card>
		<div class="p-4 space-y-3 animate-pulse">
			<div class="h-4 bg-muted rounded w-3/4"></div>
			<div class="h-4 bg-muted rounded w-1/2"></div>
			<div class="h-4 bg-muted rounded w-5/6"></div>
		</div>
	</Card>
	<Card>
		<div class="p-4 space-y-3 animate-pulse">
			<div class="h-4 bg-muted rounded w-2/3"></div>
			<div class="h-4 bg-muted rounded w-4/5"></div>
		</div>
	</Card>
</div>
