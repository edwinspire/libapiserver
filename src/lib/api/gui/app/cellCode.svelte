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
	import { css_handlers } from '../utils.js';

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

	onMount(() => {});
</script>

<td>
	{#if row.method != 'NA' && row.method != 'WS' && row.method != 'MQTT'}
		<button
			class={css_handlers[row.handler] && css_handlers[row.handler].css
				? ' button is-small is-outlined ' + css_handlers[row.handler].css
				: ' button is-small is-outlined '}
			on:click={() => {
				if (!showCode) {
					showCode = true;
				}
			}}
		>
			<span class="icon is-small">
				{#if css_handlers[row.handler] && css_handlers[row.handler].icon}
					<i class={css_handlers[row.handler].icon} />
				{:else}
					<i class="fa-solid fa-code" />
				{/if}
			</span>
			{#if css_handlers[row.handler] && css_handlers[row.handler].label}
				<span>{css_handlers[row.handler].label}</span>
			{:else}
				<span> code </span>
			{/if}
		</button>
	{/if}
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
			<SoapCode bind:this={fnSoapCode} code={value} />
		{:else if row && row.handler == 'SQL'}
			<SqlCode bind:this={fnSqlCode} code={value} />
		{:else if row && row.handler == 'FETCH'}
			<FetchCode bind:this={fnFetchCode} code={value} />
		{:else if row && row.handler == 'FUNCTION'}
			<CustomFn bind:this={fnCustomFn} code={value} />
		{:else}
			<code contenteditable>
				{value}
			</code>
		{/if}
	</div>
</DialogModal>
