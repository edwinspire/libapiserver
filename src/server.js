import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
//import { WebSocketServer } from 'ws'
import { WebSocketExpress } from '@edwinspire/websocket_express/src/index.js';
import { handler } from '../build/handler.js';
import { User, App, Route, Method } from './lib/apirest/db/models.js';
import { defaultValues } from './lib/apirest/db/user.js';
import dbRestAPI from './lib/apirest/db/sequelize.js';

const { PORT, EXPRESSJS_SERVER_TIMEOUT, BUILD_DB_ON_START } = process.env;

if (BUILD_DB_ON_START == 'true') {
	dbRestAPI.sync({ alter: true }).then(
		async() => {
			console.log('Crea la base de datos');
			await defaultValues();
		},
		(e) => {
			console.log('no se pudo crear / modificar la base de datos', e);
		}
	);
}

const app = express();
const httpServer = createServer(app);

const webSocketServer = new WebSocketExpress(httpServer, undefined, undefined);

webSocketServer.on('client_connection', (/** @type {any} */ data) => {
	console.log('client_connection', data);
});

app.use(handler);

let rto = 1000 * 60 * 5;
if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
	rto = Number(EXPRESSJS_SERVER_TIMEOUT);
}
console.log('EXPRESSJS_SERVER_TIMEOUT: ' + EXPRESSJS_SERVER_TIMEOUT);
httpServer.setTimeout(rto); // Para 5 minutos

httpServer.listen(PORT, () => {
	console.log('App listening on port ' + PORT);
});
