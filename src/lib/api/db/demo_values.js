export const varsDemo = {
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
};

export const app_default = [
	{ idapp: 'cfcd208495d565ef66e7dff9f98764da', app: 'system', description: 'App System' },
	{
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		app: 'demo',
		description: 'App DEMO',
		vars: {
			$_VAR_DEMO_1: 10,
			$_VAR_DEMO_2: {
				host: 'google.com',
				var1: {
					a: 10,
					b: {
						casti: 3
					}
				}
			},
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
	}
];

export const endpoins_default = [
	{
		idendpoint: 'c4ca4238a0b923820dcc509a6f75849b',
		enabled: true,
		idapp: 'cfcd208495d565ef66e7dff9f98764da',
		namespace: 'main',
		name: 'test_functions',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: true,
		code: 'fnPublicAdd'
	},
	{
		idendpoint: 'c4ca4238a0b923820dcc509a6f75849b',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_functions',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'FUNCTION',
		is_public: true,
		code: 'fnPublicAdd'
	},

	{
		idendpoint: 'c81e728d9d4c2f636f067f89cc14862c',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_functions',
		version: 0.01,
		environment: 'dev',
		method: 'POST',
		handler: 'FUNCTION',
		is_public: true,
		code: 'fnPublicDemo'
	},

	{
		idendpoint: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_fetch',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'FETCH',
		is_public: true,
		code: 'https://api.github.com/users/edwinspire'
	},
	{
		idendpoint: 'a87ff679a2f3e71d9181a67b7542122c',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_fetch',
		version: 0.01,
		environment: 'dev',
		method: 'WS',
		handler: 'NA',
		is_public: true,
		code: 'https://api.github.com/users/edwinspire'
	},

	{
		idendpoint: 'e4da3b7fbbce2345d7772b0674a318d5',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_fetch',
		version: 0.02,
		environment: 'dev',
		method: 'GET',
		handler: 'FETCH',
		is_public: true,
		code: '$_VAR_FETCH'
	},

	{
		idendpoint: '1679091c5a880faf6fb5e6087eb1b2dc',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_javascript',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: '$_RETURN_DATA_ = {name: $_REQUEST_.query.name};'
	},

	{
		idendpoint: '8f14e45fceea167a5a36dedd4bea2543',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_javascript',
		version: 0.02,
		environment: 'dev',
		method: 'GET',
		handler: 'JS',
		is_public: false,
		code: '$_RETURN_DATA_ = $_VARS_APP;'
	},

	{
		idendpoint: 'c9f0f895fb98ab9159f51fd0297e236d',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_soap',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'SOAP',
		is_public: true,
		code: '{\n  "wsdl": "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",\n  "FunctionName": "NumberToDollars",\n  "BasicAuthSecurity": {\n    "User": "any",\n    "Password": "any"\n  }\n}'
	},

	{
		idendpoint: '45c48cce2e2d7fbdea1afc51c7c6ad26',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_soap',
		version: 0.02,
		environment: 'dev',
		method: 'GET',
		handler: 'SOAP',
		is_public: true,
		code: '"$_VAR_SOAP_TEST"'
	},

	{
		idendpoint: 'd3d9446802a44259755d38e6d163e820',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_sql',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},  "query": "SELECT 1097 AS test_sql;"\n}'
	},
	{
		idendpoint: '6512bd43d9caa6e02c990b0a82652dca',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_sql',
		version: 0.02,
		environment: 'dev',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": {"database": "memory",\n  "username": "",\n  "password": "",\n  "options": {\n    "host": "localhost",\n    "dialect": "sqlite"\n  }},\n  "query": "SELECT $name as nombre;"\n}'
	},
	{
		idendpoint: 'c20ad4d76fe97759aa27a0c99bff6710',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_sql',
		version: 0.03,
		environment: 'dev',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": { "database": "omsv2",\n  "username": "postgres",\n  "password": "pg4321",\n  "options": {\n    "host": "132.128.241.18",\n    "port": 5454,\n    "dialect": "postgres"\n  }}, "query": "SELECT NOW();"\n}'
	},
	{
		idendpoint: 'c51ce410c124a10e0db5e4b97fc2af39',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_sql',
		version: 0.04,
		environment: 'dev',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{"config": { "database": "msdb",\n  "username": "sa",\n  "password": "sqlkarma",\n  "options": {\n    "host": "192.168.138.30",\n    "dialect": "mssql",\n    "encrypt": false\n  }}, "query": "SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;"\n}'
	},
	{
		idendpoint: 'aab3238922bcc25a6f606eb525ffdc56',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_sql',
		version: 0.05,
		environment: 'dev',
		method: 'GET',
		handler: 'SQL',
		is_public: true,
		code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT $name as nombre, strftime(\'%Y-%m-%d %H-%M-%S\',\'now\') AS dt;"\n}'
	},

	{
		idendpoint: 'e99a18c428cb38d5f260853678922e03',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_ws',
		version: 0.01,
		environment: 'dev',
		method: 'WS',
		handler: 'NA',
		is_public: false,
		code: '{"userAuthentication":false,"tokenAuthentication":false,"broadcast":true}'
	},
	{
		idendpoint: '8faeeae40f850ca05bc5eb46b79cc6c5',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_ws',
		version: 0.02,
		environment: 'dev',
		method: 'WS',
		handler: 'NA',
		is_public: true,
		code: '{"userAuthentication":true,"tokenAuthentication":false,"broadcast":false}'
	},
	{
		idendpoint: '073db68a5c49d16a1807c8e7f2f9bbd1',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_ws',
		version: 0.03,
		environment: 'dev',
		method: 'WS',
		handler: 'NA',
		is_public: false,
		code: '{"userAuthentication":false,"tokenAuthentication":true,"broadcast":false}'
	},

	{
		idendpoint: '76c15b66d0762c3f01c35fa5a57c225d',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_mqtt',
		version: 0.01,
		environment: 'dev',
		method: 'MQTT',
		handler: 'NA',
		is_public: true,
		code: '{"subscribe":true,"publish":true,"broadcast":false}'
	},

	{
		idendpoint: '1a448ae839a065f04e34abf75b240da1',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_javascript_return_array_objects',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: '$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n'
	},
	{
		idendpoint: '80a5e5a2f7906a267e10a6ef40a1ebeb',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_javascript_with_fetch',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: "let uf = new $_UFETCH_();\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\n\n$_RETURN_DATA_ = await r1.json();\n"
	},
	{
		idendpoint: 'c3fcd3d76192e4007dfb496cca67e13b',
		enabled: true,
		idapp: 'c4ca4238a0b923820dcc509a6f75849b',
		namespace: 'main',
		name: 'test_javascript_two_fetch_ByBlocks',
		version: 0.01,
		environment: 'dev',
		method: 'GET',
		handler: 'JS',
		is_public: true,
		code: "let uf = new $_UFETCH_();\n// First fetch\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(async(data)=>{\nlet val = data.value1+data.value2; \n\nlet r2 = await uf.get('http://localhost:3000/api/demo/main/test_soap/v0.01/dev', {dNum: val});\nlet r2j = await r2.json();\n  \n  return r2j;  \n}, r1j, 2);\n\n\n\n$_RETURN_DATA_ = await rblock;\n"
	}
];
