export const jsFunction = (/** @type {any} */ req, /** @type {string} */ code) => {
	try {
		let codefunction = `
let RETURN_DATA = {};
${code}
return RETURN_DATA;
`;
		let f = new Function('req', codefunction);

		return { status: 200, data: f(req) };
	} catch (error) {
		// @ts-ignore
		return { status: 500, data: { error: error.message } };
	}

};
