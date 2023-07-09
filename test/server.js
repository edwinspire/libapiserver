import { handler } from '../build/handler.js'
import { ServerAPI } from '../src/lib/api/server.js'


const server = new ServerAPI(true, handler);

server.on("ws_client_connection", (e)=>{
console.log('ws_client_connection', e);
});

server.on("ws_message", (e)=>{
    console.log('ws_message', String(e.message));
    });
    
    server.appendAppFunction('demo', 'fnTest', (
        /** @type {any} */ req,
        /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
      ) => {
        try {
          // @ts-ignore
          res.status(200).json({ function: "Demo personalzada por el usuario" });
        } catch (error) {
          // @ts-ignore
          res.status(500).json({ error: error.message });
        }
      })


server.listen();