import { login } from '../../../../db/user.js';
import { getAPIToken } from '../../../../db/api_user.js';
import { getAllHandlers } from '../../../../db/handler.js';
import { getAllMethods } from '../../../../db/method.js';
import { getAllApps, getAppById, upsertApp } from '../../../../db/app.js';
import { v4 as uuidv4 } from 'uuid';
import { upsertEndpoint } from '../../../../db/endpoint.js';
//import { validateToken } from '../../../utils.js';
//import { defaultSystemPath } from '../../../utils_path.js';


export function fnDemo(
	/** @type {any} */ req,
	/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
	try {
		// @ts-ignore
		res.status(200).json({ demo: 'demo' });
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {{ body: { username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: any) => void; status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} res
 */
export async function fnLogin(req, res) {
	try {
		let user = await login(req.body.username, req.body.password);

		res.set('user-token', user.token);

		if (user.login) {
			res.status(200).json(user);
		} else {
			res.status(401).json(user);
		}
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {{ body: { appname: string; username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new (): any; json: { (arg0: { token?: string; error?: any; }): void; new (): any; }; }; }} res
 */
export async function fnToken(req, res) {
	try {
		if (req.body.appname && req.body.username && req.body.password) {
			let token = await getAPIToken(req.body.appname, req.body.username, req.body.password);

			if (token) {
				res.set('api-token', token);
				res.status(200).json({ token });
			} else {
				res.status(401).json({});
			}
		} else {
			res.status(401).json({ error: 'Parameters are missing' });
		}
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {any} req
 * @param {{ set: (arg0: string, arg1: undefined) => void; status: (arg0: number) => { (): any; new (): any; json: { (arg0: { logout?: boolean; error?: any; }): void; new (): any; }; }; }} res
 */
export async function fnLogout(req, res) {
	try {
		// TODO: ver la forma de hacer un logout correctamente e invalide el token
		res.set('user-token', undefined);
		res.status(200).json({
			logout: true
		});
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} res
 */
export async function fnGetHandler(req, res) {
	try {
		const hs = await getAllHandlers();

		res.status(200).json(hs);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} res
 */
export async function fnGetMethod(req, res) {
	try {
		const methods = await getAllMethods();

		res.status(200).json(methods);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}



/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetEnvironment(req, res) {
	try {

		let env = [
			{ id: 'dev', text: `Develop` },
			{ id: 'qa', text: `Quality` },
			{ id: 'prd', text: `Production` }
		];

		res.status(200).json(env);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}



/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetApps(req, res) {
	try {
		const apps = await getAllApps();

		res.status(200).json(apps);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}

/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetAppById(req, res) {
	try {
		let raw = !req.query.raw || req.query.raw == 'false' ? false : true;

		console.log(req.params, req.query, raw);

		// @ts-ignore
		let data = await getAppById(req.query.idapp, raw);

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}




/**
 * @param {any} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnSaveApp(req, res) {
	try {
		console.log(req.params, req.body);

		// Agrega primero los datos de la app
		// @ts-ignore
		let data = await upsertApp(req.body);

		console.log('upsertApp:::::: ', data);

		if (data.idapp) {
			// Inserta / Actualiza los endpoints
			let promises_upsert = req.body.apiserver_endpoints.map(
				(/** @type {import("sequelize").Optional<any, string>} */ ep) => {
					ep.idapp = data.idapp;
					if (!ep.idendpoint) {
						ep.idendpoint = uuidv4();
					}
					if (!ep.handler) {
						ep.handler = '';
					}

					return upsertEndpoint(ep);
				}
			);

			let result_endpoints = await Promise.allSettled(promises_upsert);
			console.log('result_endpoints ==>>>', result_endpoints);
			//TODO: mejorar el retorno del upsert de lo endpoints
		}

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
}
