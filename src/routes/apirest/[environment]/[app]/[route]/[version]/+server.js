// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
//import { getDataFromFunction } from '$lib/apirest/apirest';
import { json } from '@sveltejs/kit'
export async function GET({ request,  params }) {
	console.log(params);

//	let app = await getDataFromFunction(params, request);

	
return json({}, { status: 200 })
}

export async function POST({ request, fetch, params }) {
	//console.log(params, fetch);
console.log('Version');

	//let app = await getDataFromFunction(params, request);

	return {
		status: 200,
		body: {}
	};
}
