import dbsequelize from './sequelize.js';
import { Application, Endpoint } from './models.js';
import { checkAPIToken } from '../server/utils.js';
import { createFunction } from '../handler/jsFunction.js';
//import { login } from './user.js';
import { app_demo } from './demo_values.js';

export const getAppWithEndpoints = async (/** @type {any} */ where, /** @type {boolean} */ raw) => {
	return Application.findAll({
		where: where,
		attributes: ['idapp', 'app', 'description', 'enabled', 'vars', 'rowkey'],
		include: {
			model: Endpoint,
			//required: true, // INNER JOIN
			attributes: [
				'idendpoint',
				'enabled',
				'namespace',
				'name',
				'version',
				'environment',
				'method',
				'handler',
				'is_public',
				'code',
				'description',
				'rowkey'
			]
		},
		raw: raw,
		nest: false
	});
};

// READ
export const getAppById = async (
	/** @type {import("sequelize").Identifier} */ idapp,
	raw = false
) => {
	try {
		/*
		const app = await Application.findByPk(idapp, {
			attributes: ['idapp', 'app', 'data', 'vars']
		});
*/
		const app = await getAppWithEndpoints({ idapp: idapp }, raw);
		/*
		const app = await Application.findAll({
			where: { idapp: idapp },
			attributes: ['idapp', 'app', 'description', 'enabled', 'vars', 'rowkey'],
			include: {
				model: Endpoint,
				required: true, // INNER JOIN
				attributes: [
					'idendpoint',
					'enabled',
					'namespace',
					'name',
					'version',
					'environment',
					'method',
					'handler',
					'is_public',
					'code',
					'description',
					'rowkey'
				]
			},
			raw: raw, 
			nest: false
		});
		*/

		return app;
	} catch (error) {
		console.error('Error retrieving app:', error);
		throw error;
	}
};

export const getAppByName = async (/** @type {String} */ appname, raw = false) => {
	try {
		const app = await getAppWithEndpoints({ app: appname }, raw);
		return app;
	} catch (error) {
		console.error('Error retrieving app:', error);
		throw error;
	}
};

export const getAllApps = async () => {
	try {
		//const apps = await Application.findAll({ attributes: ["idapp", "app"] });
		const apps = await Application.findAll();
		return apps;
	} catch (error) {
		console.error('Error retrieving apps:', error);
		throw error;
	}
};

// UPSERT
export const upsertApp = async (
	/** @type {import("sequelize").Optional<any, string>} */ appData,
	/** @type {undefined} */ transaction
) => {
	try {
		let [app] = await Application.upsert(appData, transaction);

		//console.log('XXXX>>> [app, create] ', app, create);

		let data = app.dataValues;

		return data;
	} catch (error) {
		console.error('Error performing UPSERT on app:', error);
		throw error;
	}
};

/**
 * @param {Model<any, any> | null} appData
 * @param {string} app
 * @param {string} namespace
 * @param {string} name
 * @param {string} version
 * @param {string} environment
 * @param {string} method
 */
export function __getApiHandler(appData, app, namespace, name, version, environment, method) {
	let returnHandler = {};
	try {
		// @ts-ignore
		if (appData && appData.data && appData.data.enabled) {
			// Verificar que exista namespaces
			if (
				// @ts-ignore
				appData.data.namespaces &&
				// @ts-ignore
				Array.isArray(appData.data.namespaces)
			) {
				// Busca el namespace
				// @ts-ignore
				let ns = appData.data.namespaces.find(
					(/** @type {{ namespace: string; }} */ element) => element.namespace == namespace
				);

				// Verifcar si fue encontrado el namespace
				if (ns) {
					// Buscar el name
					if (ns.names && Array.isArray(ns.names)) {
						// Buscar el name
						let n = ns.names.find(
							(/** @type {{ name: string; }} */ element) => element.name == name
						);

						if (n) {
							let ver = Number(version.replace(/[^0-9.]/g, ''));

							// Verificamos que exista version dentro de name
							if (n.versions && Array.isArray(n.versions)) {
								// Buscamos la version
								let v = n.versions.find(
									(/** @type {{ version: number; }} */ element) => element.version == ver
								);

								if (v) {
									// Verificar que exista el ambiente
									if (v[environment]) {
										//   console.log('< v[environment] >', method, v[environment]);

										// Verificar el método
										if (v[environment][method]) {
											//   console.log('< v[environment][method] >', v[environment][method]);

											if (v[environment][method]) {
												// Verificar si es publico o privado
												if (v[environment][method].enabled) {
													//  && (v[environment][req.method].enabled   && checkToken(token))

													/*
														v[environment][method].public ||
														(!v[environment][method].public && checkToken(token))
													*/
													returnHandler.params = v[environment][method];

													console.log('returnHandler.params >>>> ', returnHandler);

													if (returnHandler.params.public) {
														returnHandler.authentication = async (/** @type {string} */ apikey) => {
															console.log('authentication, public: ', apikey);
															return true;
														};
													} else {
														// @ts-ignore
														returnHandler.authentication = async (
															/** @type {string} */ apikey,
															/** @type {string} */ apikeyData
														) => {
															/*
															if (returnHandler.params.tokenAuthentication && token) {
																dataUser = checkToken(token);
															}

															if (
																!dataUser &&
																returnHandler.params.userAuthentication &&
																username &&
																password
															) {
																let u = await login(username, password);
																dataUser = u && u.login ? checkToken(u.token) : false;
															}
															*/

															return checkAPIKey(apikey, apikeyData);
														};
													}

													returnHandler.params.code = returnHandler.params.code || '';

													console.log(
														'typeof appData.vars: ',
														appData.vars,
														typeof appData.vars === 'object',
														returnHandler.params.code
													);

													if (appData.vars && typeof appData.vars === 'object') {
														const props = Object.keys(appData.vars);
														for (let i = 0; i < props.length; i++) {
															const prop = props[i];

															console.log(
																'typeof appData.vars[prop]: ',
																appData.vars[prop],
																typeof appData.vars[prop]
															);

															switch (typeof appData.vars[prop]) {
																case 'string':
																	returnHandler.params.code = returnHandler.params.code.replace(
																		prop,
																		appData.vars[prop]
																	);
																	break;
																case 'object':
																	returnHandler.params.code = returnHandler.params.code.replace(
																		'"' + prop + '"',
																		JSON.stringify(appData.vars[prop])
																	);

																	returnHandler.params.code = returnHandler.params.code.replace(
																		prop,
																		JSON.stringify(appData.vars[prop])
																	);
																	break;
															}
														}
													}

													if (returnHandler.params.handler == 'JS') {
														returnHandler.params.jsFn = createFunction(
															returnHandler.params.code,
															appData.vars
														);
													}
													returnHandler.message = '';
													returnHandler.status = 200;
												} else {
													returnHandler.message = `Method ${method} Unabled`;
													returnHandler.status = 404;
												}
											} else {
												returnHandler.message = `Method ${method} on Environment ${environment}, unabled`;
												returnHandler.status = 404;
											}
										} else {
											returnHandler.message = `Method ${method} not exists on Environment ${environment}`;
											returnHandler.status = 404;
										}
									} else {
										returnHandler.message = `Environment ${environment} not exists on ${ver}`;
										returnHandler.status = 404;
									}
								} else {
									returnHandler.message = `Version ${ver} not exists on ${name}`;
									returnHandler.status = 404;
								}
							} else {
								returnHandler.message = `Not exists versions to name ${name}`;
								returnHandler.status = 404;
							}
						} else {
							returnHandler.message = `Name ${name} not found`;
							returnHandler.status = 404;
						}
					} else {
						returnHandler.message = `Names not exists in name ${name}`;
						returnHandler.status = 404;
					}
				} else {
					returnHandler.message = `Namespace ${namespace} not found`;
					returnHandler.status = 404;
				}
			} else {
				returnHandler.message = `Namespace ${namespace} not found`;
				returnHandler.status = 404;
			}
		} else {
			returnHandler.message = `App ${app} not found`;
			returnHandler.status = 404;
		}
	} catch (error) {
		// @ts-ignore
		returnHandler.message = error.message;
		returnHandler.status = 505;
		console.trace(error);
	}

	return returnHandler;
}



