import { Application } from './models.js';
import { checkToken } from '../server/utils.js';
import { createFunction } from '../handler/jsFunction.js';
import { defaultUser, login } from './user.js';

// READ
export const getAppById = async (/** @type {import("sequelize").Identifier} */ idapp) => {
	try {
		const app = await Application.findByPk(idapp, {
			attributes: ['idapp', 'app', 'data', 'vars']
		});
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
		let [app, create] = await Application.upsert(appData, transaction);

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
export function getApiHandler(appData, app, namespace, name, version, environment, method) {
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

													//console.log('returnHandler.params >>>> ', returnHandler);

													if (returnHandler.params.public) {
														returnHandler.authentication = async (
															/** @type {string} */ token,
															/** @type {string} */ username,
															/** @type {string} */ password
														) => {
															return true;
														};
													} else {
														// @ts-ignore
														returnHandler.authentication = async (
															/** @type {string} */ token,
															/** @type {string} */ username,
															/** @type {string} */ password
														) => {
															let dataUser = undefined;

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

															return dataUser;
														};
													}

													returnHandler.params.code = returnHandler.params.code || '';

console.log('typeof appData.vars: ', appData.vars , typeof appData.vars === 'object', returnHandler.params.code);

													if (appData.vars && typeof appData.vars === 'object') {
														const props = Object.keys(appData.vars);
														for (let i = 0; i < props.length; i++) {
															const prop = props[i];

console.log('typeof appData.vars[prop]: ', appData.vars[prop], typeof appData.vars[prop]);

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

export const defaultApps = async () => {
	try {
		console.log(' defaultApps >>>>>> ');

		let appDemo = {
			enabled: true,
			namespaces: [
				{
					names: [
						{
							name: 'test_functions',
							versions: [
								{
									dev: {
										GET: {
											code: 'fnPublicAdd',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										},
										POST: {
											code: 'fnPublicDemo',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										}
									},
									prd: {
										GET: {
											code: 'fnPublicAdd',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										},
										POST: {
											code: 'fnPublicDemo',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										}
									},
									qa: {
										GET: {
											code: 'fnPublicAdd',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										},
										POST: {
											code: 'fnPublicDemo',
											enabled: true,
											handler: 'FUNCTION',
											public: true
										}
									},
									version: '0.01'
								}
							]
						},
						{
							name: 'test_fetch',
							versions: [
								{
									dev: {
										GET: {
											code: 'https://api.github.com/users/edwinspire',
											enabled: true,
											handler: 'FETCH',
											public: true
										},
										WS: {
											code: '',
											enabled: true,
											handler: 'NA',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.01'
								},
								{
									dev: {
										GET: {
											code: '$_VAR_FETCH',
											enabled: true,
											handler: 'FETCH',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.02'
								}
							]
						},
						{
							name: 'test_javascript',
							versions: [
								{
									dev: {
										GET: {
											code: '$_RETURN_DATA_ = {name: $_REQUEST_.query.name};',
											enabled: true,
											handler: 'JS',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.01'
								},
								{
									dev: {
										GET: {
											code: '$_RETURN_DATA_ = $_VARS_APP;',
											enabled: true,
											handler: 'JS',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.02'
								}
							]
						},
						{
							name: 'test_soap',
							versions: [
								{
									dev: {
										GET: {
											code: '{\n  "wsdl": "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",\n  "FunctionName": "NumberToDollars",\n  "BasicAuthSecurity": {\n    "User": "any",\n    "Password": "any"\n  }\n}',
											enabled: true,
											handler: 'SOAP',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.01'
								},
								{
									dev: {
										GET: {
											code: '"$_VAR_SOAP_TEST"',
											enabled: true,
											handler: 'SOAP',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.02'
								}
							]
						},
						{
							name: 'test_sql',
							versions: [
								{
									dev: {
										GET: {
											code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},  "query": "SELECT 1097 AS test_sql;"\n}',
											enabled: true,
											handler: 'SQL',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: '0.01'
								},
								{
									dev: {
										GET: {
											code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},\n  "query": "SELECT $name as nombre;"\n}',
											enabled: true,
											handler: 'SQL',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: 0.02
								},
								{
									dev: {
										GET: {
											code: '{"config": { "database": "omsv2",\n  "username": "postgres",\n  "password": "pg4321",\n  "options": {\n    "host": "132.128.241.18",\n    "port": 5432,\n    "dialect": "postgres"\n  }}, "query": "SELECT NOW();"\n}',
											enabled: true,
											handler: 'SQL',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: 0.03
								},
								{
									dev: {
										GET: {
											code: '{"config": { "database": "msdb",\n  "username": "sa",\n  "password": "sqlkarma",\n  "options": {\n    "host": "192.168.138.30",\n    "dialect": "mssql",\n    "encrypt": false\n  }}, "query": "SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;"\n}',
											enabled: true,
											handler: 'SQL',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: 0.04
								},
								{
									dev: {
										GET: {
											code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT $name as nombre, strftime(\'%Y-%m-%d %H-%M-%S\',\'now\') AS dt;"\n}',
											enabled: true,
											handler: 'SQL',
											public: true
										}
									},
									prd: {},
									qa: {},
									version: 0.05
								}
							]
						},
						{
							name: 'test_ws',
							versions: [
								{
									version: '0.01',
									dev: {
										WS: {
											enabled: true,
											handler: 'NA',
											public: true,
											userAuthentication: false,
											tokenAuthentication: false,
											broadcast: true,
											description: 'Public WebSocket'
										}
									},
									qa: {},
									prd: {}
								},
								{
									version: '0.02',
									dev: {
										WS: {
											enabled: true,
											handler: 'NA',
											public: false,
											userAuthentication: true,
											tokenAuthentication: false,
											broadcast: true
										}
									},
									qa: {},
									prd: {}
								},
								{
									version: '0.03',
									dev: {
										WS: {
											enabled: true,
											handler: 'NA',
											public: false,
											userAuthentication: false,
											tokenAuthentication: true,
											broadcast: false
										}
									},
									qa: {},
									prd: {}
								}
							]
						},
						{
							name: 'test_mqtt',
							versions: [
								{
									version: '0.01',
									dev: {
										MQTT: {
											enabled: true,
											handler: 'NA',
											public: true,
											subscribe: true,
											publish: true,
											broadcast: false
										}
									},
									qa: {},
									prd: {}
								}
							]
						}
					],
					namespace: 'main'
				}
			]
		};

		let varsDemo = {
			$_VAR_DEMO_1: 10,
			$_VAR_DEMO_2: { host: 'google.com', var1: { a: 10, b: { casti: 3 } } },
			$_VAR_FETCH: 'https://api.github.com/users/auth0',
			$_VAR_SQLITE: {
				database: 'memory',
				username: '',
				password: '',
				options: {
					host: 'localhost',
					dialect: 'sqlite'
				}
			},
			$_VAR_SOAP_TEST: {
				wsdl: 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL',
				FunctionName: 'NumberToDollars',
				BasicAuthSecurity: {
					User: 'any',
					Password: 'any'
				}
			}
		};

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
