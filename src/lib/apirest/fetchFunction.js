// @ts-ignore
import uFetch from '@edwinspire/universal-fetch';

export const fetchFunction = async (
	/** @type {{ headers: any; body: any; query: any; }} */ req,
	/** @type {{ headers: any; body: any; query: any; method: string | number; url: any; }} */ parameters
) => {
	//console.log(uFetch);

	try {
		let req_headers = { ...req.headers };
		delete req_headers['content-length'];
		delete req_headers['host'];
		delete req_headers['connection'];

		let init = {
			headers: parameters.headers || req_headers, // Usar los headers de la peticion
			body: parameters.body || req.body, // Usar los body de la peticion
			query: parameters.query || req.query // Usar los query de la peticion
		};

		const FData = new uFetch();
		let resp = await FData[parameters.method](parameters.url, init);

		let r = await resp.json();

		return { status: resp.status, data: r };
	} catch (error) {
		// @ts-ignore
		return { status: 500, data: { error: error.message } };
	}
};
