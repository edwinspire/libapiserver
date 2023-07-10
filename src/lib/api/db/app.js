import { Application } from "./models.js";
import { checkToken } from "../server/utils.js";
import { createFunction } from "../handler/jsFunction.js";

// READ
export const getAppById = async (
  /** @type {import("sequelize").Identifier} */ idapp
) => {
  try {
    const app = await Application.findByPk(idapp, {
      attributes: ["idapp", "app", "rowkey", "data"],
    });
    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};

export const getAllApps = async () => {
  try {
    //const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    const apps = await Application.findAll();
    return apps;
  } catch (error) {
    console.error("Error retrieving apps:", error);
    throw error;
  }
};

// UPSERT
export const upsertApp = async (
  /** @type {import("sequelize").Optional<any, string>} */ appData,
  /** @type {undefined} */ transaction
) => {
  try {
    let [app, create] = await Application.upsert(appData, transaction);

    //console.log('XXXX>>> [app, create] ', app, create);

    let data = app.dataValues;

    return data;
  } catch (error) {
    console.error("Error performing UPSERT on app:", error);
    throw error;
  }
};

/**
 * @param {Model<any, any>|null} appData
 * @param {string} app
 * @param {string} namespace
 * @param {string} name
 * @param {string} version
 * @param {string} environment
 * @param {string} method
 * @param {string | undefined | string[] | null} token
 */
export function getApiHandler(
  appData,
  app,
  namespace,
  name,
  version,
  environment,
  method,
  token
) {
  let returnHandler = {};
  try {
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
              (/** @type {{ name: string; }} */ element) => element.name == name
            );

            if (n) {
              let ver = Number(version.replace(/[^0-9.]/g, ""));

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
                    //   console.log('< v[environment] >', method, v[environment]);

                    // Verificar el método
                    if (v[environment][method]) {
                      //   console.log('< v[environment][method] >', v[environment][method]);

                      if (v[environment][method]) {
                        // Verificar si es publico o privado
                        if (v[environment][method].enabled) {
                          //  && (v[environment][req.method].enabled   && checkToken(token))

                          if (
                            v[environment][method].public ||
                            (!v[environment][method].public &&
                              checkToken(token))
                          ) {
                            //runHandler(req, res, v[environment][method]);
                            returnHandler.params = v[environment][method];
                            /*
                            console.log(
                              "returnHandler.params > ",
                              returnHandler.params
                            );
                            */
                            if (returnHandler.params.handler == "JS") {
                              returnHandler.params.jsFn = createFunction(
                                returnHandler.params.code
                              );
                            }
                            returnHandler.message = "";
                            returnHandler.status = 200;
                          } else {
                            returnHandler.message = `Valid Token required`;
                            returnHandler.status = 403;
                          }
                        } else {
                          returnHandler.message = `Method ${method} Unabled`;
                          returnHandler.status = 404;
                        }
                      } else {
                        returnHandler.message = `Method ${method} on Environment ${environment}, unabled`;
                        returnHandler.status = 404;
                      }
                    } else {
                      returnHandler.message = `Method ${method} not exists on Environment ${environment}`;
                      returnHandler.status = 404;
                    }
                  } else {
                    returnHandler.message = `Environment ${environment} not exists on ${ver}`;
                    returnHandler.status = 404;
                  }
                } else {
                  returnHandler.message = `Version ${ver} not exists on ${name}`;
                  returnHandler.status = 404;
                }
              } else {
                returnHandler.message = `Not exists versions to name ${name}`;
                returnHandler.status = 404;
              }
            } else {
              returnHandler.message = `Name ${name} not found`;
              returnHandler.status = 404;
            }
          } else {
            returnHandler.message = `Names not exists in name ${name}`;
            returnHandler.status = 404;
          }
        } else {
          returnHandler.message = `Namespace ${namespace} not found`;
          returnHandler.status = 404;
        }
      } else {
        returnHandler.message = `Namespace ${namespace} not found`;
        returnHandler.status = 404;
      }
    } else {
      returnHandler.message = `App ${app} not found`;
      returnHandler.status = 404;
    }
  } catch (error) {
    // @ts-ignore
    returnHandler.message = error.message;
    returnHandler.status = 505;
  }

  return returnHandler;
}
