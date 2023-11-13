import express from 'express';
import { getAllApps, getAppById, upsertApp } from '../../db/app.js';
import { upsertEndpoint } from '../../db/endpoint.js';
import { validateToken } from '../utils.js';
import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

router.get(defaultSystemPath('apps'), validateToken, async (req, res) => {
	try {
		const apps = await getAllApps();

		res.status(200).json(apps);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

router.get(defaultSystemPath('app/:idapp'), validateToken, async (req, res) => {
	try {
		let raw = !req.query.raw || req.query.raw == 'false' ? false : true;

		console.log(req.params, req.query, raw);

		// @ts-ignore
		let data = await getAppById(req.params.idapp, raw);

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

router.post(defaultSystemPath('app/:idapp'), validateToken, async (req, res) => {
	try {
		console.log(req.params, req.body);

		// Agrega primero los datos de la app
		// @ts-ignore
		let data = await upsertApp(req.body);

		if (data.idapp && Number(data.idapp) > 0) {
			// Inserta / Actualiza los endpoints
			let promises_upsert = req.body.apiserver_endpoints.map(
				(/** @type {import("sequelize").Optional<any, string>} */ ep) => {
					ep.idapp = data.idapp;
					return upsertEndpoint(ep);
				}
			);

			let result_endpoints = await Promise.allSettled(promises_upsert);
			console.log('result_endpoints ==>>>', result_endpoints);
			//TODO: mejorar el retorno del upsert de lo endpoints
		}

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

export default router;
