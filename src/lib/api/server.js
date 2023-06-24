import "dotenv/config";
import express from "express";
import { createServer } from "http";
//import { WebSocketServer } from 'ws'
// @ts-ignore
import { WebSocketExpress } from "@edwinspire/websocket_express/src/index.js";
//import { User, App, Route, Method } from './db/models.js'
import { defaultUser } from "./db/user.js";

import dbRestAPI from "./db/sequelize.js";
import { Application } from "./db/models.js";
import { runHandler } from "./handler/handler.js";

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

    this.app.use((req, res, next) => {
      const startTime = new Date().getTime();

      res.on("finish", () => {
        const endTime = new Date().getTime();
        const duration = endTime - startTime + 5;

        console.log(`Tiempo de respuesta: ${duration} ms`);

        webSocketServer.broadcastByPath("/ws/api/system/endpoint/response_time", {
          path: req.path,
          time: duration,
          method: req.method,
          timestamp: Date.now()
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
        webSocketServer.broadcastByPath(path, req.body);
      } else {
        res.status(404).json(req.body);
      }
    });

    this.app.all(
      "/api/:app/:namespace/:name/:version/:environment",
      async (req, res) => {
        let { app, namespace, name, version, environment } = req.params;

        if (
          (environment == "qa" && EXPOSE_QA_API === "true") ||
          (environment == "dev" && EXPOSE_DEV_API === "true") ||
          (environment == "prd" && EXPOSE_PROD_API === "true")
        ) {
          try {
            let ver = Number(version.replace(/[^0-9.]/g, ""));

            // Obtener el idapp por el nombre
            let appData = await Application.findOne({ where: { app: app } });

            //console.log(appData);

            // @ts-ignore
            if (appData && appData.data && appData.data.enabled) {
              // Verificar que exista namespaces
              if (
                // @ts-ignore
                appData.data.namespaces &&
                // @ts-ignore
                Array.isArray(appData.data.namespaces)
              ) {
                // Busca el namespace
                // @ts-ignore
                let ns = appData.data.namespaces.find(
                  (/** @type {{ namespace: string; }} */ element) =>
                    element.namespace == namespace
                );

                // Verifcar si fue encontrado el namespace
                if (ns) {
                  // Buscar el name
                  if (ns.names && Array.isArray(ns.names)) {
                    // Buscar el name
                    let n = ns.names.find(
                      (/** @type {{ name: string; }} */ element) =>
                        element.name == name
                    );

                    if (n) {
                      // Verificamos que exista version dentro de name
                      if (n.versions && Array.isArray(n.versions)) {
                        // Buscamos la version
                        let v = n.versions.find(
                          (/** @type {{ version: number; }} */ element) =>
                            element.version == ver
                        );

                        if (v) {
                          // Verificar que exista el ambiente
                          if (v[environment]) {
                            // Verificar el método
                            if (v[environment][req.method]) {
                              console.log(v[environment][req.method]);

                              if (v[environment][req.method]) {
                                const token = req.headers["api-token"];
                                // Verificar si es publico o privado
                                if (v[environment][req.method].enabled) {
                                  //  && (v[environment][req.method].enabled   && checkToken(token))

                                  if (
                                    v[environment][req.method].public ||
                                    (!v[environment][req.method].public &&
                                      checkToken(token))
                                  ) {
                                    runHandler(
                                      req,
                                      res,
                                      v[environment][req.method]
                                    );
                                  } else {
                                    res.status(403).json({
                                      error: `Valid Token required`,
                                    });
                                  }
                                } else {
                                  res.status(404).json({
                                    error: `Method ${req.method} Unabled`,
                                  });
                                }
                              } else {
                                res.status(404).json({
                                  error: `Method ${req.method} on Environment ${environment}, unabled`,
                                });
                              }
                            } else {
                              res.status(404).json({
                                error: `Method ${req.method} not exists on Environment ${environment}`,
                              });
                            }
                          } else {
                            res.status(404).json({
                              error: `Environment ${environment} not exists on ${ver}`,
                            });
                          }
                        } else {
                          res.status(404).json({
                            error: `Version ${ver} not exists on ${name}`,
                          });
                        }
                      } else {
                        res.status(404).json({
                          error: `Not exists versions to name ${name}`,
                        });
                      }
                    } else {
                      res.status(404).json({
                        error: `Name ${name} not found`,
                      });
                    }
                  } else {
                    res.status(404).json({
                      error: `Names not exists in name ${name}`,
                    });
                  }
                } else {
                  res.status(404).json({
                    error: `Namespace ${namespace} not found`,
                  });
                }
              } else {
                res.status(404).json({
                  error: `Namespace ${namespace} not found`,
                });
              }
            } else {
              res.status(404).json({
                error: `App ${app} not found`,
              });
            }
          } catch (error) {
            // @ts-ignore
            res.status(500).json({ error: error.message });
          }
        } else {
          res.status(404).json({});
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
