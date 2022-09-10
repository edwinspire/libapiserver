import 'dotenv/config';
import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { handler } from '../build/handler.js'

const { PORT, EXPRESSJS_SERVER_TIMEOUT } =
    process.env;

const app = express()
const httpServer = createServer(app)

let WebSocket = new WebSocketServer({ noServer: true });
WebSocket.on("connection", (socket) => {

    socket.on("message", (message) => {

        console.log(message);
    });
});

httpServer.on("upgrade", (request, socket, head) => {

    if (request.url === "/websocket") {
        WebSocket.handleUpgrade(request, socket, head, (socket) => {
            console.log("conecatado ws");
            WebSocket.emit("connection", socket, request);
        });
    } else {
        socket.destroy();
    }
});

app.use(handler)

let rto = 1000 * 60 * 5;
if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
    rto = Number(EXPRESSJS_SERVER_TIMEOUT);
}
console.log("EXPRESSJS_SERVER_TIMEOUT: " + EXPRESSJS_SERVER_TIMEOUT);
httpServer.setTimeout(rto); // Para 5 minutos

httpServer.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});