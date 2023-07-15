import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import { createServer } from "http";
import { EventEmitter } from "node:events";
import { defaultApps } from "./db/app.js";
import { defaultUser } from "./db/user.js";
import { defaultRoles } from "./db/role.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import dbRestAPI from "./db/sequelize.js";
import { Application, prefixTableName } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { getApiHandler } from "./db/app.js";
import systemRoutes from "./server/router/system.js";
//import uFetch from "@edwinspire/universal-fetch";
import { validateToken, defaultSystemPath } from "../api/server/utils.js";

import * as fnSystem from "./server/functions/system.js";
import * as fnPublic from "./server/functions/public.js";

const {
  PORT,
  EXPRESSJS_SERVER_TIMEOUT,
  EXPOSE_DEV_API,
  EXPOSE_QA_API,
  EXPOSE_PROD_API,
  PATH_API_RESPONSE_TIME,
  PATH_API_HOOKS,
  PATH_WS_HOOKS,
} = process.env;

// constructor(httpServer, root_path, authentication_callback) {

export class ServerAPI extends EventEmitter {
  /**
   * @param {boolean} buildDB
   * @param {any} handlerExternal
   * @param {any} customRouter
   */
  constructor(buildDB, handlerExternal, customRouter) {
    super();

    /**
     * @type {{ path: string; WebSocket: WebSocket.Server<WebSocket.WebSocket>; }[]}
     */
    this._ws_paths = [];
    //this._cacheFn = {};
    this._cacheApi = new Map();
    this._fn = new Map();
    this._path_ws_api_response_time =
      PATH_API_RESPONSE_TIME || "/system/api/endpoint/response/time";
    this._path_api_hooks = PATH_API_HOOKS || "/system/api/hooks";
    this._path_ws_hooks = PATH_WS_HOOKS || "/system/ws/hooks";
    this.buildDB(buildDB);

    //    defaultUser();

    this.app = express();
    this._httpServer = createServer(this.app);

    this._upgrade();

    this.app.use(express.json()); // Agrega esta línea

    this.app.use((req, res, next) => {
      const startTime = new Date().getTime();

      // Emit time
      res.on("finish", () => {
        const endTime = new Date().getTime();
        const duration = endTime - startTime + 5;

        // console.log(`Tiempo de respuesta: ${duration} ms`);

        this.broadcastByPath(this._path_ws_api_response_time, {
          path: req.path,
          time: duration,
          method: req.method,
          timestamp: Date.now(),
        });
      });

      next();
    });

    this.app.use(systemRoutes);

    this.app.get(defaultSystemPath("functions"), validateToken, (req, res) => {
      try {
        console.log("Functions >>>>>>>");
        // @ts-ignore
        this._functions(req, res);
      } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
      }
    });

    if (customRouter) {
      this.app.use(customRouter);
    }

    // Controlar para que este path sea solo accesible de forma local
    this.app.post(this._path_api_hooks, async (req, res) => {
      let clientIP = req.ip;
      if (clientIP === "127.0.0.1" || clientIP === "::1") {
        if (req.body && req.body.model) {
          res.status(200).json(req.body);
          let path = this._path_ws_hooks + "/" + req.body.model;

          console.log("WS HOOKS >>>>> ", path);

          if (req.body.model == prefixTableName("application")) {
            this._cacheApi.clear();
          }

          this.broadcastByPath(path, req.body);
        } else {
          res.status(404).json(req.body);
        }
      } else {
        res.status(403).json({});
      }
    });

