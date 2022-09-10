// @ts-nocheck
import WebSocket, { WebSocketServer } from "ws";
import EventEmitter from "events";

export class WebSocketPlugin extends EventEmitter {
    constructor(http_server) {
        super();
        this.WebSocket = new WebSocketServer({ noServer: true });
        this.WebSocket.on("connection", (socket) => {
            this.emit("connect", {});
            socket.on("message", (message) => {
                this.emit("message", message);
                console.log(message);
            });
        });

        http_server.on("upgrade", (request, socket, head) => {
          
            if (request.url === "/websocket") {
                this.WebSocket.handleUpgrade(request, socket, head, (socket) => {
                    this.WebSocket.emit("connection", socket, request);
                });
            } else {
                socket.destroy();
            }
        });
    }

    convert_message(topic, message) {
        return JSON.stringify({ topic: topic, message: message });
    }

    send(client, topic, message) {
        client.send(this.convert_message(topic, message));
    }

    broadcast(topic, message) {
        this.WebSocket.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                this.send(client, topic, message);
            }
        });
    }
}