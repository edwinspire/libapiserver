import { handler } from '../build/handler.js'
import { ServerAPI } from '../src/lib/api/server.js'


const server = new ServerAPI(true, handler);

server.on("ws_client_connection", (e)=>{
console.log('ws_client_connection', e);
});

server.on("ws_message", (e)=>{
    console.log('ws_message', String(e.message));
    });
    
    


server.listen();