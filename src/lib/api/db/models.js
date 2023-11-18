import { DataTypes } from 'sequelize';
import dbsequelize from './sequelize.js';
// @ts-ignore
import uFetch from '@edwinspire/universal-fetch';
//import {EncryptPwd} from "../server/utils.js"

const { PORT, PATH_API_HOOKS, TABLE_NAME_PREFIX_API } = process.env;

const urlHooks = 'http://localhost:' + PORT + (PATH_API_HOOKS || '/system/api/hooks');
const uF = new uFetch(urlHooks);

/**
 * @param {string} table_name
 */
export function prefixTableName(table_name) {
	return (TABLE_NAME_PREFIX_API || 'apiserver_') + table_name;
}

/**
 * @param {string} modelName
 */
async function hookUpsert(modelName) {
	console.log('---------------------> hookUpsert', modelName);
	await uF.post('', { model: modelName, date: new Date() });
	//  console.log(await data.json());
}

/*
// Definir el modelo de la tabla
export const AppModel = dbsequelize.define(
  prefixTableName("app"),
  {
    idapp: {
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
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
    hooks: {
      afterCreate: async (row, options) => { },
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("app"));
      },
      beforeUpdate: (row, options) => {
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        row.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla
export const NameSpaceModel = dbsequelize.define(
  prefixTableName("namespace"),
  {
    idnamespace: {
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
    idapp: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idapp", "name"],
      },
    ],
    hooks: {
      afterCreate: async (row, options) => { },
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("namespace"));
      },
      beforeUpdate: (row, options) => {
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        row.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);


// Asociación entre AppModel y NameSpaceModel
AppModel.hasMany(NameSpaceModel, { foreignKey: 'idapp' });
NameSpaceModel.belongsTo(AppModel, { foreignKey: 'idapp' });


// Definir el modelo de la tabla
export const VersionModel = dbsequelize.define(
  prefixTableName("version"),
  {
    idversion: {
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
    idnamespace: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    version: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.01
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idnamespace", "version"],
      },
    ],
    hooks: {
      afterCreate: async (row, options) => { },
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("version"));
      },
      beforeUpdate: (row, options) => {
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        row.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);


// Asociación 
NameSpaceModel.hasMany(VersionModel, { foreignKey: 'idnamespace' });
VersionModel.belongsTo(NameSpaceModel, { foreignKey: 'idnamespace' });



// Definir el modelo de la tabla
export const MethodModel = dbsequelize.define(
  prefixTableName("method"),
  {
    idmethod: {
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
    idversion: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    env: {
      type: DataTypes.SMALLINT,
      defaultValue: 0, // 0 dev - 1 qa - 2 prd
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    method: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    handler: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idmethod", "env", "method"],
      },
    ],
    hooks: {
      afterCreate: async (row, options) => { },
      afterUpsert: async (instance, options) => {
        // @ts-ignore
        await hookUpsert(prefixTableName("method"));
      },
      beforeUpdate: (row, options) => {
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        row.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Asociación 
VersionModel.hasMany(MethodModel, { foreignKey: 'idversion' });
MethodModel.belongsTo(VersionModel, { foreignKey: 'idversion' });
*/

/*
// Asociación entre NameSpaceModel y VersionModel
NameSpaceModel.hasMany(VersionModel, { foreignKey: 'idnamespace' });
VersionModel.belongsTo(NameSpaceModel, { foreignKey: 'idnamespace' });
*/

// Definir el modelo de la tabla 'User'
export const User = dbsequelize.define(
	prefixTableName('user'),
	{
		iduser: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true
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
		},
		idrole: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0
		},
		token: {
			type: DataTypes.STRING
		},
		last_login: {
			type: DataTypes.DATE,
			allowNull: true
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['username']
			}
		],
		hooks: {
			afterUpsert: async () => {
				// @ts-ignore
				await hookUpsert(prefixTableName('user'));
			},
			beforeUpdate: (/** @type {any} */ user) => {
				// @ts-ignore
				user.ts = new Date();
				// @ts-ignore
				//user.password = EncryptPwd(user.password);
				// @ts-ignore
				user.rowkey = Math.floor(Math.random() * 1000);
			}
		}
	}
);

// Definir el modelo de la tabla 'Role'
export const Role = dbsequelize.define(
	prefixTableName('role'),
	{
		idrole: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true
		},
		rowkey: {
			type: DataTypes.SMALLINT,
			defaultValue: 0
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		role: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		type: {
			type: DataTypes.SMALLINT,
			defaultValue: 0 // 0: Role min - 1: Role max - 2: Custom Role
		},
		attrs: {
			type: dbsequelize.getDialect() === 'mssql' ? DataTypes.TEXT : DataTypes.JSON,
			allowNull: true
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['role']
			}
		],
		hooks: {
			afterUpsert: async () => {
				// @ts-ignore
				await hookUpsert(prefixTableName('role'));
			}
		}
	}
);

