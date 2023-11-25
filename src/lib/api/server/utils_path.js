import { match } from "path-to-regexp";

export const struct_path = '/api/:app/:namespace/:name/:version/:environment';
const fn_match_url = match(struct_path, { decode: decodeURIComponent });

const mqtt_struct_path = '/api/:app/:namespace/:name/:version/:environment/:username/:topic*';
const fn_mqtt_match_url = match(mqtt_struct_path, { decode: decodeURIComponent });

export const path_params = (/** @type {string} */ url) => {
	let reqUrl = new URL(`http://localhost${url}`);
	return fn_match_url(reqUrl.pathname);
}

export const mqtt_path_params = (/** @type {string} */ url) => {
	let reqUrl = new URL(`http://localhost${url}`);
	return fn_mqtt_match_url(reqUrl.pathname);
}

export const path_params_to_url = (/** @type {{ app: any; namespace: any; name: any; version: any; environment: any; }} */ params) => {
	return `/api/${params.app}/${params.namespace}/${params.name}/${params.version}/${params.environment}`;
}

export const defaultSystemPath = (/** @type {string} */ name) => {
	return '/system/main/' + name;
};


