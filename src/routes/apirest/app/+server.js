import { json } from '@sveltejs/kit'
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { saveApp, getFullApp } from '$lib/api/db/app.js'

export async function GET({ request, url }) {
  let data = await getFullApp(Number(url.searchParams.get('idapp')))

  return json(data, { status: 200 })
}

export async function POST({ request, params }) {
  //console.log(params, request);
  let dataApp = await request.json()
  //console.log(dataApp)

  let returnData = await saveApp(dataApp)
  //console.log(returnData)

  return json(returnData, { status: 200 })
}
