import express from 'express';
import { getAllMethods } from '../../db/method.js';
import { validateToken } from '../utils.js';
import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

router.get(defaultSystemPath('methods'), validateToken, async (req, res) => {
	try {
		const methods = await getAllMethods();

		res.status(200).json(methods);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

export default router;
