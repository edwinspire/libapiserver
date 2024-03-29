import 'dotenv/config';

import { EventEmitter } from 'node:events';
import { defaultApps, getAppByName, getAppWithEndpoints } from './db/app.js';
import { defaultEndpoints } from './db/endpoint.js';
import { defaultUser, login } from './db/user.js';
import { getRoleById } from './db/role.js';
import { createPathRequest } from './db/path_request.js';
import { defaultMethods } from './db/method.js';
import { defaultHandlers } from './db/handler.js';
import dbRestAPI from './db/sequelize.js';
import { prefixTableName } from './db/models.js';
import { runHandler } from './handler/handler.js';
import { getApiHandler } from './db/app.js';
import systemRoutes from './server/router/system.js';
import {
	validateToken,
	getUserPasswordTokenFromRequest,
	websocketUnauthorized,
	getIPFromRequest,
	getFunctionsFiles,
	md5
} from '../api/server/utils.js';

import {
	struct_path,
	path_params,
	mqtt_path_params,
	path_params_to_url,
	key_url_from_params,
	internal_url_hooks,
	websocket_hooks_resource,
	getPartUrl
	//	defaultSystemPath
} from '../api/server/utils_path.js';

import aedesMod from 'aedes';
import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import websocketStream from 'websocket-stream';

