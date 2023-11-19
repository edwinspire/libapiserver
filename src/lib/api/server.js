import 'dotenv/config';

import { EventEmitter } from 'node:events';
import { defaultApps, getAppByName, getAppWithEndpoints } from './db/app.js';
import { demoEndpoints } from './db/endpoint.js';
import { defaultUser, login } from './db/user.js';
import { getRoleById } from './db/role.js';
import { createPathRequest } from './db/path_request.js';
import { defaultMethods } from './db/method.js';
import { defaultHandlers } from './db/handler.js';
import dbRestAPI from './db/sequelize.js';
import { Apikey, Application, prefixTableName } from './db/models.js';
import { runHandler } from './handler/handler.js';
import { getApiHandler } from './db/app.js';
import systemRoutes from './server/router/system.js';
import {
	validateToken,
	getUserPasswordTokenFromRequest,
	websocketUnauthorized,
	getIPFromRequest
} from '../api/server/utils.js';

import {
	struct_path,
	path_params,
	mqtt_path_params,
	path_params_to_url,
	defaultSystemPath
} from '../api/server/utils_path.js';

import aedesMod from 'aedes';
import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import websocketStream from 'websocket-stream';

import * as fnSystem from './server/functions/system.js';
import * as fnPublic from './server/functions/public.js';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';
import path from 'path';

import dns from 'dns';
//import { url } from 'node:inspector';
dns.setDefaultResultOrder('ipv4first');

const {
	PORT,
	EXPRESSJS_SERVER_TIMEOUT,
	EXPOSE_DEV_API,
	EXPOSE_QA_API,
	EXPOSE_PROD_API,
	PATH_API_RESPONSE_TIME,
	PATH_API_HOOKS,
	PATH_WS_HOOKS,
	MQTT_ENABLED,
	PATH_APP_FUNCTIONS
} = process.env;

//console.log('>>>>', WebSocket);

// Este bloque permite convertir un error a String con JSON.stringify
var config = {
	configurable: true,
	value: function () {
		var alt = {};
		var storeKey = function (/** @type {string | number} */ key) {
			// @ts-ignore
			alt[key] = this[key];
		};
		Object.getOwnPropertyNames(this).forEach(storeKey, this);
		return alt;
	}
};
Object.defineProperty(Error.prototype, 'toJSON', config);

let dir_fn = path.join(process.cwd(), PATH_APP_FUNCTIONS || 'fn');

console.log('Esta es la raiz actual: ', import.meta.url, dir_fn);

