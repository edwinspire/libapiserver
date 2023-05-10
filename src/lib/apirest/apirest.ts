//import { Low, JSONFile } from 'lowdb';
//import { join, dirname } from 'path';
import type { Json } from 'sequelize/types/utils';
import { ApiModel } from '../apirest/db/models.js';
//import { fileURLToPath } from 'url';

import { jsFunction } from './jsFunction';
import { fetchFunction } from './fetchFunction';
import { soapFunction } from './soapFunction';

//const __dirname = dirname(fileURLToPath(import.meta.url));

/*
let db;


export async function createConnection() {
	// Use JSON file for storage
	const file = join(__dirname, 'db.json');
    //const file = "$lib/apirest/db.json";
	console.log(file);
	const adapter = new JSONFile(file);
	db = new Low(adapter);

	// Read data from JSON file, this will set db.data content
	await db.read();

	db.data = db.data || { PRD: [], DEV: [], QA: [] };
	// Write db.data content to db.json
	await db.write();
}

export const getConnection = () => db;


export async function getDataFromFunction(
	params,
	request
) {
	// TODO Aqui modificar por variable de entorno si usamos lowdb o postgres u otro tipo de base de datos
	const selectDB = 'lowdb';
	let apirestdb = {};
	let data = {};
	const method_request = request.method;

	switch (selectDB) {
		case 'XXX':
			apirestdb = {};
			break;
		default:
			createConnection();
			await db.read();
			apirestdb = db.data;
			break;
	}

	let app;
	switch (params.environment.toLowerCase()) {
		case 'prd':
			if (apirestdb.PRD) {
				app = apirestdb.PRD.find(
					(element) => element.app.toLowerCase() == params.app
				);
			}
			break;
		case 'dev':
			if (apirestdb.DEV) {
				app = apirestdb.DEV.find(
					(element) => element.app.toLowerCase() == params.app
				);
			}
			break;
		case 'qa':
			if (apirestdb.QA) {
				app = apirestdb.QA.find(
					(element) => element.app.toLowerCase() == params.app
				);
			}
			break;
	}

	if (app && app.enabled) {
		const route_app = app.routes.find(
			(element) => element.route.toLowerCase() == params.route.toLowerCase()
		);

		if (route_app && route_app.enabled) {
			const method = route_app.methods.find(
				(element) =>
					element.method.toUpperCase() == method_request.toUpperCase() &&
					params.version == 'v' + element.version &&
					element.enabled
			);

			if (method) {
				//console.log("HANDLE", method.handler);

				switch (method.handler.name) {
					case 'jsFunction':
						data = jsFunction(request, method.handler.code);
						break;
					case 'fetchFunction':
						data = fetchFunction(request, method.handler);
						break;
					case 'soapFunction':
						data = soapFunction(request, method.handler.code);
						break;
					default:
						data = { status: 404, message: 'Method handle not found' };
						break;
				}
			} else {
				data = { status: 404, message: 'Method not found' };
			}
		} else {
			data = { status: 404, data: 'Route not found' };
		}
	} else {
		data = { status: 404, data: 'App not found' };
	}
	return data;
}
*/

enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

type Api = {
	description: string;
	icon: string;
	app: string;
	author: string;
	email: string;
	enabled: boolean;
	createionDate: Date;
	routes: [
		{
			description: string;
			route: string;
			enabled: boolean;
			methods: [
				{
					description: string;
					examples: [
						{
							description: string;
							payload: any;
							enable: boolean;
						}
					];
					method: HttpMethod;
					isPublic: boolean;
					handler: string;
					code: Json;
					version: number;
					enabled: boolean;
					createion_date: Date;
					modification_date: Date;
				}
			];
		}
	];
};

