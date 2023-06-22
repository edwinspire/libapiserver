//import { Low, JSONFile } from 'lowdb';
//import { join, dirname } from 'path';
//import type { Json } from 'sequelize/types/utils';
//import { App } from '../db/models.js'
//import { fileURLToPath } from 'url';

import { jsFunction } from "./jsFunction.js";
import { fetchFunction } from "./fetchFunction.js";
import { soapFunction } from "./soapFunction.js";
import { sqlFunction } from "./sqlFunction.js";

/*
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
*/

/**
 * @param {{ headers: any; body: any; query: any; }} request
 * @param {any} response
 * @param {{ handler: string; code: string; }} method
 */
export function runHandler(request, response, method) {
  switch (method.handler) {
    case "js":
      jsFunction(request, response, method);
      break;
    case "fetch":
      // @ts-ignore
      fetchFunction(request, response, method);
      break;
    case "soap":
      soapFunction(request, response, method);
      break;
    case "sql":
      sqlFunction(request, response, method);
      break;
    default:
      response.status(404).json(`handler ${method.handler} not valid`);
      break;
  }
}
