import { handler } from '../build/handler.js'
import { ServerAPI } from '../src/lib/api/server.js'


const server = new ServerAPI(true, handler);
server.listen();