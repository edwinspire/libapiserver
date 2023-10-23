
export const appDemo = {
  "enabled": true,
  "namespaces": [
    {
      "names": [
        {
          "name": "test_functions",
          "versions": [
            {
              "dev": {
                "GET": {
                  "code": "fnPublicAdd",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                },
                "POST": {
                  "code": "fnPublicDemo",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                }
              },
              "prd": {
                "GET": {
                  "code": "fnPublicAdd",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                },
                "POST": {
                  "code": "fnPublicDemo",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                }
              },
              "qa": {
                "GET": {
                  "code": "fnPublicAdd",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                },
                "POST": {
                  "code": "fnPublicDemo",
                  "enabled": true,
                  "handler": "FUNCTION",
                  "public": true
                }
              },
              "version": "0.01"
            }
          ]
        },
        {
          "name": "test_fetch",
          "versions": [
            {
              "dev": {
                "GET": {
                  "code": "https://api.github.com/users/edwinspire",
                  "enabled": true,
                  "handler": "FETCH",
                  "public": true
                },
                "WS": {
                  "code": "",
                  "enabled": true,
                  "handler": "NA",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.01"
            },
            {
              "dev": {
                "GET": {
                  "code": "$_VAR_FETCH",
                  "enabled": true,
                  "handler": "FETCH",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.02"
            }
          ]
        },
        {
          "name": "test_javascript",
          "versions": [
            {
              "dev": {
                "GET": {
                  "code": "$_RETURN_DATA_ = {name: $_REQUEST_.query.name};",
                  "enabled": true,
                  "handler": "JS",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.01"
            },
            {
              "dev": {
                "GET": {
                  "code": "$_RETURN_DATA_ = $_VARS_APP;",
                  "enabled": true,
                  "handler": "JS",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.02"
            }
          ]
        },
        {
          "name": "test_soap",
          "versions": [
            {
              "dev": {
                "GET": {
                  "code": "{\n  \"wsdl\": \"https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL\",\n  \"FunctionName\": \"NumberToDollars\",\n  \"BasicAuthSecurity\": {\n    \"User\": \"any\",\n    \"Password\": \"any\"\n  }\n}",
                  "enabled": true,
                  "handler": "SOAP",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.01"
            },
            {
              "dev": {
                "GET": {
                  "code": "\"$_VAR_SOAP_TEST\"",
                  "enabled": true,
                  "handler": "SOAP",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.02"
            }
          ]
        },
        {
          "name": "test_sql",
          "versions": [
            {
              "dev": {
                "GET": {
                  "code": "{\"config\": {\"database\": \"memory\",\n  \"username\": \"\",\n  \"password\": \"\",\n  \"options\": {\n    \"host\": \"localhost\",\n    \"dialect\": \"sqlite\"\n  }},  \"query\": \"SELECT 1097 AS test_sql;\"\n}",
                  "enabled": true,
                  "handler": "SQL",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": "0.01"
            },
            {
              "dev": {
                "GET": {
                  "code": "{\"config\": {\"database\": \"memory\",\n  \"username\": \"\",\n  \"password\": \"\",\n  \"options\": {\n    \"host\": \"localhost\",\n    \"dialect\": \"sqlite\"\n  }},\n  \"query\": \"SELECT $name as nombre;\"\n}",
                  "enabled": true,
                  "handler": "SQL",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": 0.02
            },
            {
              "dev": {
                "GET": {
                  "code": "{\"config\": { \"database\": \"omsv2\",\n  \"username\": \"postgres\",\n  \"password\": \"pg4321\",\n  \"options\": {\n    \"host\": \"132.128.241.18\",\n    \"port\": 5432,\n    \"dialect\": \"postgres\"\n  }}, \"query\": \"SELECT NOW();\"\n}",
                  "enabled": true,
                  "handler": "SQL",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": 0.03
            },
            {
              "dev": {
                "GET": {
                  "code": "{\"config\": { \"database\": \"msdb\",\n  \"username\": \"sa\",\n  \"password\": \"sqlkarma\",\n  \"options\": {\n    \"host\": \"192.168.138.30\",\n    \"dialect\": \"mssql\",\n    \"encrypt\": false\n  }}, \"query\": \"SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;\"\n}",
                  "enabled": true,
                  "handler": "SQL",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": 0.04
            },
            {
              "dev": {
                "GET": {
                  "code": "{\n  \"config\": \"$_VAR_SQLITE\",\n  \"query\": \"SELECT $name as nombre, strftime('%Y-%m-%d %H-%M-%S','now') AS dt;\"\n}",
                  "enabled": true,
                  "handler": "SQL",
                  "public": true
                }
              },
              "prd": {},
              "qa": {},
              "version": 0.05
            }
          ]
        },
        {
          "name": "test_ws",
          "versions": [
            {
              "version": "0.01",
              "dev": {
                "WS": {
                  "enabled": true,
                  "handler": "NA",
                  "public": true,
                  "userAuthentication": false,
                  "tokenAuthentication": false,
                  "broadcast": true,
                  "description": "Public WebSocket"
                }
              },
              "qa": {},
              "prd": {}
            },
            {
              "version": "0.02",
              "dev": {
                "WS": {
                  "enabled": true,
                  "handler": "NA",
                  "public": false,
                  "userAuthentication": true,
                  "tokenAuthentication": false,
                  "broadcast": true
                }
              },
              "qa": {},
              "prd": {}
            },
            {
              "version": "0.03",
              "dev": {
                "WS": {
                  "enabled": true,
                  "handler": "NA",
                  "public": false,
                  "userAuthentication": false,
                  "tokenAuthentication": true,
                  "broadcast": false
                }
              },
              "qa": {},
              "prd": {}
            }
          ]
        },
        {
          "name": "test_mqtt",
          "versions": [
            {
              "version": "0.01",
              "dev": {
                "MQTT": {
                  "enabled": true,
                  "handler": "NA",
                  "public": true,
                  "subscribe": true,
                  "publish": true,
                  "broadcast": false
                }
              },
              "qa": {},
              "prd": {}
            }
          ]
        },
        {
          "name": "test_javascript_return_array_objects",
          "versions": [
            {
              "version": "0.01",
              "dev": {
                "GET": {
                  "enabled": true,
                  "handler": "JS",
                  "public": true,
                  "userAuthentication": false,
                  "tokenAuthentication": false,
                  "broadcast": false,
                  "description": "",
                  "code": "$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n"
                }
              },
              "qa": {},
              "prd": {}
            }
          ]
        },
        {
          "name": "test_javascript_with_fetch",
          "versions": [
            {
              "version": "0.01",
              "dev": {
                "GET": {
                  "enabled": true,
                  "handler": "JS",
                  "public": true,
                  "userAuthentication": false,
                  "tokenAuthentication": false,
                  "broadcast": false,
                  "description": "",
                  "code": "let uf = new $_UFETCH_();\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\n\n$_RETURN_DATA_ = await r1.json();\n"
                }
              },
              "qa": {},
              "prd": {}
            }
          ]
        },
        {
          "name": "test_javascript_two_fetch_ByBlocks",
          "versions": [
            {
              "version": "0.01",
              "dev": {
                "GET": {
                  "enabled": true,
                  "handler": "JS",
                  "public": true,
                  "userAuthentication": false,
                  "tokenAuthentication": false,
                  "broadcast": false,
                  "description": "",
                  "code": "let uf = new $_UFETCH_();\n// First fetch\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(async(data)=>{\nlet val = data.value1+data.value2; \n\nlet r2 = await uf.get('http://localhost:3000/api/demo/main/test_soap/v0.01/dev', {dNum: val});\nlet r2j = await r2.json();\n  \n  return r2j;  \n}, r1j, 2);\n\n\n\n$_RETURN_DATA_ = await rblock;\n"
                }
              },
              "qa": {},
              "prd": {}
            }
          ]
        }
      ],
      "namespace": "main"
    }
  ]
};

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