/**
 * @param {any} app_name
 * @param {{ enabled: any; environment: any; method: any; }} endpointData
 * @param {any | undefined} [appVars]
 */
export function getApiHandler(app_name, endpointData, appVars) {
	let returnHandler = {};
	returnHandler.params = endpointData;

//console.log('-----> endpointData >>>>>', endpointData);

	try {
		appVars = typeof appVars !== 'object' ? JSON.parse(appVars) : appVars;

		if (endpointData.enabled) {
			// @ts-ignore
			if (returnHandler.params.is_public) {
				returnHandler.authentication = async (/** @type {string} */ jw_token) => {
					console.log('authentication, public: ', jw_token);
					return true;
				};
			} else {
				// @ts-ignore
				returnHandler.authentication = async (
					/** @type {string} */ jw_token
				) => {
					return checkAPIToken(app_name, endpointData.environment, jw_token);
				};
			}

			// @ts-ignore
			returnHandler.params.code = returnHandler.params.code || '';

			if (appVars && typeof appVars === 'object') {
				const props = Object.keys(appVars);
				for (let i = 0; i < props.length; i++) {
					const prop = props[i];

					//	console.log('typeof appData.vars[prop]: ', appVars[prop], typeof appVars[prop]);

					switch (typeof appVars[prop]) {
						case 'string':
							// @ts-ignore
							returnHandler.params.code = returnHandler.params.code.replace(prop, appVars[prop]);
							break;
						case 'object':
							// @ts-ignore
							returnHandler.params.code = returnHandler.params.code.replace(
								'"' + prop + '"',
								JSON.stringify(appVars[prop])
							);

							// @ts-ignore
							returnHandler.params.code = returnHandler.params.code.replace(
								prop,
								JSON.stringify(appVars[prop])
							);
							break;
					}
				}
			}

			// @ts-ignore
			if (returnHandler.params.handler == 'JS') {
				// @ts-ignore
				returnHandler.params.jsFn = createFunction(returnHandler.params.code, appVars);
			}
			returnHandler.message = '';
			returnHandler.status = 200;
		} else {
			returnHandler.message = `Method ${endpointData.method} Unabled`;
			returnHandler.status = 404;
			//console.log(endpointData);
		}
	} catch (error) {
		// @ts-ignore
		returnHandler.message = error.message;
		returnHandler.status = 505;
		console.trace(error);
	}

	return returnHandler;
}

/*
export const defaultApps = async () => {
	try {
		console.log(' defaultApps >>>>>> ');

		try {
			await Application.upsert({
				idapp: 1,
				app: 'demo',
				data: appDemo,
				vars: varsDemo
			});
		} catch (error) {
			console.log(error);
		}

		return;
	} catch (error) {
		console.error('Example error:', error);
		return;
	}
};
*/

export const defaultApps = async () => {
	let options = {
		updateOnDuplicate: ['idapp']
	};

	if (dbsequelize.getDialect() == 'mssql') {
		options = {
			// @ts-ignore
			onDuplicate: true // Opción válida para mssql
		};
	}

	try {
		await Application.bulkCreate(app_demo, options);

		console.log('Bulk upsert completado con éxito.');
	} catch (error) {
		console.error('Error durante el bulk upsert:', error);
	}
};