export class ServerAPI extends EventEmitter {
	constructor(buildDB = false, handlerExternal = undefined, customRouter = undefined) {
		super();

		/**
		 * @type {any[]}
		 */
		this._ws_paths = [];
		//this._cacheFn = {};
		this._cacheApi = new Map();
		this._cacheRoles = new Map();
		this._cacheAPIKey = new Map();
		this._fn = new Map();
		this._path_ws_api_response_time =
			PATH_API_RESPONSE_TIME || '/system/api/endpoint/response/time';
		this._path_api_hooks = PATH_API_HOOKS || '/system/api/hooks';
		this._path_ws_hooks = PATH_WS_HOOKS || '/system/ws/hooks';
		this.buildDB(buildDB);

		// @ts-ignore
		let aedes;

		if (MQTT_ENABLED == 'true') {
			//    defaultUser();
			aedes = new aedesMod({
				authorizePublish: async (client, packet, callback) => {
					//let parts = packet.topic.split('/');
					let dataUrl = mqtt_path_params(packet.topic);
					// @ts-ignore
					if (dataUrl && dataUrl.params.username == client.APIServer.username) {
						try {
							// @ts-ignore

							let h = await this._getApiHandler(
								// @ts-ignore
								dataUrl.params.app,
								// @ts-ignore
								dataUrl.params.namespace,
								// @ts-ignore
								dataUrl.params.name,
								// @ts-ignore
								dataUrl.params.version,
								// @ts-ignore
								dataUrl.params.environment,
								'MQTT'
							);
							//console.log(h);
							if (h.status == 200 && h.params.publish) {
								// @ts-ignore
								if (
									// @ts-ignore
									await this._checkAuthorization(
										// @ts-ignore
										path_params_to_url(dataUrl.params),
										'MQTT',
										// @ts-ignore
										client.APIServer.role.idrole
									)
								) {
									callback();
								} else {
									callback(new Error('You dont have authorization.'));
								}
							} else {
								callback(new Error(h.message));
							}
						} catch (error) {
							// @ts-ignore
							callback(new Error(error.message));
						}
					} else {
						callback(new Error('You can only subscribe to a topic under your username.'));
					}
				},
				authorizeSubscribe: async (client, subscription, callback) => {
					if (subscription.topic == '$SYS/#' || subscription.topic == '#') {
						callback(null, subscription);
					} else {
						let dataUrl = mqtt_path_params(subscription.topic);
						//console.log(subscription.topic, dataUrl, client.APIServer);
						// @ts-ignore
						if (dataUrl && dataUrl.params.username == client.APIServer.username) {
							try {
								let h = await this._getApiHandler(
									// @ts-ignore
									dataUrl.params.app,
									// @ts-ignore
									dataUrl.params.namespace,
									// @ts-ignore
									dataUrl.params.name,
									// @ts-ignore
									dataUrl.params.version,
									// @ts-ignore
									dataUrl.params.environment,
									'MQTT'
								);

								//	console.log(h);
								if (h.status == 200 && h.params.subscribe) {
									// @ts-ignore
									if (
										await this._checkAuthorization(
											// @ts-ignore
											path_params_to_url(dataUrl.params),
											'MQTT',
											// @ts-ignore
											client.APIServer.role.idrole
										)
									) {
										callback(null, subscription);
									} else {
										callback(new Error('You dont have authorization.'));
									}
								} else {
									callback(new Error(h.message));
								}
							} catch (error) {
								// @ts-ignore
								callback(new Error(error.message));
							}
						} else {
							callback(new Error('You can only subscribe to a topic under your username.'));
						}
					}
				},
				authenticate: async (client, username, password, callback) => {
					try {
						// @ts-ignore
						let u = await login(username, password);

						//console.log(u);

						if (u.login) {
							this._cacheRoles.set(u.role.idrole, u.role);
						}
						//console.log(u);
						// @ts-ignore
						client.APIServer = {
							username: u.username,
							role: { idrole: u.role.idrole }
						};
						callback(null, u.login && u.role.enabled);
					} catch (error) {
						console.log(error);
						callback(null, false);
					}
				}
			});

			// Manejar eventos de mensaje recibido
			aedes.on('publish', (packet, client) => {
				if (packet.cmd === 'publish') {
					//console.log(`Mensaje recibido en el tópico: ${packet.topic}`);
					//console.log(`Contenido del mensaje: ${packet.payload.toString()}`);
					this.emit('mqtt_publish', { packet, client });
				}
			});
		}

		try {
			//////////////////////////
			fs.readdirSync(dir_fn).forEach(async (_app_name) => {
				console.log('App Name -> ', _app_name);

				const filePath = path.join(dir_fn, _app_name);

				const stat = fs.statSync(filePath);
				if (stat.isFile()) {
					console.log('Es un archivo:', _app_name);
				} else if (stat.isDirectory()) {
					console.log('Es un directorio, por lo tanto es el nombre de la app:', filePath);
					// Buscamos los archivos js para cargarlos como modulos
					try {
						fs.readdirSync(filePath).forEach(async (file_app) => {
							console.log('Load Module -> ', file_app);

							const fileModule = path.join(filePath, file_app);
							const stat_mod = fs.statSync(fileModule);

							if (stat_mod.isFile() && file_app.endsWith('.js') && file_app.startsWith('fn')) {
								console.log('Es un archivo:', fileModule);

								const taskModule = await import(fileModule);

								console.log('Module: ', taskModule);

								if (taskModule && taskModule.default) {
									this._appendAppFunction(
										_app_name,
										file_app.replace('.js', ''),
										taskModule.default
									);
								}
							}
						});
					} catch (error) {
						console.log(error);
					}
				}
			});
		} catch (error) {
			console.log(error);
		}

		this.app = express();

		//console.log(WebSocket);

		this._httpServer = http.createServer(this.app);
		this._wsServer = new WebSocket.Server({
			noServer: true
		});

		this._httpServer.on('upgrade', async (request, socket, head) => {
			//console.log('>----------------------> ', request, head);
			// if (MQTT_ENABLED == "true")
			if (MQTT_ENABLED == 'true' && request.headers['sec-websocket-protocol'] == 'mqtt') {
				// Si el cliente está autenticado, permitir la conexión WebSocket
				// @ts-ignore
				this._wsServer.handleUpgrade(request, socket, head, (ws) => {
					//req.hola = "Mundo";
					// @ts-ignore
					this._wsServer.emit('connection', ws, request); // Emitir el evento 'connection' para manejar la conexión WebSocket
				});
			} else {
				try {
					// @ts-ignore
					let data_url = path_params(request.url);

					//					console.log('===>>>>>>> ', data_url);

					if (data_url) {
						let dataUser = getUserPasswordTokenFromRequest(request);
						console.log('--------------->-<>>>>> dataUser', dataUser);
						// app, namespace, name, version, environment, method
						// @ts-ignore
						let h = await this._getApiHandler(
							// @ts-ignore
							data_url.params.app,
							// @ts-ignore
							data_url.params.namespace,
							// @ts-ignore
							data_url.params.name,
							// @ts-ignore
							data_url.params.version,
							// @ts-ignore
							data_url.params.environment,
							'WS'
						);
						//						console.log(h);
						if (h.status == 200) {
							if (!h.params.public) {
								// @ts-ignore
								//request.APIServer = {authorization: dataUser};
								console.log('------------------------------------------> dataUser', dataUser);
								let auth = await h.authentication(
									dataUser.token,
									dataUser.username,
									dataUser.password
								);
								//console.log(h.params, auth);
								if (auth) {
									let autho = await this._checkAuthorization(data_url.path, 'WS', auth.role);
									if (!autho) {
										//console.log('-- websocketUnauthorized');
										websocketUnauthorized(socket);
										return;
									}
								}
							}
						} else {
							socket.write(`HTTP/1.1 ${h.status} Invalid\r\n\r\n`);
							socket.destroy();
							return;
						}

						// Si el cliente está autenticado, permitir la conexión WebSocket
						// @ts-ignore
						this._wsServer.handleUpgrade(request, socket, head, (ws) => {
							// @ts-ignore
							ws.APIServer = {
								uuid: uuidv4(),
								// @ts-ignore
								path: data_url.path,
								broadcast: h.params.broadcast,
								authorization: dataUser
							};

							// @ts-ignore
							this._wsServer.emit('connection', ws, request); // Emitir el evento 'connection' para manejar la conexión WebSocket
						});
					} else {
						websocketUnauthorized(socket);
						return;
					}
				} catch (error) {
					websocketUnauthorized(socket);
					console.log(error);
					return;
				}
			}
		});

		this._wsServer.on(
			'connection',
			(
				/** @type {{ protocol: string; on: (arg0: string, arg1: (c: any) => void) => void; send: (arg0: number) => void; }} */ ws,
				req
			) => {
				//console.log('>>>>>>>>>>>>>>>>> WS connection.', ws);
				//ws.close(1003, "ok");
				// @ts-ignore
				if (MQTT_ENABLED == 'true' && aedes && ws.protocol == 'mqtt') {
					// Convertir la conexión WebSocket a websocket-stream
					// @ts-ignore
					const wsStream = websocketStream(ws, {
						binary: true // Cambia a true si necesitas soporte para datos binarios
					});

					// Manejar la conexión con aedes
					aedes.handle(wsStream);
				} else {
					ws.on('error', (e) => {
						console.log(e);
					});

					ws.on(
						'message',
						(
							/** @type {string | number | readonly any[] | Buffer | Uint8Array | DataView | ArrayBufferView | ArrayBuffer | SharedArrayBuffer | readonly number[] | { valueOf(): ArrayBuffer; } | { valueOf(): SharedArrayBuffer; } | { valueOf(): Uint8Array; } | { //this._cacheFn = {};
						valueOf(): readonly number[]; } | { valueOf(): string; } | { [Symbol.toPrimitive](hint: string): string; }} */ data,
							/** @type {any} */ isBinary
						) => {
							//console.log(`Received message ${data}`);

							this.emit('websocket_message', { data, isBinary, ws, request: req });
							// @ts-ignore
							if (ws.APIServer && ws.APIServer.path) {
								// @ts-ignore
								console.log('ws.APIServer.path', ws.APIServer.path);
								// @ts-ignore
								this.emit(`ws/msg${ws.APIServer.path}`, { data, isBinary, ws, request: req });
							}

							// Verificamos si el endpoint tiene habilitado broadcast para capturar los mensajes
							// @ts-ignore
							if (ws.APIServer.broadcast) {
								// console.log(" > Foreach >", this._wsServer.clients.length);

								this._wsServer.clients.forEach(
									(
										/** @type {{ protocol: any; readyState?: any; send: any; on?: (arg0: string, arg1: (c: any) => void) => void; }} */ clientws
									) => {
										//	console.log('>> clientws >> ', clientws);
										//	console.log(">> 1");
										if (
											ws != clientws &&
											clientws.protocol != 'mqtt' &&
											clientws.readyState === WebSocket.OPEN
										) {
											//		console.log(">> 2");
											clientws.send(data, { binary: isBinary });
											//	console.log(">> 3");
										}
										//	console.log(">> 4");
									}
								);
							}
						}
					);
				}
			}
		);

		this.app.use(express.json()); // Agrega esta línea

		// Middleware para capturar los request TODO: Aqui realizar un control de autorizaciones para los endpoints
		this.app.use((req, res, next) => {
			// Solo registra las url que no correspondan a apis
			if (!req.path.startsWith('/api')) {
				console.log(' ::: req.path >>>>', req.path);
				// @ts-ignore
				createPathRequest(req.path, getIPFromRequest(req), req.headers).then((r) => {
					console.log('createPathRequest >>>>>>> ', r);
				});
			}

			next();
		});

		// Emite un evento a websocket cuando la solicitud ha terminado
		this.app.use((req, res, next) => {
			const startTime = new Date().getTime();

			//console.log('\n\n\n >>> XXXX >>> ', req);

			// Emit time
			res.on('finish', () => {
				const endTime = new Date().getTime();
				const duration = endTime - startTime + 5;

				// console.log(`Tiempo de respuesta: ${duration} ms`);

				this.broadcastByPath(this._path_ws_api_response_time, {
					path: req.path,
					time: duration,
					method: req.method,
					timestamp: Date.now()
				});
			});

			next();
		});

		this.app.use(systemRoutes);

		this.app.get(defaultSystemPath('functions'), validateToken, (req, res) => {
			try {
				//	console.log('Functions >>>>>>>');
				// @ts-ignore
				this._functions(req, res);
			} catch (error) {
				// @ts-ignore
				res.status(500).json({ error: error.message });
			}
		});

		if (customRouter) {
			this.app.use(customRouter);
		}

		// Controlar para que este path sea solo accesible de forma local
		this.app.post(this._path_api_hooks, async (req, res) => {
			let clientIP = req.ip;
			if (clientIP === '127.0.0.1' || clientIP === '::1') {
				if (req.body && req.body.model) {
					res.status(200).json(req.body);
					let path = this._path_ws_hooks + '/' + req.body.model;

					console.log('WS HOOKS >>>>> ', path);

					if (req.body.model == prefixTableName('application')) {
						this._cacheApi.clear();
					}

					this.broadcastByPath(path, req.body);
				} else {
					res.status(404).json(req.body);
				}
			} else {
				res.status(403).json({});
			}
		});

		// Master input
		this.app.all(struct_path, async (req, res) => {
			let { app, namespace, name, version, environment } = req.params;

			try {
				let h = await this._getApiHandler(app, namespace, name, version, environment, req.method);
				// req.headers['api-token']

				//	console.log('HHHHHH >>>> ', h);

				if (h.status == 200) {
					let dataAuth = getUserPasswordTokenFromRequest(req);

					/*
					if (!this._cacheAPIKey.has(dataAuth.token)) {
						let apikeyData = await Apikey.findOne({ where: { apikey: dataAuth.token } });
						//		console.log('apikeyData: ', apikeyData.dataValues, dataAuth.token);
						this._cacheAPIKey.set(dataAuth.token, apikeyData.dataValues);

						//		console.log('>>> ', this._cacheAPIKey.keys());
					}
					*/

					let auth = await h.authentication(dataAuth.token, this._cacheAPIKey.get(dataAuth.token));
					console.log('auth: ', auth);

					if (auth) {
						runHandler(req, res, h.params, this._getFunctions(app));
					} else {
						res.status(401).json({
							error: 'Requires authentication'
						});
					}
				} else {
					res.status(h.status).json({
						// @ts-ignore
						error: h.message
					});
				}
			} catch (error) {
				res.status(505).json({
					// @ts-ignore
					error: error.message
				});
			}
		});

		if (handlerExternal) {
			this.app.use(handlerExternal);
		}

		this._addFunctions();

		let rto = 1000 * 60 * 5;
		if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
			rto = Number(EXPRESSJS_SERVER_TIMEOUT);
		}
		console.log('EXPRESSJS_SERVER_TIMEOUT: ' + EXPRESSJS_SERVER_TIMEOUT);
		this._httpServer.setTimeout(rto); // Para 5 minutos
	}

	/**
	 * @param {{ username: any; }} client
	 * @param {any} packet
	 * @param {any} callback
	 */
	_authorizePublish(client, packet, callback) {
		// TODO: Obtener el nombre de usuario del cliente (puedes implementar tu propia lógica para obtenerlo)
		// const username = client.username;

		//TODO: Verificar si el cliente tiene permiso para publicar en el tópico
		const tienePermisoPublicar = true; //tuFuncionParaVerificarPermisoPublicar(username, packet.topic);

		// Si tiene permiso, llama al callback sin ningún argumento
		if (tienePermisoPublicar) {
			callback();
		} else {
			// Si no tiene permiso, llama al callback con un Error
			callback(new Error('No tienes permiso para publicar en este tópico'));
		}
	}

	/**
	 * @param {string} path
	 * @param {string} method
	 * @param {number} idrole
	 */
	async _checkAuthorization(path, method, idrole) {
		//console.log(path);
		let paramsUrl = path_params(path);

		//let url_parts = path.split('/').slice(0, 7);
		//let env_part = url_parts[6] || '@';
		//let url = url_parts.slice(0, 6).join('/') + '/[environment]';
		// @ts-ignore
		let url = path.replace(paramsUrl.params.environment, '[environment]');
		let endpoint;
		let role = this._cacheRoles.get(idrole);

		if (!role && idrole && idrole > 0) {
			// console.log(' > _checkAuthorization > No está en cache!', idrole);
			role = await getRoleById(idrole, true);
			this._cacheRoles.set(idrole, role);
		}

		if (role && role.attrs && role.attrs.endpoints) {
			endpoint = role.attrs.endpoints.find(
				(/** @type {{ url: string; enabled: any; }} */ element) =>
					element.url == url && element.enabled
			);
		}

		if (!endpoint || !endpoint.methods) {
			return false;
		}

		//console.log(' > _checkAuthorization >>>> ', path, method, idrole, role, url, endpoint);

		// @ts-ignore
		return endpoint.methods[method || '@'][paramsUrl.params.environment];
	}

	/**
	 * @param {string} appname
	 * @param {string} functionName
	 * @param {any} Function
	 */
	appendAppFunction(appname, functionName, Function) {
		if (appname != 'system' && functionName.startsWith('fn')) {
			this._appendAppFunction(appname, functionName, Function);
		} else {
			throw `The app must not be "system" and the function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
		}
	}

	/**
	 * @param {string} appname
	 * @param {string} functionName
	 * @param {any} fn
	 */
	_appendAppFunction(appname, functionName, fn) {
		if (functionName.startsWith('fn')) {
			if (this._fn.has(appname)) {
				let fnList = this._fn.get(appname);
				fnList[functionName] = fn;
				this._fn.set(appname, fnList);
			} else {
				let f = {};
				// @ts-ignore
				f[functionName] = fn;
				this._fn.set(appname, f);
			}
		} else {
			throw `The function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
		}
	}

	/**
	 * @param {any} path
	 * @param {any} payload
	 */
	broadcastByPath(path, payload) {
		let cli = this._ws_paths.find((p) => {
			return p.path == path;
		});

		if (cli && cli.WebSocket) {
			cli.WebSocket.clients.forEach(function each(
				/** @type {{ readyState: number; send: (arg0: string) => void; }} */ client
			) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(payload));
				}
			});
		}
	}

	/**
	 * @param {string | undefined} path
	 */
	websocketClients(path) {
		let clients = [];

		if (path) {
			try {
				for (const client of this._wsServer.clients) {
					// @ts-ignore
					if (client.readyState === WebSocket.OPEN && client.APIServer.path == path) {
						clients.push(client);
					}
				}
			} catch (error) {
				console.trace(error);
			}
		}

		return clients;
	}

	/**
	 * @param {string} url
	 */
	_url(url) {
		return new URL('http://localhost' + url);
	}

	/**
	 * @param {string} app
	 * @param {string} namespace
	 * @param {string} name
	 * @param {string} version
	 * @param {string} environment
	 * @param {string} method
	 */
	async _getApiHandler(app, namespace, name, version, environment, method) {
		if (
			(environment == 'qa' && EXPOSE_QA_API === 'true') ||
			(environment == 'dev' && EXPOSE_DEV_API === 'true') ||
			(environment == 'prd' && EXPOSE_PROD_API === 'true')
		) {
			let ver = Number(version.replace(/[^0-9.]/g, '')) * 1;

			try {
				// const apiPath = `/${app}/${namespace}/${name}/${version}/${environment}/${method}`;
				const apiPath = `${path_params_to_url({
					app,
					namespace,
					name,
					version: ver,
					environment
				})}/${method}`;

				if (!this._cacheApi.has(apiPath)) {
					// Obtener el idapp por el nombre - Debe buscar primero en la cache y luego en la base
					let appDataResult = await getAppWithEndpoints({ app: app }, false); //await Application.findOne({ where: { app: app } });

					if (appDataResult && appDataResult.length > 0) {
						const appDatas = appDataResult.map((result) => result.toJSON());
						//console.log('>>>> _getApiHandler NO usa cache', apiPath, appDatas[0]);
						const appData = appDatas[0];

						for (let i = 0; i < appData.apiserver_endpoints.length; i++) {
							let url_app_endpoint =
								path_params_to_url({
									app: appData.app,
									namespace: appData.apiserver_endpoints[i].namespace,
									name: appData.apiserver_endpoints[i].name,
									version: appData.apiserver_endpoints[i].version,
									environment: appData.apiserver_endpoints[i].environment
								}) + `/${appData.apiserver_endpoints[i].method}`;

							// console.log(apiPath, url_app_endpoint);

							this._cacheApi.set(
								url_app_endpoint,
								getApiHandler(appData.apiserver_endpoints[i], appData.vars)
							);
						}

						if (!this._cacheApi.has(apiPath)) {
							//	console.log('___>>>> no se encontro: ', apiPath);
							this._cacheApi.set(apiPath, { message: 'Not found', status: 404, params: undefined });
						}
					} else {
						this._cacheApi.set(apiPath, { message: `Not found`, status: 404 });
					}

					/*

*/
				}
				//	console.log('apiPath: ', apiPath, this._cacheApi.get(apiPath));
				return this._cacheApi.get(apiPath);
			} catch (error) {
				console.trace(error);
				// @ts-ignore
				return { message: error.message, status: 505, params: undefined };
			}
		} else {
			// TODO: Registrar las llamadas a endpoints no existentes para detectar posibles ataques
			return { message: 'Not found', status: 404, params: undefined };
		}
	}

	/**
	 * @param {string} app
	 */
	async getApp(app) {
		return await getAppByName(app);
	}

	/**
	 * @param {boolean} buildDB
	 */
	buildDB(buildDB) {
		if (buildDB) {
			dbRestAPI.sync({ alter: false }).then(
				async () => {
					console.log('Crea la base de datos');

					/*
					try {
						await defaultRoles();
					} catch (error) {
						console.log(error);
					}
*/

					try {
						await defaultUser();
					} catch (error) {
						console.log(error);
					}

					try {
						await defaultMethods();
					} catch (error) {
						console.log(error);
					}

					try {
						await defaultHandlers();
					} catch (error) {
						console.log(error);
					}

					try {
						await defaultApps();
						await demoEndpoints();
					} catch (error) {
						console.log(error);
					}
				},
				(/** @type {any} */ e) => {
					console.log('no se pudo crear / modificar la base de datos', e);
				}
			);
		}
	}

	_addFunctions() {
		const entries = Object.entries(fnSystem);
		for (let [fName, fn] of entries) {
			//console.log(prop + ": " + fn);
			this._appendAppFunction('system', fName, fn);
		}

		const entriesP = Object.entries(fnPublic);
		for (let [fName, fn] of entriesP) {
			//console.log(prop + ": " + fn);
			this._appendAppFunction('public', fName, fn);
		}

		this._appendAppFunction('system', 'fnGetFunctions', this._functions);

		/*
		this._fn.forEach((fx) => {
			console.log(fx);
		});
		*/
	}

	/**
	 * @param {string} appName
	 */
	_getFunctions(appName) {
		let d = this._fn.get(appName);
		let p = this._fn.get('public');
		return { ...d, ...p };
	}

	/**
	 * @param {string} appName
	 */
	_getNameFunctions(appName) {
		let f = this._getFunctions(appName);
		if (f) {
			return Object.keys(f);
		}
		/*
	let d = this._fn.get(appName);
	let p = this._fn.get("public");

	//    console.log(appName, d, p);

	if (d && p) {
	  return Object.keys(p).concat(Object.keys(d)).flat();
	} else if (d) {
	  return Object.keys(d);
	} else if (p) {
	  return Object.keys(p);
	}
	*/

		return [];
	}

	async _functions(
		/** @type {{ params: any; body: import("sequelize").Optional<any, string>; }} */ req,
		/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
	) {
		try {
			// @ts-ignore
			res.status(200).json(this._getNameFunctions(req.query.appName));
		} catch (error) {
			console.trace(error);
			// @ts-ignore
			res.status(500).json({ error: error.message });
		}
	}

	listen() {
		//let g = this._getNameFunctions('system');
		//console.log(g);

		this._httpServer.listen(PORT, () => {
			console.log('App listening on port ' + PORT);
		});
	}
}
