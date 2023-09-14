import { User } from './models.js';
import { getRoleById } from './role.js';
import { EncryptPwd, GenToken, customError } from '../server/utils.js';

export const upsertUser = async (
	/** @type {import("sequelize").Optional<any, string>} */ userData
) => {
	try {
		const [user, created] = await User.upsert(userData);
		return { user, created };
	} catch (error) {
		console.error('Error performing UPSERT on user:', error);
		throw error;
	}
};

// READ
export const getUserById = async (
	/** @type {import("sequelize").Identifier | undefined} */ userId
) => {
	try {
		const user = await User.findByPk(userId);
		return user;
	} catch (error) {
		console.error('Error retrieving user:', error);
		throw error;
	}
};

export const getAllUsers = async () => {
	try {
		const users = await User.findAll();
		return users;
	} catch (error) {
		console.error('Error retrieving users:', error);
		throw error;
	}
};

// DELETE
export const deleteUser = async (
	/** @type {import("sequelize").Identifier | undefined} */ userId
) => {
	try {
		const user = await User.findByPk(userId);
		if (user) {
			await user.destroy();
			return true; // Deletion successful
		}
		return false; // User not found
	} catch (error) {
		console.error('Error deleting user:', error);
		throw error;
	}
};

/**
 * @param {string} username
 * @param {string} password
 */
export const getUserByCredentials = async (username, password) => {
	let dataUser = await User.findOne({
		where: { username: username, password: password },
		attributes: ['iduser', 'enabled', 'username', 'first_name', 'last_name', 'email', 'idrole']
	});

	if (dataUser) {
		dataUser.dataValues.role = await getRoleById(dataUser?.dataValues.idrole, true);

		/*
    if (dataUser.dataValues.role) {
      if (!dataUser.dataValues.role.dataValues.enabled) {
        dataUser.dataValues.role = {};
      }
    }
    */
	}

	return dataUser;
};

// Usage examples
export const defaultUser = async () => {
	try {
		console.log(' defaultUser >>>>>> ');

		// Verificar si el usuario "admin" ya existe
		const existingUser = await User.findOne({
			where: { username: 'superuser' }
		});
		if (existingUser) {
			// El usuario "admin" ya existe, no se realiza la inserción
			return;
		}

		// El usuario "admin" no existe, se realiza la inserción
		await User.create({
			username: 'superuser',
			password: EncryptPwd('superuser'),
			first_name: 'super',
			last_name: 'user',
			email: 'superuser@example.com',
			idrole: 1
		});
	} catch (error) {
		console.error('Example error:', error);
		return;
	}
};

/**
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
	try {
		let user = await getUserByCredentials(username || '', EncryptPwd(password || ''));

		if (user) {
			let u = { ...user.dataValues };

			// Envía el Token en el Header
			let token = GenToken({
				username: u.username,
				role: u.idrole,
				date: new Date() // Para que se genere siempre un token diferente
			});

			await user.update({ token: token, last_login: new Date() });
			await user.save();

			return {
				login: true,
				username: u.username,
				first_name: u.first_name,
				last_name: u.last_name,
				role: u.role.dataValues,
				token: token
			};
		} else {
			return customError(2);
		}
	} catch (error) {
		return error;
	}
}
