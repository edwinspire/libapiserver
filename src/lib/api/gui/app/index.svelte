<script>
	// @ts-nocheck

	// @ts-ignore
	import uFetch from '@edwinspire/universal-fetch';
	import {
		PredictiveInput,
		Table,
		ColumnTypes,
		DialogModal,
		Level,
		Tab
		// @ts-ignore
	} from '@edwinspire/svelte-components';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { userStore, getListFunction, listAppVars, url_paths } from '../utils.js';
	import CellMethod from './cellMethod.svelte';
	import cellHandler from './cellHandler.svelte';
	import cellCode from './cellCode.svelte';
	import { path_params_to_url, validateURL } from '../../../api/server/utils_path.js';
	import Vars from './vars.svelte';

	import SelectEnvironment from '../widgets/Select.svelte';

	const dispatch = createEventDispatcher();
	export let idapp = 0;

	let uploaded_file;
	let endpoints = [];
	let environment_list = [];
	let showEndpointEdit = false;
	let SelectedRow = {};
	let validateResource = false;
	let availableURL = false;

	$: idapp, getApp();
	$: SelectedRow.resource, checkResource();

	let fnVarsDev;
	let fnVarsQa;
	let fnVarsPrd;

	let columns = {
		//enabled: { label: 'Enabled App' },
		endpoint: { label: 'Endpoint' },
		enabled: {
			label: 'Enabled Endpoint',
			decorator: {
				component: ColumnTypes.BooleanIcon,
				props: {
					ontrue: { label: 'Enabled' },
					onfalse: { label: 'Unabled' }
				}
			}
		},
		method: { decorator: { component: CellMethod }, label: 'Method' },
		handler: { decorator: { component: cellHandler }, label: 'Handler' },
		resource: { hidden: true },
		is_public: {
			label: 'Public',
			decorator: {
				component: ColumnTypes.BooleanIcon,
				props: {
					ontrue: { label: 'Public', iconClass: ' fa-solid fa-lock-open ' },
					onfalse: { label: 'Private', iconClass: ' fa-solid fa-lock ' }
				}
			}
		},
		code: { label: 'Code', decorator: { component: cellCode } },
		description: { label: 'Description' },
		for_user: {
			decorator: {
				component: ColumnTypes.BooleanIcon,
				props: { ontrue: { label: 'Active' }, onfalse: { label: 'Inactive' } }
			}
		},
		for_api: {
			decorator: {
				component: ColumnTypes.BooleanIcon,
				props: { ontrue: { label: 'Active' }, onfalse: { label: 'Inactive' } }
			}
		},
		idapp: { hidden: true },
		rowkey: { hidden: true },
		app: { hidden: true },
		namespace: { hidden: true },
		name: { hidden: true },
		version: { hidden: true },
		description: { hidden: true },
		vars: { hidden: true },
		idendpoint: { hidden: true },

		environment: { hidden: true },

		name: { hidden: true },
		namespace: { hidden: true },
		rowkey: { hidden: true },
		version: { hidden: true }
	};

	let tabs = [
		{ label: 'Endpoints', classIcon: 'fas fa-picture', slot: 'picture', isActive: true },
		{ label: 'Description', classIcon: 'fas fa-picture', slot: 'music', isActive: false },
		{ label: 'Application variables', classIcon: 'fas fa-film', slot: 'film', isActive: false }
	];

	/**
	 * @type {{ name: any; value: any; }[]}
	 */
	let options = [];

	/*
	let namespaceSelected = '';
	let nameSelected = '';
	let showDialogOneField = false;
	let showDialogMethod = false;
	let methodSelectedDialog = '';
	let paramDialogOneField = {
		title: '',
		description: '',
		inputType: 'text',
		value: '',
		label: '',
		function: ( value) => {
			console.log('<Funcion>', value);
		}
	};
*/

	/**
	 * @type {any}
	 */
	let app = {};

	let uf = new uFetch();

	function checkResource() {
		validateResource = validateURL(SelectedRow.resource);
		//		console.log('validateURL: ', SelectedRow.resource, validateResource);

		availableURL = checkEndpointConstraint(SelectedRow);
	}

	function checkEndpointConstraint(endpoint_value) {
		let check = endpoints.some((row) => {
			//	console.log(endpoint_value, row);
			return (
				endpoint_value.resource == row.resource &&
				endpoint_value.environment == row.environment &&
				endpoint_value.method == row.method &&
				endpoint_value.idendpoint != row.idendpoint
			);
		});
		return !check;
	}

	async function getEnvList() {
		// Lógica de autenticación aquí

		try {
			//      console.log("getListApps > ", $userStore, uf);

			let env_list_resp = await uf.get(url_paths.listEnv);
			let env_list = await env_list_resp.json();
			//console.log(apps);

			if (env_list && Array.isArray(env_list) && env_list.length > 0) {
				environment_list = env_list.map((item) => {
					return { id: item.id, value: item.text };
				});
			} else {
				environment_list = [];
			}
		} catch (error) {
			// @ts-ignore
			alert(error.message);
		}
	}

	async function getListApps() {
		// Lógica de autenticación aquí

		try {
			//      console.log("getListApps > ", $userStore, uf);

			let apps_res = await uf.get(url_paths.listApps);
			let apps = await apps_res.json();
			//console.log(apps);

			if (apps && Array.isArray(apps) && apps.length > 0) {
				options = apps.map((item) => {
					return { name: item.app, value: item.idapp };
				});
			} else {
				options = [];
			}
		} catch (error) {
			// @ts-ignore
			alert(error.message);
		}
	}

	function showAppData(app_resp) {
		if (app_resp && app_resp.length > 0) {
			//appDataTable = AppToTable(app);
			app = app_resp[0];

			if (app && app.vars && typeof app.vars === 'object') {
				listAppVars.set(app.vars);
			} else if (app && app.vars && typeof app.vars === 'string') {
				try {
					listAppVars.set(JSON.parse(app.vars));
				} catch (error) {
					console.error(error);
				}
			}

			//console.log("appDataTable = ", appDataTable);
			//console.log(app);
			// @ts-ignore
			getListFunction($userStore.token, app.app, app.environment);

			if (app.apiserver_endpoints) {
				endpoints = app.apiserver_endpoints.map((ax) => {
					return {
						endpoint: `/api/${app.app}/${ax.environment}${ax.resource}`,
						...ax
					};
				});
				//console.log(endpoints);
			}
		}
	}

	async function getApp() {
		if (idapp) {
			try {
				let apps_res = await uf.get(url_paths.getApp, {
					idapp: idapp,
					raw: false
				});
				let app_resp = await apps_res.json();
				//console.log(app_resp);
				showAppData(app_resp);
			} catch (error) {
				// @ts-ignore
				alert(error.message);
			}
		}
	}

	userStore.subscribe((value) => {
		console.log('tokenStore ->>>>', value);
		// @ts-ignore
		uf.setBearerAuthorization(value.token);
	});

	function appToStore() {
		let app_save = { ...app };
		app_save.apiserver_endpoints = endpoints;

		console.log('v >> ', app, app_save);

		return app_save;
	}

	async function saveApp() {
		try {
			let apps_res = await uf.post(url_paths.saveApp, appToStore());
			let rapp = await apps_res.json();

			if (idapp == rapp.idapp) {
				getApp();
			} else {
				idapp = rapp.idapp;
			}

			await getListApps();
		} catch (error) {
			// @ts-ignore
			alert(error.message);
		}
	}

	onMount(async () => {
		// dataUser = tokenVerify(tokenStore);
		// uf.addHeader();
		// console.log($userStore);
		await getListApps();
		await getEnvList();

		// @ts-ignore
	});