export async function getDataFromFunction(
	params: { environment: string; app: any; path: string; version: string },
	request: { method?: any; headers?: any; body?: any; query?: any }
) {
	// TODO Aqui modificar por variable de entorno si usamos lowdb o postgres u otro tipo de base de datos
	let apirestdb;
	let data;
	let dataTmp;
	const method_request = request.method;

console.log("params", params);

	switch (params.environment.toLowerCase()) {
		case 'prd':
			dataTmp = await ApiModel.Production.App.findAll({ where: { app: params.app.toLowerCase() } });
			break;
		case 'dev':
			dataTmp = await ApiModel.Dev.App.findAll({ where: { app: params.app.toLowerCase() } });
			break;
		case 'qa':
			dataTmp = await ApiModel.QA.App.findAll({ where: { app: params.app.toLowerCase() } });
			break;
	}

	if (dataTmp && Array.isArray(dataTmp) && dataTmp.length > 0) {
		if (dataTmp[0] && dataTmp[0].dataValues) {
			apirestdb = dataTmp[0].dataValues;
		}
	}

	console.log('apirestdb >>>> ', apirestdb);

	if (
		apirestdb &&
		apirestdb &&
		apirestdb.enabled &&
		apirestdb.routes &&
		Array.isArray(apirestdb.routes)
	) {
		const route_app = apirestdb.routes.find(
			(element: { route: string }) => {
				console.log(" ==>> ", element, params.path);
				return element.route.toLowerCase() == params.path.toLowerCase();
			}
		);

		console.log("route_app", route_app);

		if (route_app && route_app.enabled) {
			const method = route_app.methods.find(
				(element: { method: string; version: string; enabled: any }) =>
					element.method.toUpperCase() == method_request.toUpperCase() &&
					params.version == 'v' + element.version &&
					element.enabled
			);

			if (method && method.handler) {
				//console.log("HANDLE", method.handler);

				switch (method.handler) {
					case 'jsFunction':
						data = jsFunction(request, method.code);
						break;
					case 'fetchFunction':
						data = fetchFunction(request, method.handler);
						break;
					case 'soapFunction':
						data = soapFunction(request, method.code);
						break;
					default:
						data = { status: 404, message: 'Method handle not found' };
						break;
				}
			} else {
				data = { status: 404, message: 'Method not found' };
			}
		} else {
			data = { status: 404, data: 'Route not found' };
		}
	} else {
		data = { status: 404, data: 'App not found' };
	}
	return data;
}

/*
interface IApiData {
	apiData: Api;
	read(): Promise<Api>;
	write(): Promise<any>;
	connect(): Promise<boolean>;
}
*/

/*
class ApiLowDB implements IApiData {
	db: Low;
	apiData: Api = {} as Api;
	constructor(environment: string) {
		const file = join(__dirname, environment+ 'db.json');
		const adapter = new JSONFile(file);
		this.db = new Low(adapter);
	}


async connect(){
	let Result = false;
	try {
		// Read data from JSON file, this will set db.data content
		await this.db.read();

		this.db.data = this.db.data || ({} as Api);
		// Write db.data content to db.json
		await this.db.write();
		this.apiData = this.db.data as Api;
		Result = true;
	} catch (error) {
		console.log(error);
	}
	return Result;
}

	async read() {
		try {
			await this.db.read();
			this.apiData = this.db.data as 			Api;
		} catch (error) {
			console.log(error);
		}

		return this.apiData;
	}

	async write() {
		return await this.db.write();
	}


	 getDataFromFunction(
		params: any,
		request: any,
	) {
	
		let apirestdb = {};
		let data = {};
		const method_request = request.method;
		let app;
		switch (params.environment.toLowerCase()) {
			case 'prd':
				if (apirestdb.PRD) {
					app = apirestdb.PRD.find(
						(element) => element.app.toLowerCase() == params.app
					);
				}
				break;
			case 'dev':
				if (apirestdb.DEV) {
					app = apirestdb.DEV.find(
						(element) => element.app.toLowerCase() == params.app
					);
				}
				break;
			case 'qa':
				if (apirestdb.QA) {
					app = apirestdb.QA.find(
						(element) => element.app.toLowerCase() == params.app
					);
				}
				break;
		}
	
		if (app && app.enabled) {
			const route_app = app.routes.find(
				(element) => element.route.toLowerCase() == params.route.toLowerCase()
			);
	
			if (route_app && route_app.enabled) {
				const method = route_app.methods.find(
					(element) =>
						element.method.toUpperCase() == method_request.toUpperCase() &&
						params.version == 'v' + element.version &&
						element.enabled
				);
	
				if (method) {
					//console.log("HANDLE", method.handler);
	
					switch (method.handler.name) {
						case 'jsFunction':
							data = jsFunction(request, method.handler.code);
							break;
						case 'fetchFunction':
							data = fetchFunction(request, method.handler);
							break;
						case 'soapFunction':
							data = soapFunction(request, method.handler.code);
							break;
						default:
							data = { status: 404, message: 'Method handle not found' };
							break;
					}
				} else {
					data = { status: 404, message: 'Method not found' };
				}
			} else {
				data = { status: 404, data: 'Route not found' };
			}
		} else {
			data = { status: 404, data: 'App not found' };
		}
		return data;
	}

}
*/
