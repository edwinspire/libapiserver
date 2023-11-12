import express from 'express';
import { User } from '../../db/models.js';
import { login } from '../../db/user.js';
import { tokenVerify, validateToken } from '../utils.js';
import { defaultSystemPath } from '../utils_path.js';

const router = express.Router();

router.post(defaultSystemPath('logout'), validateToken, async (req, res) => {
	try {
		// Check Token

		//   console.log(req.headers);

		const token = req.headers['api-token'];
		const data = tokenVerify(token);

		let user = await User.findOne({
			where: {
				// @ts-ignore
				username: data.data.username,
				token: token
			}
		});

		if (user) {
			//Elimina la variable del Header
			res.set('api-token', undefined);

			await user.update({ token: '', last_login: new Date() });
			await user.save();

			res.status(200).json({
				logout: true
			});
		} else {
			res.status(403).json({ logout: false, error: 'Invalid data' });
		}
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

router.post(defaultSystemPath('login'), async (req, res) => {
	try {
		let user = await login(req.body.username, req.body.password);

		console.log(user);

		res.set('api-token', user.token);

		if (user.login) {
			res.status(200).json(user);
		} else {
			res.status(401).json(user);
		}
	} catch (error) {
		console.log(error);
		// @ts-ignore
		res.status(500).json({ error: error.message });
	}
});

export default router;
