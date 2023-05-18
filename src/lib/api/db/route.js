//import { Transaction } from "sequelize";
import { Route } from "./models.js";

const getRouteByidAppRoute = async (
  /** @type {number} */ idapp,
  /** @type {string} */ name_route
) => {
  let d1 = await Route.findAll({ where: { idapp: idapp, route: name_route } });
  let data;
  if (d1 && Array.isArray(d1) && d1.length > 0) {
    data = d1[0].dataValues;
  }
  return data;
};

// UPSERT
export const upsertRoute = async (
  /** @type {{ path: string; method: string; handler: string; }} */ idapp,
  /** @type {import("sequelize").Optional<any, string> | undefined} */ routeData,
  /** @type {import("sequelize").UpsertOptions<any> | undefined} */ transaction
) => {
  try {
    let data;
    // @ts-ignore
    routeData.idapp = routeData.idapp || idapp;

    // @ts-ignore
    let [app, create] = await Route.upsert(routeData, transaction);

    // @ts-ignore
    if (app && app.dataValues) {
      data = app.dataValues;

      if (data.idroute <= 0) {
        // Obtener el idroute
        // @ts-ignore
        let r1 = await getRouteByidAppRoute(routeData.idapp, routeData.route);

        if (r1) {
          // @ts-ignore
          data.idroute = r1.idroute;
        }
      }
    }

    console.log("******* UPSERT ROUTE ********", data);

    return [data, create];
  } catch (error) {
    console.error("Error performing UPSERT on route:", error);
    throw error;
  }
};
