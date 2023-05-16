import { j as json } from './index-36410280.js';
import { Sequelize, DataTypes, NOW } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const dbsequelize = new Sequelize(process.env.DATABASE_URL_APIREST, {
  pool: {
    max: 10,
    min: 0,
    acquire: 3e4,
    idle: 1e4
  }
});
try {
  await dbsequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
const User = dbsequelize.define(
  "user",
  {
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeUpdate: (user, options) => {
        user.ts = /* @__PURE__ */ new Date();
        user.rowkey = Math.floor(Math.random() * 1e3);
      }
    }
  }
);
const App = dbsequelize.define("app", {
  idapp: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true
  },
  ts: {
    type: DataTypes.DATE,
    defaultValue: NOW
  },
  rowkey: {
    type: DataTypes.SMALLINT,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING
  },
  icon: {
    type: DataTypes.STRING
  },
  app: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  iduser: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  hooks: {
    beforeUpdate: (app, options) => {
      app.ts = /* @__PURE__ */ new Date();
      app.rowkey = Math.floor(Math.random() * 1e3);
    }
  }
});
const Route = dbsequelize.define(
  "route",
  {
    idroute: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    idapp: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeUpdate: (route, options) => {
        route.ts = /* @__PURE__ */ new Date();
        route.rowkey = Math.floor(Math.random() * 1e3);
      }
    }
  }
);
const Method = dbsequelize.define(
  "method",
  {
    idmethod: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
    idroute: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    env: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "dev"
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    version: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.1
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    description: {
      type: DataTypes.STRING
    },
    handler: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.TEXT
    },
    examples: {
      type: DataTypes.JSONB
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["idroute", "env", "method", "version"]
      }
    ],
    hooks: {
      beforeUpdate: (method, options) => {
        method.ts = /* @__PURE__ */ new Date();
        method.rowkey = Math.floor(Math.random() * 1e3);
      }
    }
  }
);
User.hasMany(App, {
  foreignKey: "iduser",
  onDelete: "CASCADE"
});
App.belongsTo(User, {
  foreignKey: "iduser"
});
App.hasMany(Route, {
  foreignKey: "idapp",
  onDelete: "CASCADE"
});
Route.belongsTo(App, {
  foreignKey: "idapp"
});
Route.hasMany(Method, {
  foreignKey: "idroute",
  onDelete: "CASCADE"
});
Method.belongsTo(Route, {
  foreignKey: "idroute"
});
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};
const createRoute = async (routeData) => {
  try {
    const newRoute = await Route.create(routeData);
    return newRoute;
  } catch (error) {
    console.error("Error creating route:", error);
    throw error;
  }
};
const getRouteById = async (routeId) => {
  try {
    const route = await Route.findByPk(routeId);
    return route;
  } catch (error) {
    console.error("Error retrieving route:", error);
    throw error;
  }
};
const getAllRoutes = async () => {
  try {
    const routes = await Route.findAll();
    return routes;
  } catch (error) {
    console.error("Error retrieving routes:", error);
    throw error;
  }
};
const updateRoute = async (routeId, routeData) => {
  try {
    const route = await Route.findByPk(routeId);
    if (route) {
      await route.update(routeData);
      return route;
    }
    return null;
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};
const deleteRoute = async (routeId) => {
  try {
    const route = await Route.findByPk(routeId);
    if (route) {
      await route.destroy();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};
const upsertRoute = async (idapp, routeData, transaction) => {
  try {
    routeData.idapp = routeData.idapp || idapp;
    console.log("routeData >>>>> ", routeData);
    let result = await Route.upsert(routeData, transaction);
    console.log("UPSERT ROUTE", result);
    if (result && Array.isArray(result) && result.length > 0 && result[0].idroute < 1) {
      result = await Route.findAll({
        // @ts-ignore
        where: { route: routeData.route, idapp: routeData.idapp }
      }).map((r) => {
        return m.dataValues;
      });
    }
    return result;
  } catch (error) {
    console.error("Error performing UPSERT on route:", error);
    throw error;
  }
};
const runExample$1 = async () => {
  try {
    const newRoute = await createRoute({
      path: "/users",
      method: "GET",
      handler: "getUserList"
    });
    console.log("New route created:", newRoute);
    const routeById = await getRouteById(newRoute.id);
    console.log("Route by ID:", routeById);
    const allRoutes = await getAllRoutes();
    console.log("All routes:", allRoutes);
    const updatedRoute = await updateRoute(newRoute.id, {
      handler: "updatedHandler"
    });
    console.log("Updated route:", updatedRoute);
    const deleted = await deleteRoute(newRoute.id);
    console.log("Route deleted:", deleted);
    const upsertedRoute = await upsertRoute({
      path: "/users",
      method: "POST",
      handler: "createUser"
    });
    console.log("Upserted route:", upsertedRoute);
  } catch (error) {
    console.error("Example error:", error);
  }
};
runExample$1();
const createMethod = async (methodData) => {
  try {
    const newMethod = await Method.create(methodData);
    return newMethod;
  } catch (error) {
    console.error("Error creating method:", error);
    throw error;
  }
};
const getMethodById = async (methodId) => {
  try {
    const method = await Method.findByPk(methodId);
    return method;
  } catch (error) {
    console.error("Error retrieving method:", error);
    throw error;
  }
};
const getAllMethods = async () => {
  try {
    const methods = await Method.findAll();
    return methods;
  } catch (error) {
    console.error("Error retrieving methods:", error);
    throw error;
  }
};
const updateMethod = async (methodId, methodData) => {
  try {
    const method = await Method.findByPk(methodId);
    if (method) {
      await method.update(methodData);
      return method;
    }
    return null;
  } catch (error) {
    console.error("Error updating method:", error);
    throw error;
  }
};
const deleteMethod = async (methodId) => {
  try {
    const method = await Method.findByPk(methodId);
    if (method) {
      await method.destroy();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting method:", error);
    throw error;
  }
};
const upsertMethod = async (methodData, transaction) => {
  try {
    return await Method.upsert(methodData, transaction);
  } catch (error) {
    console.error("Error performing UPSERT on method:", error, methodData);
    throw error;
  }
};
const runExample = async () => {
  try {
    const newMethod = await createMethod({
      idroute: 1,
      env: "dev",
      method: "GET",
      version: 1,
      handler: "getUserList"
    });
    console.log("New method created:", newMethod);
    const methodById = await getMethodById(newMethod.idmethod);
    console.log("Method by ID:", methodById);
    const allMethods = await getAllMethods();
    console.log("All methods:", allMethods);
    const updatedMethod = await updateMethod(newMethod.idmethod, {
      handler: "updatedHandler"
    });
    console.log("Updated method:", updatedMethod);
    const deleted = await deleteMethod(newMethod.idmethod);
    console.log("Method deleted:", deleted);
    const upsertedMethod = await upsertMethod({
      idroute: 2,
      env: "prod",
      method: "POST",
      version: 2,
      handler: "createUser"
    });
    console.log("Upserted method:", upsertedMethod);
  } catch (error) {
    console.error("Example error:", error);
  }
};
runExample();
const getAppById = async (appId) => {
  try {
    const app = await App.findByPk(appId);
    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};
const upsertApp = async (appData, transaction) => {
  try {
    return await App.upsert(appData, transaction);
  } catch (error) {
    console.error("Error performing UPSERT on app:", error);
    throw error;
  }
};
async function saveApp(appData) {
  const transaction = await dbsequelize.transaction();
  try {
    let user = await getUserById(appData.iduser);
    if (user && user.enabled) {
      let [app, create] = await upsertApp(appData, { transaction });
      appData.idapp = appData.idapp || app.idapp;
      if (appData.idapp < 1) {
        let app1 = await App.findAll({ where: { app: appData.app } });
        if (app1 && Array.isArray(app1) && app1.length > 0 && app1[0].idapp > 0) {
          appData.idapp = app1[0].idapp;
        } else {
          console.log("No se pudo obtener el idapp");
        }
      }
      if (appData.idapp > 0) {
        if (appData.route && Array.isArray(appData.route) && appData.route.length > 0) {
          console.log("Ingresamos las rutas para la idapp " + appData.idapp);
          for (let index = 0; index < appData.route.length; index++) {
            let route = { ...appData.route[index] };
            let route_result = await upsertRoute(appData.idapp, route, {
              transaction
            });
            if (route_result && Array.isArray(route_result) && route_result.length > 0 && route_result[0].idroute > 0) {
              route.idroute = route_result[0].idroute;
              if (route && route.method && Array.isArray(route.method)) {
                for (let indexm = 0; indexm < route.method.length; indexm++) {
                  let method = {
                    ...route.method[indexm],
                    idroute: route.idroute
                  };
                  await upsertMethod(method, { transaction });
                }
              }
            } else {
              console.log("route_result no Encontrado", route_result);
            }
          }
        }
      } else {
        await transaction.rollback();
        return { error: "idapp Not Found" };
      }
      await transaction.commit();
      console.log("Transacción completada con éxito");
      let outData = await getFullApp(appData.idapp);
      return { data: outData };
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error en la transacción:", error);
    return { error: error.message };
  }
}
async function getFullApp(idapp) {
  try {
    let dataApp = await getAppById(idapp);
    let outApp = dataApp?.dataValues;
    if (outApp && outApp.idapp && outApp.idapp > 0) {
      let routes = await Route.findAll({ where: { idapp } });
      if (routes && Array.isArray(routes) && routes.length > 0) {
        for (let index = 0; index < routes.length; index++) {
          routes[index].method = [];
          routes[index] = routes[index].dataValues;
          let methods = await Method.findAll({
            // @ts-ignore
            where: { idroute: routes[index].idroute }
          });
          routes[index].method = methods.map((m2) => {
            return m2.dataValues;
          });
        }
      }
      outApp.route = routes;
    }
    return outApp;
  } catch (error) {
    return { error: error.message };
  }
}
async function GET({ request, url }) {
  let data = await getFullApp(Number(url.searchParams.get("idapp")));
  return json(data, { status: 200 });
}
async function POST({ request, params }) {
  let dataApp = await request.json();
  let returnData = await saveApp(dataApp);
  return json(returnData, { status: 200 });
}

export { GET, POST };
//# sourceMappingURL=_server-4d39d843.js.map
