export const varsDemo = {
	dev: {
		$_VAR_DEMO_1: 10,
		$_VAR_DEMO_2: { host: 'google.com', var1: { a: 10, b: { casti: 3 } } },
		$_VAR_FETCH: 'https://api.github.com/users/auth0',
		$_VAR_SQLITE: {
			database: 'memory',
			username: '',
			password: '',
			options: {
				host: 'localhost',
				dialect: 'sqlite'
			}
		},
		$_VAR_SOAP_TEST: {
			wsdl: 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL',
			FunctionName: 'NumberToDollars',
			BasicAuthSecurity: {
				User: 'any',
				Password: 'any'
			}
		}
	},
	qa: {
		$_VAR_DEMO_1: 10,
		$_VAR_DEMO_2: { host: 'google.com', var1: { a: 10, b: { casti: 3 } } },
		$_VAR_FETCH: 'https://api.github.com/users/auth0',
		$_VAR_SQLITE: {
			database: 'memory',
			username: '',
			password: '',
			options: {
				host: 'localhost',
				dialect: 'sqlite'
			}
		},
		$_VAR_SOAP_TEST: {
			wsdl: 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL',
			FunctionName: 'NumberToDollars',
			BasicAuthSecurity: {
				User: 'any',
				Password: 'any'
			}
		}
	},
	prd: {
		$_VAR_DEMO_1: 10,
		$_VAR_DEMO_2: { host: 'google.com', var1: { a: 10, b: { casti: 3 } } },
		$_VAR_FETCH: 'https://api.github.com/users/auth0',
		$_VAR_SQLITE: {
			database: 'memory',
			username: '',
			password: '',
			options: {
				host: 'localhost',
				dialect: 'sqlite'
			}
		},
		$_VAR_SOAP_TEST: {
			wsdl: 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL',
			FunctionName: 'NumberToDollars',
			BasicAuthSecurity: {
				User: 'any',
				Password: 'any'
			}
		}
	}
};
export const app_default = [
	{ idapp: 'cfcd208495d565ef66e7dff9f98764da', app: 'system', description: 'App System' },
	{
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		app: 'demo',
		description: 'App DEMO',
		vars: varsDemo
	}
];

export const endpoins_default = [
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'dev/api/token/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		for_user: true,
		for_api: true,
		code: 'fnToken'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'qa/api/token/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		for_user: true,
		for_api: true,
		code: 'fnToken'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/api/token/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		for_user: true,
		for_api: true,
		code: 'fnToken'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'dev/api/apps/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetApps'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'qa/api/apps/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetApps'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/api/apps/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetApps'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'dev/api/app/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetAppById'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'qa/api/app/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetAppById'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/api/app/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetAppById'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'dev/api/app/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnSaveApp'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'qa/api/app/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnSaveApp'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/api/app/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnSaveApp'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/system/login/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		for_user: true,
		for_api: true,
		code: 'fnLogin'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/system/logout/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnLogout'
	},
	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/system/handler/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetHandler'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/system/method/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetMethod'
	},

	{
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		resource: 'prd/system/environment/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: false,
		for_user: true,
		for_api: false,
		code: 'fnGetEnvironment'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_functions/0.01',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: true,
		code: 'fnPublicAdd'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_functions/0.01',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		code: 'fnPublicDemo'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_fetch/0.01',
		method: 'GET',
		handler: 'FETCH',
		is_public: true,
		code: 'https://api.github.com/users/edwinspire'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_fetch/0.01',
		method: 'WS',
		handler: 'NA',
		is_public: true,
		code: 'https://api.github.com/users/edwinspire'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_fetch/0.02',
		method: 'GET',
		handler: 'FETCH',
		is_public: true,
		code: '$_VAR_FETCH'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_javascript/0.01',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: '$_RETURN_DATA_ = {name: $_REQUEST_.query.name};'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_javascript/0.02',
		method: 'GET',
		handler: 'JS',
		is_public: false,
		code: '$_RETURN_DATA_ = $_VARS_APP;'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_soap/0.01',
		method: 'GET',
		handler: 'SOAP',
		is_public: true,
		code: '{\n  "wsdl": "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",\n  "FunctionName": "NumberToDollars",\n  "BasicAuthSecurity": {\n    "User": "any",\n    "Password": "any"\n  }\n}'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_soap/0.02',
		method: 'GET',
		handler: 'SOAP',
		is_public: true,
		code: '"$_VAR_SOAP_TEST"'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_sql/0.03',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},  "query": "SELECT 1097 AS test_sql;"\n}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_sql/0.02',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},\n  "query": "SELECT $name as nombre;"\n}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_sql/0.03',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": { "database": "omsv2",\n  "username": "postgres",\n  "password": "pg4321",\n  "options": {\n    "host": "132.128.241.18",\n    "port": 5454,\n    "dialect": "postgres"\n  }}, "query": "SELECT NOW();"\n}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_sql/0.04',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": { "database": "msdb",\n  "username": "sa",\n  "password": "sqlkarma",\n  "options": {\n    "host": "192.168.138.30",\n    "dialect": "mssql",\n    "encrypt": false\n  }}, "query": "SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;"\n}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_sql/0.05',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT $name as nombre, strftime(\'%Y-%m-%d %H-%M-%S\',\'now\') AS dt;"\n}'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_ws/0.01',
		method: 'WS',
		handler: 'NA',
		is_public: false,
		code: '{"userAuthentication":false,"tokenAuthentication":false,"broadcast":true}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_ws/0.02',
		method: 'WS',
		handler: 'NA',
		is_public: true,
		code: '{"userAuthentication":true,"tokenAuthentication":false,"broadcast":false}'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_ws/0.03',
		method: 'WS',
		handler: 'NA',
		is_public: false,
		code: '{"userAuthentication":false,"tokenAuthentication":true,"broadcast":false}'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_mqtt/0.01',
		method: 'MQTT',
		handler: 'NA',
		is_public: true,
		code: '{"subscribe":true,"publish":true,"broadcast":false}'
	},

	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_javascript/array_objects/0.01',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: '$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n'
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_javascript/fetch/0.01',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: "let uf = new $_UFETCH_();\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\n\n$_RETURN_DATA_ = await r1.json();\n"
	},
	{
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		resource: 'dev/main/test_javascript/two_fetch_ByBlocks/0.01',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: "let uf = new $_UFETCH_();\n// First fetch\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(async(data)=>{\nlet val = data.value1+data.value2; \n\nlet r2 = await uf.get('http://localhost:3000/api/demo/main/test_soap/v0.01/dev', {dNum: val});\nlet r2j = await r2.json();\n  \n  return r2j;  \n}, r1j, 2);\n\n\n\n$_RETURN_DATA_ = await rblock;\n"
	}
];