import { fnPublic, fnSystem } from './server/functions/index.js';

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

		if (!(EXPOSE_QA_API || EXPOSE_DEV_API || EXPOSE_PROD_API)) {
			throw 'One of the following environment variables must be set: EXPOSE_QA_API or EXPOSE_DEV_API or EXPOSE_PROD_API';
		}

		/**
		 * @type {any[]}
		 */
		this._ws_paths = [];
		//this._cacheFn = {};
		this._cacheApi = new Map();
		this._cacheRequest = new Map();
		this._cacheRoles = new Map();
		//this._cacheEndpoints = new Map();
		//		this._cacheAPIKey = new Map();
		this._fnDEV = new Map();
		this._fnQA = new Map();
		this._fnPRD = new Map();
		this._path_ws_api_response_time =
			PATH_API_RESPONSE_TIME || '/system/api/endpoint/response/time';
		this._path_api_hooks = PATH_API_HOOKS || internal_url_hooks;
		this._path_ws_hooks = PATH_WS_HOOKS || `/api/system${websocket_hooks_resource}`;
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

		/**
		 * @param {fs.PathLike} fn_path
		 */
		function CreateFnPath(fn_path) {
			try {
				if (!fs.existsSync(fn_path)) {
					// Si no existe, créala recursivamente
					// @ts-ignore
					fs.mkdirSync(fn_path, { recursive: true }, (/** @type {any} */ err) => {
						if (err) {
							console.error('Error al crear la ruta:', err);
						} else {
							console.log('Ruta creada exitosamente.');
						}
					});
				} else {
					console.log('La ruta ya existe.');
				}
			} catch (error) {
				console.error(error);
			}
			return fn_path;
		}

		// Crea las rutas para las funciones personalizadas
		CreateFnPath(`${dir_fn}/system/dev`);
		CreateFnPath(`${dir_fn}/system/qa`);
		CreateFnPath(`${dir_fn}/system/prd`);

		CreateFnPath(`${dir_fn}/public/dev`);
		CreateFnPath(`${dir_fn}/public/qa`);
		CreateFnPath(`${dir_fn}/public/prd`);

		getFunctionsFiles(dir_fn).forEach((data_js) => {
			this._appendFunctionsFiles(data_js.file, data_js.data.appName, data_js.data.environment);
		});
		/*
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
					this._addFunctionsFiles();
				}
			});
		} catch (error) {
			console.log(error);
		}
		*/

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
					let url_parts = getPartUrl(request.url);

					/*
					let { app, environment } = request.params;
					// @ts-ignore
					let resource = request.params[0];
					let method = 'WS';

					

					// @ts-ignore
					let data_url = path_params(request.url);
*/
					//					console.log('===>>>>>>> ', data_url);

					if (url_parts.app) {
						let dataUser = getUserPasswordTokenFromRequest(request);
						//						console.log('--------------->-<>>>>> dataUser', dataUser);

						let h = await this._getHandlerMiddleware(
							url_parts.app,
							url_parts.env,
							url_parts.resource,
							'WS',
							dataUser
						);

						// app, namespace, name, version, environment, method
						// @ts-ignore
						/*
						let h = await this.getApiHandler(
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
						*/
						//						console.log(h);
						if (h.status == 200 || url_parts.url == this._path_ws_hooks) {
							/*
							TODO: Aplicar autenticación

							if (!h.handler.params.public) {
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
							*/
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
								path: url_parts.url,
								broadcast: true,
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

		this.app.use(express.json({ limit: '150mb' }));
		this.app.use(express.urlencoded({ limit: '150mb' }));

		this.app.use(express.static('static'));

		// Middleware para capturar los request
		this.app.use((req, res, next) => {
			// Solo registra las url que no correspondan a apis
			if (!req.path.startsWith('/api')) {
				//	console.log(' ::: req.path >>>>', req.path);
				// @ts-ignore
				createPathRequest(req.path, getIPFromRequest(req), req.headers).then(() => {
					console.log('createPathRequest >>>>>>> ', req.path);
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
				console.log(res.locals);
				const endTime = new Date().getTime();
				const duration = endTime - startTime + 5;

				if (
					res.locals.lastResponse &&
					res.locals.lastResponse.hash_request &&
					res.locals.lastResponse.data &&
					!this._cacheRequest.has(res.locals.lastResponse.hash_request)
				) {
					this._cacheRequest.set(res.locals.lastResponse.hash_request, res.locals.lastResponse);
				}

				// console.log(`Tiempo de respuesta: ${duration} ms`);
				// TODO: No está funcionando
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

		this.app.get('/api/system/prd/functions', validateToken, (req, res) => {
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
			let clientIP = getIPFromRequest(req);
			if (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP === '::ffff:127.0.0.1') {
				// TODO: Manejar un web hook por cada aplicación
				if (req.body) {
					res.status(200).json(req.body);

					if (req.body.model) {
						let path = this._path_ws_hooks + '/' + req.body.model;

						console.log('\n\nWS HOOKS >>>>> ', path);

						if (
							req.body.model == prefixTableName('application') &&
							req.body.action &&
							req.body.action === 'afterUpsert'
						) {
							// TODO: Buscar la forma de identificar la aplicación modificada y borrar de caché solo la que se modificó
							this._cacheApi.clear();
						}
					}

					this.broadcastByPath(this._path_ws_hooks, req.body);
				} else {
					res.status(404).json(req.body);
				}
			} else {
				res.status(403).json({});
			}
		});

		// Master input
		this.app.all(
			struct_path,
			async (req, res, next) => {
				// @ts-ignore
				let { app, environment } = req.params;
				// @ts-ignore
				let resource = req.params[0];
				let method = req.method;

				console.log('<>>>>>>>> params: ', req.params, resource);

				let h = await this._getHandlerMiddleware(
					app,
					environment,
					resource,
					method,
					getUserPasswordTokenFromRequest(req)
				);

				if (h.status == 200) {
					next();
				} else {
					res.status(h.status).json({ message: h.message });
				}
			},
			async (req, res) => {
				// @ts-ignore
				let { app, environment } = req.params;
				// @ts-ignore
				let resource = req.params[0];

				try {
					let url_app_endpoint =
						path_params_to_url({
							app: app,
							environment: environment,
							resource: resource
						}) + `/${req.method}`;

					let handlerEndpoint = this._cacheApi.get(url_app_endpoint);

					//	console.log(':::::>>>>>>>>> handlerEndpoint: ', handlerEndpoint);

					if (
						handlerEndpoint.params &&
						handlerEndpoint.params.cache_time &&
						handlerEndpoint.params.cache_time > 0
					) {
						console.log('----- CACHE ------');

						let hash_request = md5({ body: req.body, query: req.query, url: req.url });
						let data_cache = undefined;
						let now = Date.now();
						// Eliminamos de la cache si ya ha expirado
						if (this._cacheRequest.has(hash_request)) {
							data_cache = this._cacheRequest.get(hash_request);
							if (data_cache && data_cache.expiration_date && data_cache.expiration_date < now) {
								this._cacheRequest.delete(hash_request);
								data_cache = undefined;
							}
						}

						if (data_cache) {
							res.status(200).json(data_cache.data);
						} else {
							res.locals.lastResponse = {
								hash_request: hash_request,
								expiration_date: Date.now() + handlerEndpoint.params.cache_time * 1000,
								data: undefined
							};

							runHandler(req, res, handlerEndpoint.params, this._getFunctions(app, environment));
						}
					} else {
						runHandler(req, res, handlerEndpoint.params, this._getFunctions(app, environment));
					}

					//runHandler(req, res, handlerEndpoint.params, this._getFunctions(app, environment));
				} catch (error) {
					res.status(505).json({
						// @ts-ignore
						error: error.message
					});
				}
			}
		);

		if (handlerExternal) {
			this.app.use(handlerExternal);
		}

		this._addFunctions();

		let rto = 1000 * 60 * 5;
		if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
			rto = Number(EXPRESSJS_SERVER_TIMEOUT);
		}
		console.log('EXPRESSJS_SERVER_TIMEOUT: ' + rto);
		this._httpServer.setTimeout(rto); // Para 5 minutos
	}

	/**
	 * @param {string} filePath
	 * @param {string} _app_name
	 * @param {string} environment
	 */
	_appendFunctionsFiles(filePath, _app_name, environment) {
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
							environment,
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
			role = await getRoleById(idrole);
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
	 * @param {string} environment
	 */
	appendAppFunction(appname, environment, functionName, Function) {
		if (appname != 'system' && functionName.startsWith('fn')) {
			this._appendAppFunction(appname, environment, functionName, Function);
		} else {
			throw `The app must not be "system" and the function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
		}
	}

	/**
	 * @param {string} environment
	 * @param {string} appname
	 * @param {string } functionName
	 * @param {any} [fn]
	 */
	_appendAppFunction(appname, environment, functionName, fn) {
		console.log(appname, environment, functionName);
		if (functionName.startsWith('fn')) {
			switch (environment) {
				case 'dev':
					if (this._fnDEV.has(appname)) {
						let fnList = this._fnDEV.get(appname);
						fnList[functionName] = fn;
						this._fnDEV.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnDEV.set(appname, f);
					}
					break;

				case 'qa':
					if (this._fnQA.has(appname)) {
						let fnList = this._fnQA.get(appname);
						fnList[functionName] = fn;
						this._fnQA.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnQA.set(appname, f);
					}
					break;

				case 'prd':
					if (this._fnPRD.has(appname)) {
						let fnList = this._fnPRD.get(appname);
						fnList[functionName] = fn;
						this._fnPRD.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnPRD.set(appname, f);
					}

					break;
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
		/*
		let cli = this._ws_paths.find((p) => {
			return p.path == path;
		});

		if (cli && cli.WebSocket) {
			cli.WebSocket.clients.forEach(function each(
				 client
			) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(payload));
				}
			});
		}
		*/
		this._wsServer.clients.forEach(function each(client) {
			// @ts-ignore
			if (
				client.APIServer &&
				client.APIServer.path == path &&
				client.readyState === WebSocket.OPEN
			) {
				client.send(JSON.stringify(payload));
			}
		});
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
					// @ts-ignore
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
									// @ts-ignore
									namespace: appData.apiserver_endpoints[i].namespace,
									name: appData.apiserver_endpoints[i].name,
									version: appData.apiserver_endpoints[i].version,
									environment: appData.apiserver_endpoints[i].environment
								}) + `/${appData.apiserver_endpoints[i].method}`;

							// console.log(apiPath, url_app_endpoint);

							this._cacheApi.set(
								url_app_endpoint,
								getApiHandler(appData.app, appData.apiserver_endpoints[i], appData.vars)
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
	 * @param {any} app
	 */
	async _loadEndpointsByAPPToCache(app) {
		try {
			// Carga los endpoints de una App a cache
			let appDataResult = await getAppWithEndpoints({ app: app }, false);

			if (appDataResult && appDataResult.length > 0) {
				const appDatas = appDataResult.map((result) => result.toJSON());

				const appData = appDatas[0];

				for (let i = 0; i < appData.apiserver_endpoints.length; i++) {
					let endpoint = appData.apiserver_endpoints[i];
					//let resources_parts = endpoint.resource.split('/');

					let url_app_endpoint = key_url_from_params(
						{
							app: appData.app,
							method: endpoint.method,
							resource: `/${endpoint.environment}${endpoint.resource}`
						}
						//{app: appData.app, resource: endpoint.resource, method: endpoint.method}
					);
					//`/api/${appData.app}/${endpoint.resource}/${endpoint.method}`;

					/*
						path_params_to_url({
							app: appData.app,
							environment: resources_parts[0],
							resource: endpoint.resource
						}) + `/${endpoint.method}`;
						*/

					// console.log(apiPath, url_app_endpoint);

					this._cacheApi.set(url_app_endpoint, getApiHandler(appData.app, endpoint, appData.vars));
				}
			}
		} catch (error) {
			console.trace(error);
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
			console.log('Crea la base de datos');

			(async () => {
				try {
					await dbRestAPI.sync({ alter: true });
					await defaultUser();
					await defaultMethods();
					await defaultHandlers();
					await defaultApps();
					await defaultEndpoints();
				} catch (error) {
					console.log(error);
				}
			})();
		}
		return true;
	}

	_addFunctions() {
		if (fnSystem) {
			if (fnSystem.fn_system_prd) {
				const entries = Object.entries(fnSystem.fn_system_prd);
				for (let [fName, fn] of entries) {
					console.log(':::::.> fnSystem >> ', fName, fn);
					this._appendAppFunction('system', 'prd', fName, fn);
				}
			}

			if (fnSystem.fn_system_qa) {
				const entries = Object.entries(fnSystem.fn_system_qa);
				for (let [fName, fn] of entries) {
					console.log(':::::.> fnSystem >> ', fName, fn);
					this._appendAppFunction('system', 'qa', fName, fn);
				}
			}

			if (fnSystem.fn_system_dev) {
				const entries = Object.entries(fnSystem.fn_system_dev);
				for (let [fName, fn] of entries) {
					console.log(':::::.> fnSystem >> ', fName, fn);
					this._appendAppFunction('system', 'dev', fName, fn);
				}
			}
		}

		if (fnPublic) {
			if (fnPublic.fn_public_dev) {
				const entriesP = Object.entries(fnPublic.fn_public_dev);
				for (let [fName, fn] of entriesP) {
					//console.log(prop + ": " + fn);
					this._appendAppFunction('public', 'dev', fName, fn);
				}
			}
			if (fnPublic.fn_public_qa) {
				const entriesP = Object.entries(fnPublic.fn_public_qa);
				for (let [fName, fn] of entriesP) {
					//console.log(prop + ": " + fn);
					this._appendAppFunction('public', 'qa', fName, fn);
				}
			}
			if (fnPublic.fn_public_prd) {
				const entriesP = Object.entries(fnPublic.fn_public_prd);
				for (let [fName, fn] of entriesP) {
					//console.log(prop + ": " + fn);
					this._appendAppFunction('public', 'dev', fName, fn);
				}
			}
		}

		//this._appendAppFunction('system', 'fnGetFunctions', this._functions);

		/*
		this._fn.forEach((fx) => {
			console.log(fx);
		});
		*/
	}

	/**
	 * @param {string} appName
	 * @param {string} [environment]
	 */
	_getFunctions(appName, environment) {
		let d;
		let p;

		switch (environment) {
			case 'dev':
				d = this._fnDEV.get(appName);
				p = this._fnDEV.get('public');
				break;

			case 'qa':
				d = this._fnQA.get(appName);
				p = this._fnQA.get('public');
				break;
			case 'prd':
				d = this._fnPRD.get(appName);
				p = this._fnPRD.get('public');
				break;
		}

		return { ...d, ...p };
	}

	/**
	 * @param {string} appName
	 * @param {string } environment
	 */
	_getNameFunctions(appName, environment) {
		let f = this._getFunctions(appName, environment);
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

	/**
	 * @param {import("express-serve-static-core").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>} req
	 */
	async _functions(
		req,
		/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
	) {
		try {
			if (req && req.query && req.query.appName && req.query.environment) {
				// @ts-ignore
				res.status(200).json(this._getNameFunctions(req.query.appName, req.query.environment));
			} else {
				res.status(400).json({ error: 'appName and environment are required' });
			}
		} catch (error) {
			console.trace(error);
			// @ts-ignore
			res.status(500).json({ error: error.message });
		}
	}

	/**
	 * @param {string} app
	 * @param {string} environment
	 * @param {string} resource
	 * @param {string} method
	 * @param {{ data_token: { for: string; }; }} dataUser
	 */
	async _getHandlerMiddleware(app, environment, resource, method, dataUser) {
		let result = { status: 400, message: '', handler: undefined };

		if (
			(environment == 'qa' && EXPOSE_QA_API === 'true') ||
			(environment == 'dev' && EXPOSE_DEV_API === 'true') ||
			(environment == 'prd' && EXPOSE_PROD_API === 'true')
		) {
			//let ver = Number(version.replace(/[^0-9.]/g, '')) * 1;

			let url_app_endpoint = key_url_from_params({
				app: app,
				method: method,
				resource: `/${environment}${resource}`
			});

			if (!this._cacheApi.has(url_app_endpoint)) {
				await this._loadEndpointsByAPPToCache(app);
			}

			if (!this._cacheApi.has(url_app_endpoint)) {
				result = { message: 'API not found', status: 404, handler: undefined };
			} else {
				// Validar permisos
				result.handler = this._cacheApi.get(url_app_endpoint);

				//console.log(ep);

				// @ts-ignore
				if (!result.handler.params.enabled) {
					result.message = 'API unabled';
					result.status = 404;
				} else {
					// @ts-ignore
					if (result.handler.params.is_public) {
						result.message = 'Ok';
						result.status = 200;
					} else {
						//  API Privada, validar accesos
						//let dataUserRequest = getUserPasswordTokenFromRequest(req);

						if (dataUser && dataUser.data_token) {
							if (
								// @ts-ignore
								(dataUser.data_token.for == 'user' && result.handler.params.for_user) ||
								// @ts-ignore
								(dataUser.data_token.for == 'api' && result.handler.params.for_api)
							) {
								// TODO: Validar el entorno al que el usuario de la API tiene acceso

								result.message = 'Ok';
								result.status = 200;
							} else {
								result.message = 'Unauthorized';
								result.status = 403;
							}
						} else {
							result.message = 'Unauthorized';
							result.status = 401;
						}
					}
				}
			}
		} else {
			result = {
				message: 'Environment ' + environment + ' not found - Exposed: ' + EXPOSE_PROD_API,
				status: 401,
				handler: undefined
			};
		}
		return result;
	}

	listen() {
		//let g = this._getNameFunctions('system');
		//console.log(g);
		let port = PORT || 3000;
		this._httpServer.listen(port, () => {
			console.log('App listening on port ' + port);
		});
	}
}