</script>

<Level>
	<span slot="r01">
		{#if $userStore && $userStore.role && $userStore.role.enabled && $userStore.role.create_app}
			<button
				class="button is-small is-primary is-outlined"
				on:click={() => {
					app = { app: '', idapp: null };
					endpoints = [];
				}}
			>
				<span class="icon is-small">
					<i class="fab fa-github" />
				</span>
				<span>New App</span>
			</button>
		{/if}
	</span>

	<span slot="r02">
		<PredictiveInput
			label="Application: "
			bind:options
			on:select={(/** @type {{ detail: { value: number; }; }} */ e) => {
				if ($userStore && $userStore.role && $userStore.role.enabled && $userStore.role.read_app) {
					idapp = e.detail.value;
				} else {
					alert('You do not have authorization');
				}
			}}
		/></span
	>
</Level>

<div />

{#if $userStore && $userStore.role && $userStore.role.enabled && $userStore.role.read_app}
	<div>
		<Level>
			<span slot="l01">
				<div class="field has-addons">
					<p class="control">
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="button is-static is-small"> Application </a>
					</p>
					<p class="control">
						<input
							class="input is-small"
							type="text"
							placeholder="Application name"
							bind:value={app.app}
						/>
					</p>
				</div>
			</span>
			<span slot="l02">
				<div class="field has-addons">
					<p class="control">
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="button is-static is-small"> Enabled </a>
					</p>
					<p class="control">
						<input
							type="button"
							bind:value={app.enabled}
							class={app.enabled
								? 'button is-success is-selected is-small'
								: 'button is-danger is-small'}
							on:click={() => {
								app.enabled = !app.enabled;
							}}
						/>
					</p>
				</div>
			</span>
			<span slot="r01">
				{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.create_app || $userStore.role.update_app)}
					<button
						class="button is-small is-link is-outlined"
						on:click={() => {
							//	console.log(fnVarsDev.getCode());

							if (confirm('Do you want to save the application data?')) {
								app.vars = {};
								app.vars.dev = fnVarsDev.getCode();
								app.vars.qa = fnVarsQa.getCode();
								app.vars.prd = fnVarsPrd.getCode();
								saveApp();
							}
						}}
					>
						<span class="icon is-small">
							<i class="fab fa-github" />
						</span>
						<span>Save</span>
					</button>
				{/if}
			</span>

			<span slot="r02">
				{#if $userStore && $userStore.role && $userStore.role.enabled && $userStore.role.read_app}
					<button
						class="button is-small"
						on:click={() => {
							console.log('Download', app);

							const now = new Date();
							const year = now.getFullYear();
							const month = String(now.getMonth() + 1).padStart(2, '0'); // Sumamos 1 al mes ya que en JavaScript los meses van de 0 a 11
							const day = String(now.getDate()).padStart(2, '0');
							const hours = String(now.getHours()).padStart(2, '0');
							const minutes = String(now.getMinutes()).padStart(2, '0');

							//const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

							// Convertir el objeto JSON a una cadena
							const jsonString = JSON.stringify(appToStore(), null, 2);

							// Crear un Blob con el contenido JSON
							const blob = new Blob([jsonString], { type: 'application/json' });

							// Crear una URL para el Blob
							const url = window.URL.createObjectURL(blob);

							// Crear un enlace para descargar el JSON
							const a = document.createElement('a');
							a.href = url;
							a.download = `app_${app.app}_${year}${month}${day}_${hours}${minutes}.json`;

							// Simular un clic en el enlace para iniciar la descarga
							a.click();

							// Liberar recursos
							window.URL.revokeObjectURL(url);
						}}
					>
						<span class="icon is-small">
							<i class="fa-solid fa-file-export" />
						</span>
						<span>Download</span>
					</button>
				{/if}
			</span>

			<span slot="r03">
				{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.create_app || $userStore.role.update_app)}
					<div class="field has-addons">
						<p class="control file">
							<input
								class="input is-small"
								type="file"
								accept=".json"
								on:change={(event) => {
									const selectedFile = event.target.files[0]; // Obten el primer archivo seleccionado

									if (!selectedFile) {
										alert('Por favor, selecciona un archivo JSON válido.');
										return;
									}

									const reader = new FileReader();

									// Escucha el evento 'load' que se dispara cuando se ha leído el archivo
									reader.onload = function (e) {
										const fileContent = e.target.result; // Aquí tienes el contenido del archivo

										try {
											uploaded_file = JSON.parse(fileContent);
											console.log('Contenido del archivo JSON:', uploaded_file);

											// TODO: Aquí puedes realizar acciones con los datos JSON, por ejemplo, mostrarlos en la página.
											showAppData([uploaded_file]);
										} catch (error) {
											console.error('Error al analizar el archivo JSON:', error);
										}
									};

									// Lee el contenido del archivo como texto
									reader.readAsText(selectedFile);
								}}
							/>
						</p>

						<p class="control">
							<button
								class="button is-small"
								on:click={() => {
									//alert('Ha hecho click');

									if (uploaded_file) {
										if (confirm('Do you want to replace app data permanently?')) {
											app = { ...uploaded_file };
											uploaded_file = null;
										}
									} else {
										alert('Please new select file!');
									}
								}}
							>
								<span class="icon is-small">
									<i class="fas fa-align-left" />
								</span>

								<span> Upload </span>
							</button>
						</p>
					</div>
				{/if}
			</span>
		</Level>

		<Tab bind:tabs >

			<div>jjjjjjjj</div>


		</Tab>

		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label is-small">Description</label>
			<div class="control">
				<textarea
					class="textarea is-small"
					placeholder="Description"
					bind:value={app.description}
				/>
			</div>
		</div>

		<div>
			<div><Vars bind:this={fnVarsDev} environment={'dev'} editable={true} /></div>
			<div><Vars bind:this={fnVarsQa} environment={'qa'} editable={true} /></div>
			<div><Vars bind:this={fnVarsPrd} environment={'prd'} editable={true} /></div>
		</div>

		<Table
			ShowNewButton="true"
			ShowEditButton="true"
			bind:RawDataTable={endpoints}
			bind:columns
			on:newrow={() => {
				SelectedRow = {
					enabled: false,
					environment: 'dev',
					method: 'NA',
					handler: 'NA',
					resource: ''
				};
				showEndpointEdit = true;
			}}
			on:editrow={(e) => {
				SelectedRow = { ...e.detail.data };
				showEndpointEdit = true;
				console.log(SelectedRow);
			}}
		>
			<span slot="l01"> Endpoints </span>
		</Table>
	</div>
{/if}

<DialogModal
	bind:Show={showEndpointEdit}
	on:cancel={() => {
		console.log('Ha cancelado');
		//data = {};
	}}
	on:ok={() => {
		//console.log('SelectedRow >>> ', SelectedRow);
		SelectedRow.idapp = app.idapp;
		SelectedRow.latest_updater = $userStore.iduser;

		if (validateResource && availableURL) {
			SelectedRow.endpoint = `/api/${app.app}/${SelectedRow.environment}${SelectedRow.resource}`;

			console.log('SelectedRow: ', SelectedRow);

			if (SelectedRow.idendpoint) {
				// Es edición de endpoint
				let found = endpoints.findIndex((element) => element.idendpoint == SelectedRow.idendpoint);
				//		console.log('Se ha encontrado: ', found);
				if (found >= 0) {
					endpoints[found] = { ...SelectedRow };
				}
				//found = { ...SelectedRow };
			} else {
				// es nuevo endpoint
				endpoints.unshift({
					idapp: app.idapp,
					endpoint: SelectedRow.endpoint,
					resource: SelectedRow.resource,
					enabled: SelectedRow.enabled,
					//version: SelectedRow.version,
					environment: SelectedRow.environment,
					for_user: true,
					for_api: false,
					method: SelectedRow.method,
					handler: 'NA',
					is_public: false,
					cors: undefined,
					code: '',
					description: SelectedRow.description,
					latest_updater: $userStore.iduser
				});
			}

			showEndpointEdit = false;
		} else {
			alert('The data has errors, please review it.');
		}

		/*path_params_to_url({
			app: app.app,
			version: SelectedRow.version,
			namespace: SelectedRow.namespace,
			name: SelectedRow.name,
			environment: SelectedRow.environment
		});
		*/
	}}
>
	<span slot="title">Endpoint Edit</span>

	<div slot="body">
		<input class="input" type="hidden" placeholder="Name" bind:value={SelectedRow.idendpoint} />

		<div class="field is-horizontal">
			<div class="field-label is-small">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Enabled</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox" bind:checked={SelectedRow.enabled} />
						</label>
					</div>
				</div>
			</div>
		</div>

		<div class="field is-horizontal">
			<div class="field-label is-small">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Method</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control">
						<CellMethod bind:value={SelectedRow.method} />
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="field is-horizontal">
				<div class="field-label is-small"><strong> API Resource: </strong></div>
				<div class="field-body">
					<div class="field is-expanded">
						<div class="field has-addons">
							<p class="control">
								<a class="button is-small is-static">
									/api/{app.app}/
								</a>
							</p>
							<p class="control">
								<SelectEnvironment
									bind:options={environment_list}
									bind:option={SelectedRow.environment}
									on:select={(e) => {
										console.log(e);
									}}
								/>
							</p>
							<p class="control is-expanded">
								<input
									class="input is-small"
									type="text"
									placeholder="Resourse"
									bind:value={SelectedRow.resource}
								/>
							</p>
						</div>
						<p class="help">
							{#if validateResource}
								<div class="icon-text is-small">
									<span class="icon has-text-success">
										<i class="fas fa-check-square" />
									</span>
									<span>Url Success</span>
								</div>
							{:else}
								<div class="icon-text is-small">
									<span class="icon has-text-danger">
										<i class="fas fa-ban" />
									</span>
									<span>Url Invalid</span>
								</div>
							{/if}

							{#if validateResource && availableURL}
								<div class="icon-text is-small">
									<span class="icon has-text-success">
										<i class="fas fa-check-square" />
									</span>
									<span>Available URL</span>
								</div>
							{:else if validateResource && !availableURL}
								<div class="icon-text is-small">
									<span class="icon has-text-danger">
										<i class="fas fa-ban" />
									</span>
									<span>Url not available</span>
								</div>
							{/if}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label is-small">Description</label>
			<div class="control">
				<textarea
					class="textarea is-small"
					placeholder="Textarea"
					bind:value={SelectedRow.description}
				/>
			</div>
		</div>
	</div>
</DialogModal>