    this.app.all(
      "/api/:app/:namespace/:name/:version/:environment",
      async (req, res) => {
        let { app, namespace, name, version, environment } = req.params;

        try {
          let h = await this._getApiHandler(
            app,
            namespace,
            name,
            version,
            environment,
            req.method,
            req.headers["api-token"]
          );

          console.log("HHHHHH >>>> ", h);

          if (h.status == 200) {
            runHandler(req, res, h.params, this._getFunctions(app));
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

    if (handlerExternal) {
      this.app.use(handlerExternal);
    }

    this._addFunctions();

    let rto = 1000 * 60 * 5;
    if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
      rto = Number(EXPRESSJS_SERVER_TIMEOUT);
    }
    console.log("EXPRESSJS_SERVER_TIMEOUT: " + EXPRESSJS_SERVER_TIMEOUT);
    this._httpServer.setTimeout(rto); // Para 5 minutos
  }

  /**
   * @param {string} appname
   * @param {string} functionName
   * @param {any} Function
   */
  appendAppFunction(appname, functionName, Function) {
    if (appname != "system") {
      this._appendAppFunction(appname, functionName, Function);
    } else {
      throw "system not allow";
    }
  }

  /**
   * @param {string} appname
   * @param {string} functionName
   * @param {any} Function
   */
  _appendAppFunction(appname, functionName, Function) {
    if (this._fn.has(appname)) {
      let fnList = this._fn.get(appname);
      fnList[functionName] = Function;
      this._fn.set(appname, fnList);
    } else {
      let f = {};
      // @ts-ignore
      f[functionName] = Function;
      this._fn.set(appname, f);
    }
  }

  /**
   * @param {any} path
   * @param {any} payload
   */
  broadcastByPath(path, payload) {
    let cli = this._ws_paths.find((p) => {
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
    let wscreated = this._ws_paths.find((w) => w.path === url_data.pathname);

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
      this._ws_paths.push({
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

  /**
   * @param {string} app
   * @param {string} namespace
   * @param {string} name
   * @param {string} version
   * @param {string} environment
   * @param {string} method
   * @param {string | string[] | undefined | null} token
   */
  async _getApiHandler(
    app,
    namespace,
    name,
    version,
    environment,
    method,
    token
  ) {
    if (
      (environment == "qa" && EXPOSE_QA_API === "true") ||
      (environment == "dev" && EXPOSE_DEV_API === "true") ||
      (environment == "prd" && EXPOSE_PROD_API === "true")
    ) {
      try {
        const apiPath = `/${app}/${namespace}/${name}/${version}/${environment}/${method}`;
        if (!this._cacheApi.has(apiPath)) {
          
          // Obtener el idapp por el nombre - Debe buscar primero en la cache y luego en la base
          let appData = await Application.findOne({ where: { app: app } });
          console.log(">>>> NO usa cache", apiPath, appData);
          this._cacheApi.set(
            apiPath,
            getApiHandler(
              appData,
              app,
              namespace,
              name,
              version,
              environment,
              method,
              token
            )
          );
        }

        return this._cacheApi.get(apiPath);
      } catch (error) {
        // @ts-ignore
        return { message: error.message, status: 505, params: undefined };
      }
    } else {
      return { message: "Not found", status: 404, params: undefined };
    }
  }

  _upgrade() {
    this._httpServer.on("upgrade", async (request, socket, head) => {
      // @ts-ignore
      let urlData = this._url(request.url);

      //"/api/:app/:namespace/:name/:version/:environment",
      const parts = urlData.pathname ? urlData.pathname.split("/") : [];

      //const api = parts[0];
      const app = parts[2];
      const namespace = parts[3];
      const name = parts[4];
      const version = parts[5];
      const environment = parts[6];

      let token =
        request.headers["api-token"] || urlData.searchParams.get("api-token");

      //console.log(token, parts);

      try {
        let h = { status: 404, message: "?" };
        if (this._path_ws_api_response_time == urlData.pathname) {
          h = { status: 200, message: "System" };
        } else {
          h = await this._getApiHandler(
            app,
            namespace,
            name,
            version,
            environment,
            "WS",
            token
          );
        }

        console.log("H >>>> ", h);

        if (h.status == 200) {
          this._createWebSocket(request, socket, head, urlData);
        } else {
          socket.write(`HTTP/1.1 ${h.status} Not Found\r\n\r\n`);
          socket.destroy();
        }
      } catch (error) {
        socket.write("HTTP/1.1 505 Not Found\r\n\r\n");
        socket.destroy();
      }
    });
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB(buildDB) {
    if (buildDB) {
      dbRestAPI.sync({ alter: false }).then(
        async () => {
          console.log("Crea la base de datos");

          try {
            await defaultRoles();
          } catch (error) {
            console.log(error);
          }

          try {
            await defaultUser();
          } catch (error) {
            console.log(error);
          }

          try {
            await defaultMethods();
          } catch (error) {
            console.log(error);
          }

          try {
            await defaultHandlers();
          } catch (error) {
            console.log(error);
          }

          try {
            await defaultApps();
          } catch (error) {
            console.log(error);
          }
        },
        (/** @type {any} */ e) => {
          console.log("no se pudo crear / modificar la base de datos", e);
        }
      );
    }
  }

  _addFunctions() {
    const entries = Object.entries(fnSystem);
    for (let [fName, fn] of entries) {
      //console.log(prop + ": " + fn);
      this._appendAppFunction("system", fName, fn);
    }

    const entriesP = Object.entries(fnPublic);
    for (let [fName, fn] of entriesP) {
      //console.log(prop + ": " + fn);
      this.appendAppFunction("public", fName, fn);
    }

    this._appendAppFunction("system", "fnGetFunctions", this._functions);

    this._fn.forEach((fx) => {
      console.log(fx);
    });
  }

  /**
   * @param {string} appName
   */
  _getFunctions(appName) {
    let d = this._fn.get(appName);
    let p = this._fn.get("public");
    return { ...d, ...p };
  }

  /**
   * @param {string} appName
   */
  _getNameFunctions(appName) {
    let f = this._getFunctions(appName);
    if (f) {
      return Object.keys(f);
    }
    /*
    let d = this._fn.get(appName);
    let p = this._fn.get("public");

    //    console.log(appName, d, p);

    if (d && p) {
      return Object.keys(p).concat(Object.keys(d)).flat();
    } else if (d) {
      return Object.keys(d);
    } else if (p) {
      return Object.keys(p);
    }
    */

    return [];
  }

  _functions = async (
    /** @type {{ params: any; body: import("sequelize").Optional<any, string>; }} */ req,
    /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
  ) => {
    try {
      // @ts-ignore
      res.status(200).json(this._getNameFunctions(req.query.appName));
    } catch (error) {
      console.log(error);
      // @ts-ignore
      res.status(500).json({ error: error.message });
    }
  };

  listen() {
    /*
    const routes = this.app._router.stack
      .filter((layer) => layer.route)
      .map((layer) => layer.route.path);

    console.log(routes);
*/

    let g = this._getNameFunctions("system");
    console.log(g);

    this._httpServer.listen(PORT, () => {
      console.log("App listening on port " + PORT);
    });
  }
}
