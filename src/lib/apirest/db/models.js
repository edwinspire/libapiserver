import { NOW, DataTypes } from 'sequelize';
import dbsequelize from './sequelize.js';

// Definir el modelo de la tabla 'Users'
const User = dbsequelize.define('user', {
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
	first_name: {
		type: DataTypes.STRING
	},
	last_name: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	idprofile: {
		type: DataTypes.BIGINT,
		allowNull: false
	}
});

// Definir el modelo de la tabla 'Apps'
const App = dbsequelize.define('app', {
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
	creation_date: {
		type: DataTypes.DATE,
		defaultValue: NOW
	},
	app: {
		type: DataTypes.STRING,
		unique: true
	},
	enabled: {
		type: DataTypes.BOOLEAN
	},
	description: {
		type: DataTypes.STRING
	},
	icon: {
		type: DataTypes.STRING
	}
});

// Definir el modelo de la tabla 'Routes'
const Route = dbsequelize.define('route', {
	idroute: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
		unique: true
	},
	iduser: {
		type: DataTypes.BIGINT,
		allowNull: false
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
	description: {
		type: DataTypes.STRING
	},
	route: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	enabled: {
		type: DataTypes.BOOLEAN
	},
	methods: {
		type: DataTypes.JSONB
	}
});

// Definir relaciones entre tablas
User.hasMany(Route, {
	foreignKey: 'iduser',
	onDelete: 'CASCADE'
});
Route.belongsTo(User, {
	foreignKey: 'iduser'
});

App.hasMany(Route, {
	foreignKey: 'idapp',
	onDelete: 'CASCADE'
});
Route.belongsTo(App, {
	foreignKey: 'idapp'
});

// PRODUCCION
// Definición del modelo "App"
const AppPrd = dbsequelize.define('prd', model_app, {
	freezeTableName: true,
	timestamps: false
});

// QA
// Definición del modelo "App"
const AppQa = dbsequelize.define('qa', model_app, {
	freezeTableName: true,
	timestamps: false
});

export const ApiModel = {
	Dev: { App: AppDev },
	Production: { App: AppPrd },
	QA: { App: AppQa }
};
