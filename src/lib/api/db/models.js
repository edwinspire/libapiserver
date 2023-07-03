import { NOW, DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
//import {EncryptPwd} from "../server/utils.js";
// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
//import {EncryptPwd} from "../server/utils.js"

const { PORT, PATH_API_HOOKS, TABLE_NAME_PREFIX_API } = process.env;

const urlHooks =
  "http://localhost:" + PORT + (PATH_API_HOOKS || "/system/api/hooks");
const uF = new uFetch(urlHooks);

/**
 * @param {string} table_name
 */
export function prefixTableName(table_name) {
  return (TABLE_NAME_PREFIX_API || "apiserver_") + table_name;
}

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
  prefixTableName("user"),
  {
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
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
      allowNull: false,
      defaultValue: 0
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
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
    hooks: {
      afterCreate: async (user, options) => {},
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("user"));
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

// Definir el modelo de la tabla 'User'
export const Role = dbsequelize.define(
  prefixTableName("role"),
  {
    idrole: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    attrs: { type: DataTypes.JSON, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["role"],
      },
    ],
    hooks: {
      afterCreate: async (user, options) => {},
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("role"));
      },
      beforeUpdate: (user, options) => {},
    },
  }
);

// Definir el modelo de la tabla 'App'
// @ts-ignore
export const Application = dbsequelize.define(
  prefixTableName("application"),
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
    timestamps: true,
    indexes: [],
    hooks: {
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await hookUpsert(prefixTableName("application"));
      },
      beforeUpdate: (instance, options) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (instance, options) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
        console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
        await hookUpsert(prefixTableName("application"));
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

// Define la relación entre User y Role
User.belongsTo(Role, { foreignKey: "idrole", as: "role" });
Role.hasMany(User, { foreignKey: "idrole", as: "users1" });
