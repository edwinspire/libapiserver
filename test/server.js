import { handler } from '../build/handler.js';
import { ServerAPI } from '../src/lib/api/server.js';
import { v4 as uuidv4 } from 'uuid';


try {
	const server = new ServerAPI(true, handler);


	server.on('websocket_message', (e) => {
		console.log('>>>> websocket_message >>', e.data);
		let data = JSON.parse(e.data);

		if (data.req == 1000) {
			// Registra dispositivo
			if (data.data == "00a0aa00-aa00-0000-0000-000000000000") {
				// Si tiene el valor por default se le envía uno nuevo
				console.log("Default id -  se devuelve un nuevo id");

				e.ws.send(JSON.stringify({ cmd: 1000, deviceId: uuidv4() }));

			} else {
				// Tiene ya un id asignado, se registra el dispositivo
				console.log("Registrar dispositivo");
			}

		} else {
			console.log('No es mil', data.req);
		}


	});

	/*
	server.on("ws_client_connection", (e)=>{
	console.log('ws_client_connection', e);
	});
	*/

	/*
	server.on("ws_message", (e)=>{
		console.log('ws_message', String(e.message));
		});
		*/

	server.appendAppFunction(
		'demo',
		'fnTest',
		(
		/** @type {any} */ req,
		/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res, data
		) => {



			try {
				// @ts-ignore
				res.status(200).json({ function: 'Demo personalizada por el usuario', data });
			} catch (error) {
				// @ts-ignore
				res.status(500).json({ error: error.message });
			}
		}
	);

	server.listen();

} catch (error) {
	console.trace(error);
}