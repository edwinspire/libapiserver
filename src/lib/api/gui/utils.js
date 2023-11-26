// @ts-ignore
import uFetch from '@edwinspire/universal-fetch';
import { writable } from 'svelte/store';

const path_functions = '/system/main/functions';

//export const tokenStore = writable('');
export const userStore = writable({});
export const listMethodStore = writable({});
export const listHandlerStore = writable({});
export const listFunctionStoreDev = writable({});
export const listFunctionStoreQA = writable({});
export const listFunctionStorePRD = writable({});
export const listAppVars = writable({});

export const formatJsonForHtmlCode = (/** @type {any} */ json) => {
	return JSON.stringify(json, null, 2).replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
};

export const getListFunction = async (
	/** @type {string} */ token,
	/** @type {string} */ appName
) => {
	// @ts-ignore
	let f = new uFetch();
	f.setBearerAuthorization(token);
	try {
		let fr = await f.get(path_functions, { appName: appName, environment: 'dev' });
		let list = await fr.json();

		if (list && Array.isArray(list)) {
			let data = list.map((fn) => {
				return { id: fn, value: fn };
			});
			listFunctionStoreDev.set(data);
		}
	} catch (error) {
		console.error(error);
	}
	////////////////////////////////////
	try {
		let fr = await f.get(path_functions, { appName: appName, environment: 'qa' });
		let list = await fr.json();

		if (list && Array.isArray(list)) {
			let data = list.map((fn) => {
				return { id: fn, value: fn };
			});
			listFunctionStoreQA.set(data);
		}
	} catch (error) {
		console.error(error);
	}
	////////////////////////////////////
	try {
		let fr = await f.get(path_functions, { appName: appName, environment: 'prd' });
		let list = await fr.json();

		if (list && Array.isArray(list)) {
			let data = list.map((fn) => {
				return { id: fn, value: fn };
			});
			listFunctionStorePRD.set(data);
		}
	} catch (error) {
		console.error(error);
	}
};

export const getListHandler = async (/** @type {string} */ token) => {
	let f = new uFetch();
	f.setBearerAuthorization(token);
	try {
		let fr = await f.get('/api/system/system/handler/0.01/prd');
		let list = await fr.json();

		if (list && Array.isArray(list)) {
			let data = list.map((m) => {
				return {
					id: m.handler,
					value: m.label,
					enabled: m.enabled,
					description: m.description
				};
			});
			listHandlerStore.set(data);
		}
	} catch (error) {
		console.error(error);
	}
};

export const getListMethods = async (/** @type {string} */ token) => {
	let f = new uFetch();
	f.setBearerAuthorization(token);
	try {
		let fr = await f.get('/api/system/system/method/0.01/prd');
		let list = await fr.json();

		if (list && Array.isArray(list)) {
			let data = list.map((m) => {
				return {
					id: m.method,
					value: m.label,
					enabled: m.enabled,
					description: ''
				};
			});
			listMethodStore.set(data);
		}
	} catch (error) {
		console.error(error);
	}
};


export const saveMethod = async (/** @type {string} */ token, /** @type {any} */ method) => {
	let f = new uFetch();
	f.setBearerAuthorization(token);
	try {
		let fr = await f.post('/api/system/system/method/0.01/prd', { method });
		let result = await fr.json();

		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		return { error }
	}
};

export const css_handlers = {
	FETCH: { css: ' is-primary is-outlined ', label: ' Fetch ', icon: ' fa-solid fa-server ' },
	JS: { css: ' is-link is-outlined ', label: ' Javascript ', icon: ' fa-brands fa-square-js ' },
	SOAP: { css: ' is-danger is-outlined ', label: ' SOAP ', icon: ' fa-solid fa-soap ' },
	SQL: { css: ' is-info is-outlined ', label: ' SQL ', icon: 'fa-solid fa-database ' },
	FUNCTION: { css: ' is-dark is-outlined ', label: ' Function ', icon: ' fa-brands fa-node-js ' }
};
