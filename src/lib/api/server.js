import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import { createServer } from "http";
import { EventEmitter } from "node:events";
//import { WebSocketServer } from 'ws'
// @ts-ignore
//import { WebSocketExpress } from "@edwinspire/websocket_express/src/index.js";
//import { User, App, Route, Method } from './db/models.js'
import { defaultUser } from "./db/user.js";

import dbRestAPI from "./db/sequelize.js";
import { Application } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { getApiHandler } from "./db/app.js";

import login from "./server/login.js";
import user from "./server/user.js";
import app from "./server/app.js";

import { validateToken, checkToken } from "../api/server/utils.js";

const {
  PORT,
  EXPRESSJS_SERVER_TIMEOUT,
  EXPOSE_DEV_API,
  EXPOSE_QA_API,
  EXPOSE_PROD_API,
} = process.env;

// constructor(httpServer, root_path, authentication_callback) {

export class ServerAPI extends EventEmitter {
  /**
   * @param {boolean} buildDB
   * @param {any} handlerExternal
   */
  constructor(buildDB, handlerExternal) {
    super();

    this.ws_root_path = "/ws";

    /**
     * @type {{ path: string; WebSocket: WebSocket.Server<WebSocket.WebSocket>; }[]}
     */
    this.ws_paths = [];

    this.buildDB(buildDB);

    this.app = express();
    this._httpServer = createServer(this.app);

    this._upgrade();

    this.app.use(express.json()); // Agrega esta línea

    this.app.use((req, res, next) => {
      const startTime = new Date().getTime();

      res.on("finish", () => {
        const endTime = new Date().getTime();
        const duration = endTime - startTime + 5;

        console.log(`Tiempo de respuesta: ${duration} ms`);

        this.broadcastByPath("/ws/api/system/endpoint/response_time", {
          path: req.path,
          time: duration,
          method: req.method,
          timestamp: Date.now(),
        });
      });

      next();
    });

    this.app.use(login);
    this.app.use(user);
    this.app.use(app);

    // Controlar para que este path sea solo accesible de forma local
    this.app.post("/api/hooks", validateToken, async (req, res) => {
      if (req.body && req.body.model) {
        res.status(200).json(req.body);
        let path = "/ws/api/hooks/" + req.body.model;
        this.broadcastByPath(path, req.body);
      } else {
        res.status(404).json(req.body);
      }
    });

    this.app.all(
      "/api/:app/:namespace/:name/:version/:environment",
      async (req, res) => {
        let { app, namespace, name, version, environment } = req.params;

        try {
          let h = await getApiHandler(
            app,
            namespace,
            name,
            version,
            environment,
            req.method,
            req.headers["api-token"]
          );

          if (h.status == 200) {
            runHandler(req, res, h.params);
          } else {
            res.status(h.status).json({
              // @ts-ignore
              error: h.message,
            });
          }
        } catch (error) {
          res.status(505).json({
            // @ts-ignore
            error: error.message,
          });
        }
      }
    );

    this.app.use(handlerExternal);

    let rto = 1000 * 60 * 5;
    if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
      rto = Number(EXPRESSJS_SERVER_TIMEOUT);
    }
    console.log("EXPRESSJS_SERVER_TIMEOUT: " + EXPRESSJS_SERVER_TIMEOUT);
    this._httpServer.setTimeout(rto); // Para 5 minutos
  }

  /**
   * @param {any} path
   * @param {any} payload
   */
  broadcastByPath(path, payload) {
    let cli = this.ws_paths.find((p) => {
      return p.path == path;
    });

    if (cli && cli.WebSocket) {
      cli.WebSocket.clients.forEach(function each(
        /** @type {{ readyState: number; send: (arg0: string) => void; }} */ client
      ) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }
  }

  /**
   * @param {string} url
   */
  _url(url) {
    return new URL("http://localhost" + url);
  }

  // Crea el websocket en el servidor
  /**
   * @param {any} request
   * @param {any} socket
   * @param {any} head
   * @param {URL} url_data
   */
  _createWebSocket(request, socket, head, url_data) {
    // @ts-ignore
    let wscreated = this.ws_paths.find((w) => w.path === url_data.pathname);

    //      console.log(url_data.pathname, wscreated);

    if (wscreated) {
      this._wshandleUpgrade(
        wscreated.WebSocket,
        request,
        socket,
        head,
        url_data
      );
    } else {
      let WSServer = new WebSocketServer({ noServer: true });
      WSServer.on("connection", (socketc) => {
        console.log("Client connected to ws " + url_data.pathname);
      });

      this._wshandleUpgrade(WSServer, request, socket, head, url_data);
      // Agrega el path a la lista
      this.ws_paths.push({
        path: url_data.pathname,
        WebSocket: WSServer,
      });
    }
  }

  /**
   * @param {WebSocket.Server<WebSocket.WebSocket>} wsServer
   * @param {any} request
   * @param {any} socket
   * @param {any} head
   * @param {URL} url_data
   */
  _wshandleUpgrade(wsServer, request, socket, head, url_data) {
    wsServer.handleUpgrade(request, socket, head, (socketc) => {
      socketc.on("message", (message) => {
        this.emit("ws_message", {
          socket: socketc,
          message: message,
          url: url_data,
        });
      });

      this.emit("ws_client_connection", { socket: socketc, url: url_data });
      //wsServer.emit("ws_connection", socketc, request);
    });
  }

  _upgrade() {
    this._httpServer.on("upgrade", (request, socket, head) => {
      // @ts-ignore
      let urlData = this._url(request.url);

      if (urlData.pathname.startsWith(this.ws_root_path)) {
        const token = request.headers["api-token"];

        if (checkToken(token)) {
          /*
          if (this.authentication(request, socket, head, urlData)) {
            this._createWebSocket(request, socket, head, urlData);
          } else {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
          }
          */
        } else {
          this._createWebSocket(request, socket, head, urlData);
        }
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.destroy();
      }
    });
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB(buildDB) {
    if (buildDB) {
      dbRestAPI.sync({ alter: true }).then(
        async () => {
          console.log("Crea la base de datos");
          // await defaultUser();
          // await defaultExamples();
        },
        (/** @type {any} */ e) => {
          console.log("no se pudo crear / modificar la base de datos", e);
        }
      );
    }
  }

  listen() {
    this._httpServer.listen(PORT, () => {
      console.log("App listening on port " + PORT);
    });
  }
}
