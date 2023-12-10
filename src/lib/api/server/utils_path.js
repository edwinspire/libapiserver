import { match } from 'path-to-regexp';

//export const struct_path = '/api/:app/:namespace/:name/:version/:environment';
export const struct_path = '/api/:app/:environment*';

export const internal_url_hooks = "/api/system/prd/hooks";

const fn_match_url = match(struct_path, { decode: decodeURIComponent });

const mqtt_struct_path = '/api/:app/:namespace/:name/:version/:environment/:username/:topic*';
const fn_mqtt_match_url = match(mqtt_struct_path, { decode: decodeURIComponent });

export const path_params = (/** @type {string} */ url) => {
	let reqUrl = new URL(`http://localhost${url}`);
	return fn_match_url(reqUrl.pathname);
};

export const mqtt_path_params = (/** @type {string} */ url) => {
	let reqUrl = new URL(`http://localhost${url}`);
	return fn_mqtt_match_url(reqUrl.pathname);
};

//export const path_params_to_url = (/** @type {{ app: any; namespace: any; name: any; version: any; environment: any; }} */ params) => {
//	return `/api/${params.app}/${params.namespace}/${params.name}/${params.version}/${params.environment}`;
//}

export const path_params_to_url = (
	/** @type {{ app: string; environment: string; resource: string; }} */ params
) => {
	return `/api/${params.app}/${params.environment}${params.resource}`;
};

export const key_url_from_params = (
	/** @type {{ app: string; method: string; resource: string; }} */ params
) => {
	return `/api/${params.app}${params.resource}/${params.method}`;
};

/**
 * @param {string} string_url
 */
export function validateURL(string_url) {
	const patron = /^\/[a-zA-Z0-9\-._~%]+(\/[a-zA-Z0-9\-._~%]+)*\/?$/;
	// ^ Inicio de la cadena
	// \/ Barra inicial
	// [a-zA-Z0-9\-._~%]+ Uno o más caracteres permitidos en la ruta
	// (\/[a-zA-Z0-9\-._~%]+)* Cero o más grupos adicionales de barra seguido de caracteres permitidos
	// \/? Barra opcional al final
	// $ Fin de la cadena

	if (patron.test(string_url)) {
		return true;
	} else {
		return false;
	}
}
