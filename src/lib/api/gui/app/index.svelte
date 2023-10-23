<script>
	// @ts-nocheck

	// @ts-ignore
	import uFetch from '@edwinspire/universal-fetch';
	import {
		PredictiveInput,
		Table,
		ColumnTypes,
		DialogModal,
		Level
		// @ts-ignore
	} from '@edwinspire/svelte-components';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { userStore, getListFunction, listAppVars } from '../utils.js';
	import CellMethods from './cellMethods.svelte';
	import MethodDialog from './method.svelte';
	import { AppToTable, TableToApp } from '../../db/utils.js';
	//  import { tokenVerify } from "../../server/utils.js";
	//  import jwt from "jsonwebtoken";

	const dispatch = createEventDispatcher();
	export let idapp = 0;

	let uploaded_file;

	$: idapp, getApp();

	let columns = {
		dev: { decorator: { component: CellMethods } },
		qa: { decorator: { component: CellMethods } },
		prd: { decorator: { component: CellMethods } },
		idapp: { hidden: true },
		rowkey: { hidden: true },
		app: { hidden: true },
		namespace: { hidden: true },
		name: { hidden: true },
		version: { hidden: true },
		description: { hidden: true }
	};
	/**
	 * @type {{ name: any; value: any; }[]}
	 */
	let options = [];

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
		function: (/** @type {any} */ value) => {
			console.log('<Funcion>', value);
		}
	};

	let paramDialogMethod = {
		title: '',
		values: { enabled: true, public: false, handler: '' },
		function: (/** @type {any} */ value) => {
			console.log('<Funcion >>>>>>', value);
		}
	};

	/**
	 * @type {any}
	 */
	let app;

	/**
	 * @type {any[]}
	 */
	let appDataTable = [];

	let pageSelected = 'endpoint';
	let versionSelected = '';

	let uf = new uFetch();

	//let dataUser = {};

	async function getListApps() {
		// Lógica de autenticación aquí

		try {
			//      console.log("getListApps > ", $userStore, uf);

			let apps_res = await uf.get('/system/main/apps');
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

	/**
	 * @param {string } method_selected
	 */
	function methodValidation(method_selected) {
		if (!method_selected || (method_selected && method_selected.length < 2)) {
			alert('You must select a method');
			return false;
		}
		return true;
	}

	async function getApp() {
		if (idapp) {
			try {
				let apps_res = await uf.get('/system/main/app/' + idapp, {
					raw: false
				});
				app = await apps_res.json();
				//console.log(app);
				if (app) {
					appDataTable = AppToTable(app);
					listAppVars.set(app.vars);
					//console.log("appDataTable = ", appDataTable);
					//console.log(app);
					// @ts-ignore
					getListFunction($userStore.token, app.app);
				}
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

	async function saveApp() {
		try {
			let apps_res = await uf.post('/system/main/app/0', app);
			let rapp = await apps_res.json();
			idapp = rapp.idapp;

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
		// @ts-ignore
	});
</script>

<Level>
	<span slot="l01">
		<PredictiveInput
			bind:options
			on:select={(/** @type {{ detail: { value: number; }; }} */ e) => {
				if (
					$userStore &&
					$userStore.role &&
					$userStore.role.enabled &&
					($userStore.role.type == 1 ||
						($userStore.role.attrs &&
							$userStore.role.attrs.apps &&
							$userStore.role.attrs.apps.read))
				) {
					idapp = e.detail.value;
				} else {
					alert('No tiene autorizacion para ver la app');
				}

				//getApp();
			}}
		/></span
	>
	<span slot="r01">
		{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.type == 1 || ($userStore.role.attrs && $userStore.role.attrs.apps && $userStore.role.attrs.apps.create))}
			<button
				class="button is-small"
				on:click={() => {
					paramDialogOneField.title = 'New Application';
					paramDialogOneField.label = 'Application Name';
					paramDialogOneField.inputType = 'text';
					paramDialogOneField.value = '';
					paramDialogOneField.function = (value) => {
						app = { app: value, data: { namespaces: [] } };
						pageSelected = 'app';
					};
					showDialogOneField = true;
				}}
			>
				<span class="icon is-small">
					<i class="fab fa-github" />
				</span>
				<span>New App</span>
			</button>
		{/if}
	</span>
</Level>

<div />

<div class="tabs is-small is-boxed">
	<ul>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<li class={pageSelected == 'endpoint' ? 'is-active' : ''}>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a
				on:click={() => {
					pageSelected = 'endpoint';
				}}>Endpoints</a
			>
		</li>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<li class={pageSelected == 'app' ? 'is-active' : ''}>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a
				on:click={() => {
					pageSelected = 'app';
				}}>App</a
			>
		</li>
	</ul>
</div>
<div class={pageSelected == 'endpoint' ? '' : 'is-hidden'}>
	<Table bind:RawDataTable={appDataTable} bind:columns>
		<span slot="l01"> Endpoints </span>

		<span slot="r07">
			{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.type == 1 || ($userStore.role.attrs && $userStore.role.attrs.apps && $userStore.role.attrs.apps.update))}
				<button
					class="button is-small"
					on:click={() => {
						console.log('save', appDataTable);
						if (confirm('Do you want to save the application data?')) {
							app = TableToApp(appDataTable);
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
	</Table>
</div>
<div class={pageSelected == 'app' ? '' : 'is-hidden'}>
	<Level>
		<span slot="l01"> <strong>APPLICATION</strong></span>
		<span slot="r01">
			{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.type == 1 || ($userStore.role.attrs && $userStore.role.attrs.apps && $userStore.role.attrs.apps.update))}
				<button
					class="button is-small"
					on:click={() => {
						console.log('save', app);
						if (confirm('Do you want to save the application data?')) {
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
			{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.type == 1 || ($userStore.role.attrs && $userStore.role.attrs.apps && $userStore.role.attrs.apps.update))}
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
						const jsonString = JSON.stringify(app, null, 2);

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
			{#if $userStore && $userStore.role && $userStore.role.enabled && ($userStore.role.type == 1 || ($userStore.role.attrs && $userStore.role.attrs.apps && $userStore.role.attrs.apps.update))}
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

										// Aquí puedes realizar acciones con los datos JSON, por ejemplo, mostrarlos en la página.
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
								alert('Ha hecho click');

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

	{#if app}
		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label is-small">App</label>
			<div class="control">
				<input class="input is-small" type="text" placeholder="Text input" bind:value={app.app} />
			</div>
		</div>

		<div class="field">
			<div class="control">
				<label class="checkbox is-small">
					<input type="checkbox" bind:checked={app.data.enabled} />
					Enabled
				</label>
			</div>
		</div>

		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label is-small">Description</label>
			<div class="control">
				<textarea
					class="textarea is-small"
					placeholder="Description"
					bind:value={app.data.description}
				/>
			</div>
		</div>

		{#if app && app.data && app.data.namespaces}
			<div class="box">
				<div class="tabs is-small is-boxed">
					<ul>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-missing-attribute -->
						{#each app.data.namespaces as namespace}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-missing-attribute -->
							<li class={namespaceSelected == namespace.namespace ? 'is-active' : ''}>
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<a
									on:click={() => {
										namespaceSelected = namespace.namespace;
									}}
									><span> {namespace.namespace}</span>
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<span
										class="icon is-small"
										on:click={() => {
											paramDialogOneField.title = 'Edit Namespace';
											paramDialogOneField.label = 'Namespace';
											paramDialogOneField.inputType = 'text';
											paramDialogOneField.value = namespace.namespace;
											paramDialogOneField.function = (value) => {
												console.log(value);
												namespace.namespace = value;
												app = app;
											};

											showDialogOneField = true;
										}}><i class="fa-solid fa-pen" /></span
									>
								</a>
							</li>
						{/each}

						<li>
							<!-- svelte-ignore a11y-missing-attribute -->
							<a>
								<button
									class="button is-small"
									on:click={() => {
										paramDialogOneField.title = 'New Namespace';
										paramDialogOneField.label = 'Namespace';
										paramDialogOneField.inputType = 'text';
										paramDialogOneField.value = '';
										paramDialogOneField.function = (value) => {
											console.log(app);

											if (
												app.data.namespaces.find(
													(/** @type {any} */ element) => element.namespace == value.trim()
												)
											) {
												alert('The Namespace already exists');
											} else {
												app.data.namespaces.push({
													namespace: value.trim(),
													names: []
												});
											}
											console.log('namespace >>>', app);
											app = app;
										};

										showDialogOneField = true;
									}}
								>
									<span class="icon is-small">
										<i class="fa-solid fa-plus" />
									</span>
									<span>New Namespace</span>
								</button>
							</a>
						</li>
					</ul>
				</div>

				{#each app.data.namespaces as namespace}
					<div class={namespaceSelected == namespace.namespace ? '' : 'is-hidden'}>
						<div class="box">
							<div class="tabs is-small is-boxed">
								<ul>
									{#each namespace.names as name}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-missing-attribute -->
										<li class={nameSelected == name.name ? 'is-active' : ''}>
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<a
												on:click={() => {
													nameSelected = name.name;
												}}
												><span> {name.name}</span>
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<span
													class="icon is-small"
													on:click={() => {
														paramDialogOneField.title = 'Edit Name';
														paramDialogOneField.label = 'Name';
														paramDialogOneField.inputType = 'text';
														paramDialogOneField.value = name.name;
														paramDialogOneField.function = (value) => {
															console.log(value);
															name.name = value;
															app = app;
														};

														showDialogOneField = true;
													}}><i class="fa-solid fa-pen" /></span
												>
											</a>
										</li>
									{/each}

									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-missing-attribute -->
									<li>
										<a>
											<button
												class="button is-small"
												on:click={() => {
													paramDialogOneField.title = 'New name';
													paramDialogOneField.label = 'Name';
													paramDialogOneField.inputType = 'text';
													paramDialogOneField.value = '';
													paramDialogOneField.function = (value) => {
														if (!namespace.names || !Array.isArray(namespace.names)) {
															namespace.names = [];
														}

														if (
															namespace.names.find(
																(/** @type {any} */ element) => element.name == value.trim()
															)
														) {
															alert('The name already exists');
														} else {
															namespace.names.push({
																name: value.trim(),
																versions: []
															});
														}
														app = app;
													};
													showDialogOneField = true;
												}}
											>
												<span class="icon is-small">
													<i class="fa-solid fa-plus" />
												</span>
												<span>New Name</span>
											</button>
										</a>
									</li>
								</ul>
							</div>

							{#each namespace.names as name}
								<div class={nameSelected == name.name ? 'box' : 'is-hidden'}>
									<div class="tabs is-small is-boxed">
										<ul>
											{#each name.versions as version}
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-missing-attribute -->
												<li class={versionSelected == version.version ? 'is-active' : ''}>
													<!-- svelte-ignore a11y-no-static-element-interactions -->
													<a
														on:click={() => {
															versionSelected = version.version;
														}}
														><span>{version.version}</span>

														<!-- svelte-ignore a11y-no-static-element-interactions -->
														<span
															class="icon is-small"
															on:click={() => {
																paramDialogOneField.title = 'Edit Version';
																paramDialogOneField.label = 'Version';
																paramDialogOneField.inputType = 'text';
																paramDialogOneField.value = version.version;
																paramDialogOneField.function = (value) => {
																	console.log(value);
																	version.version = value;
																	app = app;
																};

																showDialogOneField = true;
															}}><i class="fa-solid fa-pen" /></span
														>
													</a>
												</li>
											{/each}

											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-missing-attribute -->
											<li>
												<a>
													<button
														class="button is-small"
														on:click={() => {
															paramDialogOneField.title = 'New version';
															paramDialogOneField.label = 'Version';
															paramDialogOneField.inputType = 'number';
															paramDialogOneField.value = '0.01';
															paramDialogOneField.function = (value) => {
																if (!name.versions || !Array.isArray(name.versions)) {
																	name.versions = [];
																}

																if (
																	name.versions.find(
																		(/** @type {any} */ element) => element.version == value
																	)
																) {
																	alert('The Version already exists');
																} else {
																	name.versions.push({
																		version: value,
																		dev: {},
																		qa: {},
																		prd: {}
																	});
																}
																app = app;
															};
															showDialogOneField = true;
														}}
													>
														<span class="icon is-small">
															<i class="fa-solid fa-plus" />
														</span>
														<span>New Version</span>
													</button>
												</a>
											</li>
										</ul>
									</div>

									{#each name.versions as version}
										<div class={versionSelected == version.version ? '' : 'is-hidden'}>
											<div class="columns">
												<div class="column env_class is-one-third">
													<Level>
														<span slot="l01">DEVELOPMENT</span>

														<span slot="r01"
															><button
																class="button is-small"
																on:click={() => {
																	console.log('To QA');

																	if (
																		confirm(
																			'Are you sure to copy and replace the QA code with the Development code?'
																		)
																	) {
																		version.qa = { ...version.dev };
																	}
																}}
															>
																<span class="icon is-small">
																	<i class="fa-solid fa-turn-up" />
																</span>
																<span>To QA</span>
															</button></span
														>
														<span slot="r02"
															><button
																class="button is-small"
																on:click={() => {
																	methodSelectedDialog = '';
																	paramDialogMethod = {
																		title: 'New Method - Development',
																		values: {
																			enabled: false,
																			public: false,
																			handler: ''
																		},
																		function: (/** @type {any} */ value) => {
																			console.log('<Funcion>', value);

																			if (methodValidation(value.method)) {
																				if (!version.dev[value.method]) {
																					version.dev[value.method] = value.data;
																					/*
                                          {
                                            code: "",
                                            enabled: value.enabled,
                                            handler: value.handler,
                                            public: value.public,
                                          };
                                          */
																				} else {
																					alert('The Method ' + value.method + ' already exists');
																				}
																			}
																		}
																	};
																	showDialogMethod = true;
																	app = app;
																}}
															>
																<span class="icon is-small">
																	<i class="fa-solid fa-plus" />
																</span>
																<span>New</span>
															</button></span
														>
													</Level>

													{#if version.dev}
														<CellMethods bind:value={version.dev} />
													{/if}
												</div>

												<div class="column env_class is-one-third">
													<Level>
														<span slot="l01">QA</span>
														<span slot="r01"
															><button
																class="button is-small"
																on:click={() => {
																	if (
																		confirm(
																			'Are you sure to copy and replace the Production code with the Development code?'
																		)
																	) {
																		version.prd = { ...version.qa };
																	}
																}}
															>
																<span class="icon is-small">
																	<i class="fa-solid fa-turn-up" />
																</span>
																<span>To Production</span>
															</button></span
														>
													</Level>
													{#if version.qa}
														<CellMethods bind:value={version.qa} />
													{/if}
												</div>

												<div class="column env_class is-one-third">
													<Level>
														<span slot="l01">PRODUCTION</span>
													</Level>
													{#if version.prd}
														<CellMethods bind:value={version.prd} />
													{/if}
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<DialogModal
	bind:Show={showDialogOneField}
	on:ok={() => {
		paramDialogOneField.function(paramDialogOneField.value);
		showDialogOneField = false;
	}}
>
	<span slot="title">{paramDialogOneField.title}</span>

	<div slot="body">
		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label is-small">{paramDialogOneField.label}</label>
			<div class="control">
				{#if paramDialogOneField.inputType == 'number'}
					<input
						class="input is-small"
						type="number"
						placeholder="input"
						min="0"
						step="0.01"
						bind:value={paramDialogOneField.value}
					/>
				{:else}
					<input
						class="input is-small"
						type="text"
						placeholder="input"
						bind:value={paramDialogOneField.value}
					/>
				{/if}
			</div>
		</div>
	</div>
</DialogModal>

<MethodDialog
	bind:Show={showDialogMethod}
	bind:title={paramDialogMethod.title}
	bind:method={methodSelectedDialog}
	on:ok={(e) => {
		console.log(e);
		paramDialogMethod.function(e.detail);
		showDialogMethod = false;
		app = app;
	}}
/>

<style>
	.env_class {
		border-left: outset;
		margin: 0.2em;
	}
</style>