// Definir el modelo de la tabla 'Method'
export const Method = dbsequelize.define(
	prefixTableName('methods'),
	{
		method: {
			type: DataTypes.STRING(10),
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		label: {
			type: DataTypes.STRING(10),
			unique: true,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [],
		hooks: {
			afterUpsert: async () => {
				// @ts-ignore
				await hookUpsert(prefixTableName('method'));
			}
		}
	}
);

// Definir el modelo de la tabla 'Handler'
export const Handler = dbsequelize.define(
	prefixTableName('handler'),
	{
		handler: {
			type: DataTypes.STRING(10),
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		label: {
			type: DataTypes.STRING(25),
			unique: true,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [],
		hooks: {
			afterUpsert: async () => {
				// @ts-ignore
				await hookUpsert(prefixTableName('handler'));
			}
		}
	}
);

// Definir el modelo de la tabla 'App'
// @ts-ignore
export const Application = dbsequelize.define(
	prefixTableName('application'),
	{
		idapp: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true
		},
		app: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true
		},
		rowkey: {
			type: DataTypes.SMALLINT,
			defaultValue: 0
		},
		iduser: { type: DataTypes.BIGINT },
		enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
		description: {
			type: DataTypes.TEXT
		},
		vars: {
			type: dbsequelize.getDialect() === 'mssql' ? DataTypes.TEXT : DataTypes.JSON
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [],
		hooks: {
			afterUpsert: async (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = 999;
				// @ts-ignore
				// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
				await hookUpsert(prefixTableName('application'));
			},
			beforeUpdate: (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			},
			beforeUpsert: async (/** @type {{ rowkey: number; }} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
				// console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
				await hookUpsert(prefixTableName('application'));
			},
			beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
				// Acciones a realizar antes de guardar el modelo
				//console.log('Antes de guardar:', instance.fieldName);
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			}
		}
	}
);

User.belongsTo(Role, {
	foreignKey: 'idrole',
	targetKey: 'idrole',
	as: 'role'
});

/*
// Define la relación entre User y Role
User.belongsTo(Role, { foreignKey: "idrole" });
Role.hasMany(User, { foreignKey: "idrole" });
*/

export const Apikey = dbsequelize.define(
	prefixTableName('apikey'),
	{
		apikey: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		idapp: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		rowkey: {
			type: DataTypes.SMALLINT,
			defaultValue: 0
		},
		enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
		start_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		expiry_date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [],
		hooks: {
			afterUpsert: async (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = 999;
				// @ts-ignore
				//   console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
				await hookUpsert(prefixTableName('apikey'));
			},
			beforeUpdate: (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			},
			beforeUpsert: async (/** @type {{ rowkey: number; }} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
				//   console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
				await hookUpsert(prefixTableName('apikey'));
			},
			beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
				// Acciones a realizar antes de guardar el modelo
				//console.log('Antes de guardar:', instance.fieldName);
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			}
		}
	}
);

Application.hasMany(Apikey, { foreignKey: 'idapp' });
Apikey.belongsTo(Application, { foreignKey: 'idapp' });

export const Endpoint = dbsequelize.define(
	prefixTableName('endpoint'),
	{
		idendpoint: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		rowkey: {
			type: DataTypes.SMALLINT,
			defaultValue: 0
		},
		enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
		idapp: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		namespace: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		version: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: 0.1
		},
		environment: {
			type: DataTypes.STRING(4),
			allowNull: false,
			defaultValue: 'dev'
		},
		method: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		handler: {
			type: DataTypes.STRING(15),
			allowNull: false
		},
		is_public: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		code: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ''
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ''
		}
	},
	{
		freezeTableName: true,
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['idapp', 'namespace', 'name', 'version', 'environment', 'method']
			}
		],
		hooks: {
			afterUpsert: async (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = 999;
				// @ts-ignore
				//   console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
				await hookUpsert(prefixTableName('endpoint'));
			},
			beforeUpdate: (/** @type {any} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			},
			beforeUpsert: async (/** @type {{ rowkey: number; idendpoint: string}} */ instance) => {
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);

				/*
				if (!instance.idendpoint) {
					instance.idendpoint = uuidv4();
				}
				*/

				//	console.log('>>>>>>>>>>>>>> Se lanza el beforeUpsert', instance);

				await hookUpsert(prefixTableName('endpoint'));
			},
			beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
				// Acciones a realizar antes de guardar el modelo
				//console.log('Antes de guardar:', instance.fieldName);
				// @ts-ignore
				instance.rowkey = Math.floor(Math.random() * 1000);
			}
		}
	}
);

Application.hasMany(Endpoint, { foreignKey: 'idapp' });
Endpoint.belongsTo(Application, { foreignKey: 'idapp' });
