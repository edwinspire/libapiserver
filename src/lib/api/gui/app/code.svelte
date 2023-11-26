<script>
	import {
		DialogModal
		// @ts-ignore
	} from '@edwinspire/svelte-components';
	import FetchCode from './handler/fetch.svelte';
	import JsCode from './handler/js.svelte';
	import SoapCode from './handler/soap.svelte';
	import SqlCode from './handler/sql.svelte';

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
	 * @type {any}
	 */
	export let method;
	export let environment = '-';

	let showCode = false;
</script>

<button
	class="button is-small is-primary"
	on:click={() => {
		showCode = !showCode;
	}}>Code</button
>

<DialogModal
	bind:Show={showCode}
	on:ok={() => {
		if (method.handler == 'js') {
			method.code = fnJsCode.getCode();
		} else if (method.handler == 'soap') {
			method.code = fnSoapCode.getCode();
		} else if (method.handler == 'sql') {
			method.code = fnSqlCode.getCode();
		} else if (method.handler == 'fetch') {
			method.code = fnFetchCode.getCode();
		}
		//  console.log(method.code);
		showCode = false;
	}}
>
	<span slot="title">{method.handler}</span>

	<div slot="body">
		{#if method.handler == 'jsFunction'}
			<JsCode bind:this={fnJsCode} bind:code={method.code} bind:environment />
		{:else if method.handler == 'soapFunction'}
			<SoapCode bind:this={fnSoapCode} bind:code={method.code} bind:environment/>
		{:else if method.handler == 'sqlFunction'}
			<SqlCode bind:this={fnSqlCode} bind:code={method.code} bind:environment/>
		{:else if method.handler == 'fetchFunction'}
			<FetchCode bind:this={fnFetchCode} bind:code={method.code} bind:environment/>
		{:else}
			<code contenteditable>
				{method.code}
			</code>
		{/if}
	</div>
</DialogModal>
