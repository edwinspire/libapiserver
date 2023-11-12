<script>
	'use strict';
	import { onMount } from 'svelte';

	/**
	 * @type {any}
	 */
	export let value;
	export let row = {};
	export let props = {};

	onMount(() => {});
</script>

<td>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		class="icon-text"
		on:click={() => {
			value = !value;
			//console.log('Row: ', row);
		}}
	>
		{#if value}
			<span class="icon has-text-success">
				<i class="fa-solid fa-check" />
			</span>
			<span>Enabled</span>
		{:else}
			<span class="icon has-text-danger">
				<i class="fas fa-ban" />
			</span>
			<span>Unabled</span>
		{/if}
	</span>
</td>
