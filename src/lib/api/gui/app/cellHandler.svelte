<script>
	import SelectHandler from '../widgets/Select.svelte';
	import { listHandlerStore } from '../utils.js';
	import { onMount } from 'svelte';

	/**
	 * @type {any[]}
	 */
	let methods = [];

	/**
	 * @type {any}
	 */
	export let value;
	export let row = {};
	export let props = {};
	//let methodSelected = '';
	let css_class_handlers = {
		FETCH: ' is-primary ',
		JS: ' is-link ',
		SOAP: ' is-danger ',
		SQL: ' is-info',
		FUNCTION: ' is-warning '
	};
	let css_class_handler = ' is-small  ';

	listHandlerStore.subscribe((value) => {
		//console.log('listMethodStore ->>>>', value);
		// @ts-ignore
		methods = value;
	});

	/**
	 * @param {string} handler
	 */
	function setCSS(handler) {
		// @ts-ignore
		let css_selected = css_class_handlers[handler];
		if (css_selected) {
			css_class_handler = ' is-small ' + css_selected;
		} else {
			css_class_handler = ' is-small has-background-warning-light';
		}

	//	console.log('>>>>>>>', row);
		//console.log(css_class_handler);
	}

	onMount(() => {
		setCSS(value);
	});
</script>

<td>
	{#if row && row.method && row.method != 'WS' && row.method != 'MQTT'}
		<SelectHandler
			bind:options={methods}
			bind:option={value}
			bind:css_class={css_class_handler}
			on:select={(e) => {
				setCSS(e.detail.value);
					console.log('Row', row);
			}}
		/>
	{:else}
		<span />
	{/if}
</td>
