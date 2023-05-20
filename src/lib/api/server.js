import "dotenv/config";
import express, { response } from "express";
import { createServer } from "http";
//import { WebSocketServer } from 'ws'
// @ts-ignore
import { WebSocketExpress } from "@edwinspire/websocket_express/src/index.js";
//import { User, App, Route, Method } from './db/models.js'
import { defaultUser } from "./db/user.js";

import dbRestAPI from "./db/sequelize.js";
import { App } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { getFullApp, defaultExamples, saveApp } from "./db/app.js";
import login from "./server/login.js";
import user from "./server/user.js";

const { PORT, EXPRESSJS_SERVER_TIMEOUT, BUILD_DB_ON_START } = process.env;

export class ServerAPI {
  /**
   * @param {boolean} buildDB
   * @param {any} handlerExternal
   */
  constructor(buildDB, handlerExternal) {
    this.buildDB(buildDB);

    this.app = express();
    this._httpServer = createServer(this.app);

    const webSocketServer = new WebSocketExpress(
      this._httpServer,
      undefined,
      undefined
    );

    webSocketServer.on("client_connection", (/** @type {any} */ data) => {
      console.log("client_connection", data);
    });

    this.app.use(express.json()); // Agrega esta línea

    this.app.use(login);
    this.app.use(user);

    this.app.get("/api/full/:idapp", async (req, res) => {
      console.log(req.params);
      try {
        let data = await getFullApp(req.params.idapp);

        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({});
        }
      } catch (error) {
        res.status(500).json({ error });
      }
    });

    this.app.post("/api/full", async (req, res) => {
      try {
        let data = await saveApp(req.body);

        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({});
        }
      } catch (error) {
        res.status(500).json({ error });
      }
    });

    this.app.all("/api/:app/:route/:environment/:version", async (req, res) => {
      // http://localhost:3000/api/test001/javascript/1
      let { app, route, version, environment } = req.params;
      try {
        let v = Number(version.replace(/[^0-9.]/g, ""));
        //console.log(v)
        if (v > 0) {
          // Obtener el idapp por el nombre
          let appData = await App.findAll({ where: { app: app } });

          if (appData && Array.isArray(appData) && appData.length > 0) {
            // Obtener todos los datos de la app por el idapp
            // @ts-ignore
            let idapp = appData[0].idapp;
            let appFull = await getFullApp(idapp);

            //console.log('appFull >>>> ', appFull);

            if (appFull && appFull.enabled) {
              let routes = appFull.route.filter(
                (/** @type {{ route: string; enabled: boolean; }} */ r) => {
                  return r.route == route && r.enabled == true;
                }
              );

              //console.log('routes >>>> ', routes);

              if (routes && Array.isArray(routes) && routes.length > 0) {
                // Verificamos si el método y ambiente existen y están habilitados

                if (routes.length == 1) {
                  let methods = routes[0].method.filter(
                    (
                      /** @type {{ enabled: boolean; method: string; env: string; version: number; handler: string}} */ m
                    ) => {
                      //  console.log(m);
                      return (
                        m.enabled == true &&
                        m.method == req.method &&
                        m.env == environment &&
                        m.version == v
                      );
                    }
                  );

                  // console.log(methods);

                  if (methods && Array.isArray(methods) && methods.length > 0) {
                    let method = methods[0];

                    runHandler(req, res, method);
                  } else {
                    res.status(404).json({
                      error: `Route ${route} has no data for the environment ${environment}`,
                    });
                  }
                } else {
                  res.status(500).json({
                    error: "Hay más de dos rutas con el mismo nombre",
                  });
                }
              } else {
                res
                  .status(404)
                  .json({ error: `Route ${route} not found`, data: routes });
              }
            } else {
              res.status(404).json({ error: `App ${app} not found` });
            }
          } else {
            res.status(404).json({ error: `App ${app} not found` });
          }
        } else {
          res.status(400).json({ error: "Invalid API version" });
        }
      } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
      }
    });

    this.app.use(handlerExternal);

    let rto = 1000 * 60 * 5;
    if (EXPRESSJS_SERVER_TIMEOUT && Number(EXPRESSJS_SERVER_TIMEOUT) > 1000) {
      rto = Number(EXPRESSJS_SERVER_TIMEOUT);
    }
    console.log("EXPRESSJS_SERVER_TIMEOUT: " + EXPRESSJS_SERVER_TIMEOUT);
    this._httpServer.setTimeout(rto); // Para 5 minutos
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB(buildDB) {
    if (buildDB) {
      dbRestAPI.sync({ alter: true }).then(
        async () => {
          console.log("Crea la base de datos");
          await defaultUser();
          await defaultExamples();
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
