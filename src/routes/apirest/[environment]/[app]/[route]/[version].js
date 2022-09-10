/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getDataFromFunction } from '$lib/apirest/apirest';

// @ts-ignore
export async function GET({ request, fetch, params }) {
	console.log(params, fetch);

	let app = await getDataFromFunction(params, request);

	return {
		status: app.status,
		body: app.data
	};
}
