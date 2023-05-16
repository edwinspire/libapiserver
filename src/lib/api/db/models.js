import { NOW, DataTypes } from 'sequelize'
import dbsequelize from './sequelize.js'

// Definir el modelo de la tabla 'User'
export const User = dbsequelize.define(
  'user',
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
  },
  {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeUpdate: (user, options) => {
        user.ts = new Date()
        user.rowkey = Math.floor(Math.random() * 1000)
      },
    },
  },
)

// Definir el modelo de la tabla 'App'
export  const App = dbsequelize.define('app', {
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
},  {
  freezeTableName: true,
  timestamps: false,
  hooks: {
    beforeUpdate: (app, options) => {
      app.ts = new Date()
      app.rowkey = Math.floor(Math.random() * 1000)
    },
  },
})

// Definir el modelo de la tabla 'Route'
export  const Route = dbsequelize.define(
  'route',
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
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeUpdate: (route, options) => {
        route.ts = new Date()
        route.rowkey = Math.floor(Math.random() * 1000)
      },
    },
  },
)

// Definir el modelo de la tabla 'Method'
export  const Method = dbsequelize.define(
  'method',
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
    },
    env: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'dev',
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    version: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.1,
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
        fields: ['idroute', 'env', 'method', 'version'],
      },
    ],
    hooks: {
      beforeUpdate: (method, options) => {
        method.ts = new Date()
        method.rowkey = Math.floor(Math.random() * 1000)
      },
    },
  },
)

// Definir relaciones entre las tablas
User.hasMany(App, {
  foreignKey: 'iduser',
  onDelete: 'CASCADE',
})
App.belongsTo(User, {
  foreignKey: 'iduser',
})

App.hasMany(Route, {
  foreignKey: 'idapp',
  onDelete: 'CASCADE',
})
Route.belongsTo(App, {
  foreignKey: 'idapp',
})

Route.hasMany(Method, {
  foreignKey: 'idroute',
  onDelete: 'CASCADE',
})
Method.belongsTo(Route, {
  foreignKey: 'idroute',
})

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