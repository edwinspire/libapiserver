import { handler } from '../build/handler.js'
import { ServerAPI } from './lib/api/server.js'


const server = new ServerAPI(true, handler);
server.listen();