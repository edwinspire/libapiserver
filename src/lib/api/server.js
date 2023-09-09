import 'dotenv/config';
import { EventEmitter } from 'node:events';
import { defaultApps } from './db/app.js';
import { defaultUser, login } from './db/user.js';
import { defaultRoles, getRoleById } from './db/role.js';
import { defaultMethods } from './db/method.js';
import { defaultHandlers } from './db/handler.js';
import dbRestAPI from './db/sequelize.js';
import { Application, prefixTableName } from './db/models.js';
import { runHandler } from './handler/handler.js';
import { getApiHandler } from './db/app.js';
import systemRoutes from './server/router/system.js';
import {
	validateToken,
	defaultSystemPath,
	getUserPasswordTokenFromRequest,
	websocketUnauthorized,
	struct_path,
	path_params,
	mqtt_path_params,
	path_params_to_url
} from '../api/server/utils.js';

import aedesMod from 'aedes';
import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import websocketStream from 'websocket-stream';

import * as fnSystem from './server/functions/system.js';
import * as fnPublic from './server/functions/public.js';
import { v4 as uuidv4 } from 'uuid';


const {
	PORT,
	EXPRESSJS_SERVER_TIMEOUT,
	EXPOSE_DEV_API,
	EXPOSE_QA_API,
	EXPOSE_PROD_API,
	PATH_API_RESPONSE_TIME,
	PATH_API_HOOKS,
	PATH_WS_HOOKS,
	MQTT_ENABLED
} = process.env;


//console.log('>>>>', WebSocket);

