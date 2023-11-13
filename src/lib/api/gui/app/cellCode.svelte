<script>
// @ts-nocheck

	'use strict';
	import { onMount } from 'svelte';
	import FetchCode from './handler/fetch.svelte';
	import JsCode from './handler/js.svelte';
	import SoapCode from './handler/soap.svelte';
	import SqlCode from './handler/sql.svelte';
	import CustomFn from './handler/customFunction.svelte';
	import { DialogModal } from '@edwinspire/svelte-components';

	/**
	 * @type {FetchCode}
	 */
	let fnFetchCode;
	/**
	 * @type {JsCode}
	 */
	let fnJsCode;
	/**
	 * @type {SoapCode}
	 */
	let fnSoapCode;
	/**
	 * @type {SqlCode}
	 */
	let fnSqlCode;

	/**
	 * @type {CustomFn}
	 */
	let fnCustomFn;

	let showCode = false;

	/**
	 * @type {any}
	 */
	export let value;
	export let row = {};
	export let props = {};

	let css_class_icons = {
		FETCH: ' is-primary ',
		JS: ' is-link ',
		SOAP: ' is-danger ',
		SQL: ' is-info',
		FUNCTION: ' is-warning '
	};

	onMount(() => {});
</script>

<td>
	<button
		class="button is-small"
		on:click={() => {
			if (!showCode) {
				showCode = true;
			}
		}}
	>
		<span class="icon is-small">
			<i class="fa-solid fa-code" />
		</span>
		<span>Code</span>
	</button>
</td>

<DialogModal
	bind:Show={showCode}
	on:ok={() => {
		if (row && row.handler == 'JS') {
			value = fnJsCode.getCode();
			//console.log("methodSelected > ", methodSelected, fnJsCode.getCode());
		} else if (row && row.handler == 'SOAP') {
			value = fnSoapCode.getCode();
		} else if (row && row.handler == 'SQL') {
			value = fnSqlCode.getCode();
		} else if (row && row.handler == 'FETCH') {
			value = fnFetchCode.getCode();
		} else if (row && row.handler == 'FUNCTION') {
			value = fnCustomFn.getCode();
		}
		//      console.log(methodSelected, value, value[methodSelected]);

		showCode = false;
	}}
>
	<span slot="title">{row.handler}</span>

	<div slot="body">
		{#if row && row.handler == 'JS'}
			<JsCode bind:this={fnJsCode} code={value} />
		{:else if row && row.handler == 'SOAP'}
			<SoapCode bind:this={fnSoapCode} bind:code={value} />
		{:else if row && row.handler == 'SQL'}
			<SqlCode bind:this={fnSqlCode} bind:code={value} />
		{:else if row && row.handler == 'FETCH'}
			<FetchCode bind:this={fnFetchCode} bind:code={value} />
		{:else if row && row.handler == 'FUNCTION'}
			<CustomFn bind:this={fnCustomFn} bind:code={value} />
		{:else}
			<code contenteditable>
				{value}
			</code>
		{/if}
	</div>
</DialogModal>
