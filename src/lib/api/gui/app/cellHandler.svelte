<script>
	import SelectHandler from '../widgets/Select.svelte';
	import { listHandlerStore, css_handlers } from '../utils.js';
	import { onMount } from 'svelte';

	/**
	 * @type {any[]}
	 */
	let handlers = [];

	/**
	 * @type {any}
	 */
	export let value;
	export let row = {};
	export let props = {};
	//let methodSelected = '';
	let css_h = ' is-small ';

	listHandlerStore.subscribe((value) => {
		//console.log('listMethodStore ->>>>', value);
		// @ts-ignore
		handlers = value;
	});

	/**
	 * @param {string } value_handler
	 */
	function setCSS(value_handler) {
		css_h =
			// @ts-ignore
			value_handler && css_handlers[value_handler] && css_handlers[value_handler].css
				? // @ts-ignore
				  ' is-small ' + css_handlers[value_handler].css
				: ' is-small ';
	}

	onMount(() => {
		setCSS(value);
	});
</script>

<td>
	{#if row && row.method && row.method != 'WS' && row.method != 'MQTT'}
		<SelectHandler
			bind:options={handlers}
			bind:option={value}
			bind:css_class={css_h}
			on:select={(e) => {
				setCSS(e.detail.value);
				console.log('Row', row);
			}}
		/>
	{:else}
		<span />
	{/if}
</td>
