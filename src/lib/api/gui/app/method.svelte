<script>
	import { DialogModal } from '@edwinspire/svelte-components';
	import { createEventDispatcher } from 'svelte';
	import { listHandlerStore, listMethodStore } from '../utils.js';
	import SelectMethods from '../widgets/Select.svelte';
	import SelectHandlers from '../widgets/Select.svelte';

	const dispatch = createEventDispatcher();

	/**
	 * @type {any[]}
	 */
	let methods = [];

	/**
	 * @type {any[]}
	 */
	let handlers = [];

	export let method = '';
	//export let values = {};

	export let data = {
		enabled: false,
		handler: 'NA',
		public: true,
		userAuthentication: false,
		tokenAuthentication: false,
		broadcast: false
	};

	export let Show = false;
	export let title = 'Method';

	listMethodStore.subscribe((value) => {
		console.log('listMethodStore ->>>>', value);
		// @ts-ignore
		methods = value;
	});

	listHandlerStore.subscribe((value) => {
		console.log('listHandlerStore ->>>>', value);
		// @ts-ignore
		handlers = value;
	});
</script>

<DialogModal
	bind:Show
	on:cancel={() => {
		console.log('Ha cancelado');
		data = {};
	}}
	on:ok={() => {
		console.log(method, data);
		if (method && method.length) {
			if (method == 'WS' || method == 'MQTT') {
				data.handler = 'NA';
			}
			data.handler = data.handler || 'NA';
			data.enabled = data.enabled || false;
			data.public = data.public || false;

			dispatch('ok', { data: data, method: method });
		} else {
			alert('You must select a method');
		}
	}}
>
	<span slot="title">{title}</span>

	<div slot="body">
		<div class="field is-horizontal">
			<div class="field-label is-normal">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label is-small">Method</label>
			</div>
			<div class="field-body">
				<div class="field is-narrow">
					<SelectMethods bind:options={methods} bind:option={method} />
				</div>
			</div>
		</div>

		<div class="field is-horizontal">
			<div class="field-label is-normal">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Enabled</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox" bind:checked={data.enabled} />
						</label>
					</div>
				</div>
			</div>
		</div>

		{#if method !== 'WS' && method !== 'MQTT'}
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Handler</label>
				</div>
				<div class="field-body">
					<div class="field is-narrow">
						<SelectHandlers bind:options={handlers} bind:option={data.handler} />
					</div>
				</div>
			</div>
		{/if}

		<div class="field is-horizontal">
			<div class="field-label">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label is-small">Public</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox" bind:checked={data.public} />
						</label>
					</div>
				</div>
			</div>
		</div>

		{#if !data.public && method !== 'MQTT'}
			<div class="field is-horizontal">
				<div class="field-label">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">User authentication</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<label class="checkbox">
								<input type="checkbox" bind:checked={data.userAuthentication} />
							</label>
						</div>
					</div>
				</div>
			</div>

			<div class="field is-horizontal">
				<div class="field-label">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Token authentication</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<label class="checkbox">
								<input type="checkbox" bind:checked={data.tokenAuthentication} />
							</label>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if method == 'WS'}
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">Broadcast</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<label class="checkbox">
								<input type="checkbox" bind:checked={data.broadcast} />
							</label>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</DialogModal>