export class ServerAPI extends EventEmitter {
	/**
	 * @param {boolean} buildDB
	 * @param {any} handlerExternal
	 * @param {any} customRouter
	 */
	constructor(buildDB, handlerExternal, customRouter) {
		super();

		/**
		 * @type {any[]}
		 */
		this._ws_paths = [];
		//this._cacheFn = {};
		this._cacheApi = new Map();
		this._cacheRoles = new Map();
		this._fn = new Map();
		this._path_ws_api_response_time =
			PATH_API_RESPONSE_TIME || '/system/api/endpoint/response/time';
		this._path_api_hooks = PATH_API_HOOKS || '/system/api/hooks';
		this._path_ws_hooks = PATH_WS_HOOKS || '/system/ws/hooks';
		this.buildDB(buildDB);

		// @ts-ignore
		let aedes;

		if (MQTT_ENABLED == "true") {

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
									await this._checkAuthorization(path_params_to_url(dataUrl.params), 'MQTT', client.APIServer.role.idrole)
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
					console.log(`Mensaje recibido en el tópico: ${packet.topic}`);
					console.log(`Contenido del mensaje: ${packet.payload.toString()}`);
					this.emit('mqtt_publish', { packet, client });
				}

			});

		}

		this.app = express();

		//console.log(WebSocket);

		this._httpServer = http.createServer(this.app);
		this._wsServer = new WebSocket.Server({
			noServer: true
		});

		this._httpServer.on('upgrade', async (request, socket, head) => {
			//	console.log('>----------------------> ', request.client);
			// if (MQTT_ENABLED == "true") 
			if (MQTT_ENABLED == "true" && request.headers['sec-websocket-protocol'] == 'mqtt') {
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

						// app, namespace, name, version, environment, method
						// @ts-ignore
						let h = await this._getApiHandler(data_url.params.app, data_url.params.namespace, data_url.params.name, data_url.params.version, data_url.params.environment, 'WS');
						//						console.log(h);
						if (h.status == 200) {

							if (!h.params.public) {

								let dataUser = getUserPasswordTokenFromRequest(request);
								// @ts-ignore
								request.APIServer = {authorization: dataUser};
								//							console.log(dataUser);
								let auth = await h.authentication(dataUser.token, dataUser.username, dataUser.password);
								//console.log(h.params, auth);
								if (auth) {
									let autho = await this._checkAuthorization(data_url.path, 'WS', auth.role);
									if (!autho) {
										console.log('-- websocketUnauthorized');
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
							ws.APIServer = { uuid: uuidv4(), path: data_url.path, broadcast: h.params.broadcast };

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
				if (MQTT_ENABLED == "true" && aedes && ws.protocol == 'mqtt') {
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

							// Verificamos si el endpoint tiene habilitado broadcast para capturar los mensajes
							// @ts-ignore
							if (ws.APIServer.broadcast) {

								console.log(" > Foreach >", this._wsServer.clients.length);

								this._wsServer.clients.forEach((/** @type {{ protocol: any; readyState?: any; send: any; on?: (arg0: string, arg1: (c: any) => void) => void; }} */ clientws) => {
									//	console.log('>> clientws >> ', clientws);
									console.log(">> 1");
									if (ws != clientws && clientws.protocol != 'mqtt' && clientws.readyState === WebSocket.OPEN

									) {
										console.log(">> 2");
										clientws.send(data, { binary: isBinary });
										console.log(">> 3");
									}
									console.log(">> 4");


								});
							}


						}
					);
				}
			}
		);

		this.app.use(express.json()); // Agrega esta línea

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

		this.app.all(struct_path, async (req, res) => {
			let { app, namespace, name, version, environment } = req.params;

			try {
				let h = await this._getApiHandler(app, namespace, name, version, environment, req.method);
				// req.headers['api-token']

				// console.log("HHHHHH >>>> ", h);

				if (h.status == 200) {
					let dataAuth = getUserPasswordTokenFromRequest(req);

					let auth = await h.authentication(dataAuth.token, dataAuth.username, dataAuth.password);

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
		// Obtener el nombre de usuario del cliente (puedes implementar tu propia lógica para obtenerlo)
		const username = client.username;

		// Verificar si el cliente tiene permiso para publicar en el tópico
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
			console.log(' > _checkAuthorization > No está en cache!', idrole);
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
		if (appname != 'system') {
			this._appendAppFunction(appname, "fn"+functionName, Function);
		} else {
			throw 'system not allow';
		}
	}

	/**
	 * @param {string} appname
	 * @param {string} functionName
	 * @param {any} Function
	 */
	_appendAppFunction(appname, functionName, Function) {
		if (this._fn.has(appname)) {
			let fnList = this._fn.get(appname);
			fnList[functionName] = Function;
			this._fn.set(appname, fnList);
		} else {
			let f = {};
			// @ts-ignore
			f[functionName] = Function;
			this._fn.set(appname, f);
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
			try {
				const apiPath = `/${app}/${namespace}/${name}/${version}/${environment}/${method}`;
				if (!this._cacheApi.has(apiPath)) {
					// Obtener el idapp por el nombre - Debe buscar primero en la cache y luego en la base
					let appData = await Application.findOne({ where: { app: app } });
					console.log('>>>> _getApiHandler NO usa cache', apiPath, appData);
					this._cacheApi.set(
						apiPath,
						getApiHandler(appData, app, namespace, name, version, environment, method)
					);
				}
				//console.log();
				return this._cacheApi.get(apiPath);
			} catch (error) {
				console.trace(error);
				// @ts-ignore
				return { message: error.message, status: 505, params: undefined };
			}
		} else {
			return { message: 'Not found', status: 404, params: undefined };
		}
	}

	/**
	 * @param {boolean} buildDB
	 */
	buildDB(buildDB) {
		if (buildDB) {
			dbRestAPI.sync({ alter: false }).then(
				async () => {
					console.log('Crea la base de datos');

					try {
						await defaultRoles();
					} catch (error) {
						console.log(error);
					}

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
			this.appendAppFunction('public', fName, fn);
		}

		this._appendAppFunction('system', 'fnGetFunctions', this._functions);

		this._fn.forEach((fx) => {
			console.log(fx);
		});
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

	_functions = async (
		/** @type {{ params: any; body: import("sequelize").Optional<any, string>; }} */ req,
		/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
	) => {
		try {
			// @ts-ignore
			res.status(200).json(this._getNameFunctions(req.query.appName));
		} catch (error) {
			console.log(error);
			// @ts-ignore
			res.status(500).json({ error: error.message });
		}
	};

	listen() {
		let g = this._getNameFunctions('system');
		console.log(g);

		this._httpServer.listen(PORT, () => {
			console.log('App listening on port ' + PORT);
		});
	}
}
