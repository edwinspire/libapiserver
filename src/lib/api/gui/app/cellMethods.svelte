<script>
	// @ts-nocheck

	import FetchCode from './handler/fetch.svelte';
	import JsCode from './handler/js.svelte';
	import SoapCode from './handler/soap.svelte';
	import SqlCode from './handler/sql.svelte';
	import CustomFn from './handler/customFunction.svelte';
	import { DialogModal } from '@edwinspire/svelte-components';
	import MethodDialog from './method.svelte';
	//  import { Handler } from "$lib/api/db/models";

	let showMethod = false;

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

	let fnCustomFn;

	let showCode = false;

	/**
	 * @type {any}
	 */
	export let value;
	export const row = {};
	export let props = {};
	let methodSelected = '';
	let dataSelected = {};

	const classMap = {
		GET: 'tag is-success',
		POST: 'tag is-info',
		DELETE: 'tag is-danger',
		PUT: 'tag is-warning',
		PATCH: 'tag is-link',
		WS: 'tag is-success is-light',
		MQTT: 'tag is-warning  is-light'
	};
</script>

<td>
	<div class="field is-grouped is-grouped-multiline space">
		{#if value}
			{#each Object.keys(value) as method}
				<div class="control">
					<div class="tags has-addons">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							class="tag is-dark"
							on:click={() => {
								let message = 'Do you want to enable the method?';

								if (value[method].enabled) {
									message = 'Do you want to disable the method?';
								}

								if (confirm(message)) {
									value[method].enabled = !value[method].enabled;
								}
							}}
						>
							<span
								class={value[method].enabled ? 'icon has-text-success' : 'icon has-text-danger'}
							>
								<i class={value[method].enabled ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} />
							</span></a
						>

						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span
							class={classMap[method] || 'tag is-dark'}
							on:click={() => {
								//alert(method);
								console.log(' > methodSelected > ', methodSelected, value[methodSelected]);
								methodSelected = method;
								dataSelected = { ...value[methodSelected] };
								showMethod = true;
							}}>{method}</span
						>

						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							class={value[method].handler == 'NA' ? 'tag is-dark has-text-grey' : 'tag is-dark'}
							on:click={() => {
								console.log('value[method]', value[method], method);
								if (!value[method].code) {
									value[method].code = '';
								}
								if (value[method].handler != 'NA') {
									methodSelected = method;

									showCode = true;
								}
							}}>{value[method].handler}</a
						>

						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							class="tag is-dark"
							on:click={() => {
								let message = 'Do you want to make the method public?';

								if (value[method].public) {
									message = 'Do you want to make the method private?';
								}

								if (confirm(message)) {
									value[method].public = !value[method].public;
								}
							}}
						>
							<span class={value[method].public ? 'icon has-text-success' : 'icon has-text-danger'}>
								<i class={value[method].public ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'} />
							</span></a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</td>

{#if value && methodSelected.length > 1}
	<MethodDialog
		method={methodSelected}
		bind:data={dataSelected}
		bind:Show={showMethod}
		title={`Method ${methodSelected}`}
		on:ok={(e) => {
			alert('Entra');
			methodSelected = e.detail.method;
			value[methodSelected] = e.detail.data;
			console.log('>>>> ', e.detail.data, value[methodSelected], value);
			showMethod = false;
		}}
	/>

	<DialogModal
		bind:Show={showCode}
		on:ok={() => {
			if (value[methodSelected].handler == 'JS') {
				value[methodSelected].code = fnJsCode.getCode();
				//console.log("methodSelected > ", methodSelected, fnJsCode.getCode());
			} else if (value[methodSelected].handler == 'SOAP') {
				value[methodSelected].code = fnSoapCode.getCode();
			} else if (value[methodSelected].handler == 'SQL') {
				value[methodSelected].code = fnSqlCode.getCode();
			} else if (value[methodSelected].handler == 'FETCH') {
				value[methodSelected].code = fnFetchCode.getCode();
			} else if (value[methodSelected].handler == 'FUNCTION') {
				value[methodSelected].code = fnCustomFn.getCode();
			}
			//      console.log(methodSelected, value, value[methodSelected]);

			showCode = false;
		}}
	>
		<span slot="title">{value[methodSelected].handler}</span>

		<div slot="body">
			{#if value[methodSelected].handler == 'JS'}
				<JsCode bind:this={fnJsCode} code={value[methodSelected].code} />
			{:else if value[methodSelected].handler == 'SOAP'}
				<SoapCode bind:this={fnSoapCode} bind:code={value[methodSelected].code} />
			{:else if value[methodSelected].handler == 'SQL'}
				<SqlCode bind:this={fnSqlCode} bind:code={value[methodSelected].code} />
			{:else if value[methodSelected].handler == 'FETCH'}
				<FetchCode bind:this={fnFetchCode} bind:code={value[methodSelected].code} />
			{:else if value[methodSelected].handler == 'FUNCTION'}
				<CustomFn bind:this={fnCustomFn} bind:code={value[methodSelected].code} />
			{:else}
				<code contenteditable>
					{value[methodSelected].code}
				</code>
			{/if}
		</div>
	</DialogModal>
{/if}

<style>
	.space {
		margin: 0.5em;
	}
</style>
