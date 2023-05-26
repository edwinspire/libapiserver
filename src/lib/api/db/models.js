import { NOW, DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";

const { PORT } = process.env;

const urlHooks = "http://localhost:" + PORT + "/api/hooks";
const uF = new uFetch(urlHooks);

/**
 * @param {string} modelName
 */
async function hookUpsert(modelName) {
  //  console.log("---------------------> Options", options, typeof options.model);
  await uF.post("", { model: modelName, date: new Date() });
  //  console.log(await data.json());
}

// Definir el modelo de la tabla 'User'
export const User = dbsequelize.define(
  "user",
  {
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    idrole: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert("user");
      },
      beforeUpdate: (user, options) => {
        // @ts-ignore
        user.ts = new Date();
        // @ts-ignore
        user.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla 'App'
export const App = dbsequelize.define(
  "app",
  {
    idapp: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING,
    },
    app: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    iduser: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["app"],
      },
    ],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        console.log(instance);
        await hookUpsert("app");
      },
      beforeUpdate: (app, options) => {
        // @ts-ignore
        app.ts = new Date();
        // @ts-ignore
        app.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla 'Route'
export const Route = dbsequelize.define(
  "route",
  {
    idroute: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    idapp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["idapp", "route"],
      },
    ],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert("route");
      },
      beforeUpdate: (route, options) => {
        // @ts-ignore
        route.ts = new Date();
        // @ts-ignore
        route.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla 'Method'
export const Method = dbsequelize.define(
  "method",
  {
    idmethod: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    ts: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    idroute: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    env: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "dev",
      unique: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    version: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.1,
      unique: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    handler: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
    },
    examples: {
      type: DataTypes.JSONB,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["idroute", "env", "method", "version"],
      },
    ],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert("method");
      },
      beforeUpdate: (method, options) => {
        // @ts-ignore
        method.ts = new Date();
        // @ts-ignore
        method.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir relaciones entre las tablas
User.hasMany(App, {
  foreignKey: "iduser",
  onDelete: "CASCADE",
});
App.belongsTo(User, {
  foreignKey: "iduser",
});

App.hasMany(Route, {
  foreignKey: "idapp",
  onDelete: "CASCADE",
});
Route.belongsTo(App, {
  foreignKey: "idapp",
});

Route.hasMany(Method, {
  foreignKey: "idroute",
  onDelete: "CASCADE",
});
Method.belongsTo(Route, {
  foreignKey: "idroute",
});

/*
// Crear una vista que contenga los campos solicitados
dbsequelize.query(`
  CREATE VIEW IF NOT EXISTS AppMethodView AS
  SELECT
    app.idapp,
    app.icon,
    app.app,
    app.enabled,
    route.idroute,
    route.route,
    method.idmethod,
    method.method,
    method.version,
    method.handler,
    method.code,
    method.examples
  FROM
    App app
    INNER JOIN Route route ON app.idapp = route.idapp
    INNER JOIN Method method ON route.idroute = method.idroute;
`)
*/
