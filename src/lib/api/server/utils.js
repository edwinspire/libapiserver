const { createHmac } = await import('node:crypto');

import { Buffer } from 'node:buffer';
import jwt from 'jsonwebtoken';


const { JWT_KEY } = process.env;

const errors = {
	1: { code: 1, message: 'You must enter the same password twice' },
	2: { code: 2, message: 'Invalid credentials' }
};


/**
 * @param {any} token
 */
export function checkToken(token) {
	try {
		// Verificar y decodificar el token
		const decodedToken = tokenVerify(token);
		// @ts-ignore
		return decodedToken;
	} catch (error) {
		return false;
	}
}

// Middleware para validar el token
/**
 * @param {any} req
 * @param { any } res
 * @param {() => void} next
 */
export function validateToken(req, res, next) {
	// Obtener el token del encabezado de autorización
	// @ts-ignore
	//const token = req.headers['api-token'];
	let dataAuth = getUserPasswordTokenFromRequest(req);

	// Verificar si se proporcionó un token
	if (!dataAuth.token) {
		return res.status(401).json({ error: 'Token not found' });
	}

	let data = checkToken(dataAuth.token);

	if (data) {
		next();
	} else {
		return res.status(401).json({ error: 'Token invalid' });
	}
}

/**
 * @param {number} code
 * @param {string | any | undefined} [message]
 */
export function customError(code, message) {
	// @ts-ignore
	if (errors[code]) {
		// @ts-ignore
		let e = { ...errors[code] };
		e.message = message && message.length > 0 ? message : e.message;
		return e;
	} else {
		return { errors: code, message: message };
	}
}

/**
 * @param {import("crypto").BinaryLike} pwd
 */
export function EncryptPwd(pwd) {
	return createHmac('sha256', JWT_KEY || '9999999999')
		.update(pwd)
		.digest('hex');
}

/**
 * @param {any} data
 */
export function GenToken(data) {
	console.log('GenToken > ', data);
	// Genera un Token
	return jwt.sign(
		{ data: data, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
		JWT_KEY || '9999999999'
	);
}

/**
 * @param {any} token
 */
export function tokenVerify(token) {
	return jwt.verify(token, JWT_KEY || '9999999999');
}

/**
 * @param {any} req
 */
export function getUserPasswordTokenFromRequest(req) {
	const authHeader = req.headers.authorization;

	let username,
		token,
		password;

	if (authHeader && authHeader.startsWith('Basic')) {
		const encodedCredentials = authHeader.split(' ')[1];
		const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
		[username, password] = decodedCredentials.split(':');
	}

	if (authHeader && authHeader.startsWith('Bearer')) {
		token = authHeader.split(' ')[1];
	}

	return { username: username, password: password, token: token };
}


/**
 * @param {any} socket
 */
export function websocketUnauthorized(socket) {
	// Si el cliente no está autenticado, responder con un error 401 Unauthorized
	socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
	socket.destroy();
}


export function createAPIKey() {
	const caracteres =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@-|#/=¿.!:*$&';
	let cadena = '';
	while (cadena.length < 50) {
		const caracterAleatorio =
			caracteres[Math.floor(Math.random() * caracteres.length)];
		if (cadena.indexOf(caracterAleatorio) === -1) {
			cadena += caracterAleatorio;
		}
	}
	return cadena;
}

/**
 * @param {string} apikey
 * @param {string} apikeyData
 */
export function checkAPIKey(apikey, apikeyData) {
	console.log('checkAPIKey: ', apikey, apikeyData);
	return true;
}