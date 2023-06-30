import { NOW, DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
//import {EncryptPwd} from "../server/utils.js";
// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
import {EncryptPwd} from "../server/utils.js"

const { PORT, PATH_API_HOOKS } = process.env;

const urlHooks =
  "http://localhost:" + PORT + (PATH_API_HOOKS || "/system/api/hooks");
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
      afterCreate: async (user, options) => {

      },
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert("user");
      },
      beforeUpdate: (user, options) => {
        // @ts-ignore
        user.ts = new Date();
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        user.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla 'App'
export const Application = dbsequelize.define(
  "application",
  {
    idapp: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    app: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    iduser: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON,
    },
  },
  {
    freezeTableName: true,
    // timestamps: false,
    indexes: [],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await hookUpsert("application");
      },
      beforeUpdate: (instance, options) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (instance, options) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
        console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
        await hookUpsert("application");
      },
      beforeSave: (instance, options) => {
        // Acciones a realizar antes de guardar el modelo
        //console.log('Antes de guardar:', instance.fieldName);
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir relaciones entre las tablas
/*
User.hasMany(App, {
  foreignKey: "iduser",
  onDelete: "CASCADE",
});
*/

/*
App.belongsTo(User, {
  foreignKey: "iduser",
});
*/

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
