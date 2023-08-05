const { createHmac } = await import('node:crypto');
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'node:buffer';
import jwt from 'jsonwebtoken';

const { JWT_KEY, EXPOSE_DEV_API, EXPOSE_QA_API, EXPOSE_PROD_API } = process.env;

const errors = {
	1: { code: 1, message: 'You must enter the same password twice' },
	2: { code: 2, message: 'Invalid credentials' }
};

export const defaultSystemPath = (/** @type {string} */ name) => {
	return '/system/main/' + name;
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
	const token = req.headers['api-token'];

	// Verificar si se proporcionó un token
	if (!token) {
		return res.status(401).json({ error: 'Token not found' });
	}

	let data = checkToken(token);

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
	let token = req.headers['api-token'];
	if (!authHeader) {
		return { username: '', password: '', token: token };
	}

	const encodedCredentials = authHeader.split(' ')[1];
	const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
	const [username, password] = decodedCredentials.split(':');

	return { username: username, password: password, token: token };
}

/**
 * @param {import("ws").Server<typeof import("ws"), typeof import("http").IncomingMessage>} wsServer
 * @param {import("http").IncomingMessage} request
 * @param {import("stream").Duplex} socket
 * @param {Buffer} head
 * @param {any} _getApiHandler
 */
export async function HTTPOnUpgrade(wsServer, _getApiHandler, request, socket, head) {
	console.log('>-------- HTTPOnUpgrade --------------> ', request.headers, socket);

	if (request.headers['sec-websocket-protocol'] == 'mqtt') {
		// Si el cliente está autenticado, permitir la conexión WebSocket
		// @ts-ignore
		wsServer.handleUpgrade(request, socket, head, (ws) => {
			//req.hola = "Mundo";
			// @ts-ignore
			wsServer.emit('connection', ws, request); // Emitir el evento 'connection' para manejar la conexión WebSocket
		});
	} else {
		let reqUrl = new URL(`http://localhost${request.url}`);

		let parts = reqUrl.pathname.split('/');

		//console.log(' XXX> request', request);

		try {
			// app, namespace, name, version, environment, method
			// @ts-ignore
			let h = await _getApiHandler(parts[2], parts[3], parts[4], parts[5], parts[6], 'WS');
			//console.log('<>>>>> h >>>>', h);

			if (h.status == 200) {
				// TODO implementar autenticación
				//						let dataAuth = getUserPasswordTokenFromRequest(request);
				//						let auth = await h.authentication(dataAuth.token, dataAuth.username, dataAuth.password);
				let auth = true;
				if (!auth) {
					// Si el cliente no está autenticado, responder con un error 401 Unauthorized
					socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
					socket.destroy();
					return;
				}
			} else {
				socket.write(`HTTP/1.1 ${h.status} Invalid\r\n\r\n`);
				socket.destroy();
				return;
			}

			// Si el cliente está autenticado, permitir la conexión WebSocket
			// @ts-ignore
			wsServer.handleUpgrade(request, socket, head, (ws) => {
				// @ts-ignore
				ws.APIServer = { uuid: uuidv4(), path: reqUrl.pathname, broadcast: h.params.broadcast };

				//						console.log('<ws >>> ', ws, h);
				//req.hola = "Mundo";
				// @ts-ignore
				wsServer.emit('connection', ws, request); // Emitir el evento 'connection' para manejar la conexión WebSocket
			});
		} catch (error) {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();
			console.log(error);
			return;
		}
	}
}

/**
 * @param {any} socket
 */
export function websocketUnauthorized(socket) {
	// Si el cliente no está autenticado, responder con un error 401 Unauthorized
	socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
	socket.destroy();
}
