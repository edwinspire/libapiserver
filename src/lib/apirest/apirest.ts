/* eslint-disable @typescript-eslint/no-explicit-any */
import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { jsFunction } from './jsFunction';
import { fetchFunction } from './fetchFunction';
import { soapFunction } from './soapFunction';


/**
 * @type {Low<any>}
 */
let db: Low<unknown>;

const __dirname = dirname(fileURLToPath(import.meta.url));
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
	params: { environment: string; app: string; route: string; version: string },
	request: any
) {
	// TODO Aqui modificar por variable de entorno
	const selectDB = 'lowdb' as string;
	let apirestdb = {} as any;
	let data = {} as any;
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
					(element: { app: string }) => element.app.toLowerCase() == params.app
				);
			}
			break;
		case 'dev':
			if (apirestdb.DEV) {
				app = apirestdb.DEV.find(
					(element: { app: string }) => element.app.toLowerCase() == params.app
				);
			}
			break;
		case 'qa':
			if (apirestdb.QA) {
				app = apirestdb.QA.find(
					(element: { app: string }) => element.app.toLowerCase() == params.app
				);
			}
			break;
	}

	if (app && app.enabled) {
		const route_app = app.routes.find(
			(element: { route: string }) => element.route.toLowerCase() == params.route.toLowerCase()
		);

		if (route_app && route_app.enabled) {
			const method = route_app.methods.find(
				(element: { method: string; version: string; enabled: boolean }) =>
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
