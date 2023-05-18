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
    indexes: [
      {
        unique: true,
        fields: ["username"]
      }
    ],
    hooks: {
      beforeUpdate: (user, options) => {
        user.ts = /* @__PURE__ */ new Date();
        user.rowkey = Math.floor(Math.random() * 1e3);
      }
    }
  }
);
const App = dbsequelize.define(
  "app",
  {
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
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["app"]
      }
    ],
    hooks: {
      beforeUpdate: (app, options) => {
        app.ts = /* @__PURE__ */ new Date();
        app.rowkey = Math.floor(Math.random() * 1e3);
      }
    }
  }
);
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
      allowNull: false,
      unique: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["idapp", "route"]
      }
    ],
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
      allowNull: false,
      unique: false
    },
    env: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "dev",
      unique: false
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    version: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.1,
      unique: false
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
const getRouteByidAppRoute = async (idapp, name_route) => {
  let d1 = await Route.findAll({ where: { idapp, route: name_route } });
  let data;
  if (d1 && Array.isArray(d1) && d1.length > 0) {
    data = d1[0].dataValues;
  }
  return data;
};
const upsertRoute = async (idapp, routeData, transaction) => {
  try {
    let data;
    routeData.idapp = routeData.idapp || idapp;
    let [app, create] = await Route.upsert(routeData, transaction);
    if (app && app.dataValues) {
      data = app.dataValues;
      if (data.idroute <= 0) {
        let r1 = await getRouteByidAppRoute(routeData.idapp, routeData.route);
        if (r1) {
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
const upsertMethod = async (methodData, transaction) => {
  try {
    return await Method.upsert(methodData, transaction);
  } catch (error) {
    console.error("Error performing UPSERT on method:", error, methodData);
    throw error;
  }
};
const getAppById = async (appId) => {
  try {
    const app = await App.findByPk(appId);
    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};
const getAppByName = async (app_name) => {
  let d1 = await App.findAll({ where: { app: app_name } });
  let data;
  if (d1 && Array.isArray(d1) && d1.length > 0) {
    data = d1[0].dataValues;
  }
  console.log(" >>>>> getAppByName ZZZZZ ", data);
  return data;
};
const upsertApp = async (appData, transaction) => {
  try {
    let [app, create] = await App.upsert(appData, transaction);
    let data = app.dataValues;
    if (data.idapp <= 0) {
      let d2 = await getAppByName(data.app);
      data.idapp = d2.idapp;
    }
    return [data, create];
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
      appData.idapp = app.idapp;
      if (appData.idapp > 0) {
        if (appData.route && Array.isArray(appData.route) && appData.route.length > 0) {
          for (let index = 0; index < appData.route.length; index++) {
            let route = { ...appData.route[index] };
            let [route_result] = await upsertRoute(appData.idapp, route, {
              transaction
            });
            if (route_result && route_result.idroute > 0) {
              route.idroute = route_result.idroute;
              if (route && route.method && Array.isArray(route.method) && route.method.length > 0) {
                for (let indexm = 0; indexm < route.method.length; indexm++) {
                  let method = {
                    ...route.method[indexm],
                    idroute: route.idroute
                  };
                  console.log("XXXXXXXXXXXXXXXXXXXX> ", method);
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
          routes[index].method = methods.map((m) => {
            return m.dataValues;
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
//# sourceMappingURL=_server-9db8d994.js.map
