import { JSONFile, Low } from "lowdb";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uFetch from "@edwinspire/universal-fetch";
const jsFunction = (req, code) => {
  try {
    let codefunction = `
let RETURN_DATA = {};
${code}
return RETURN_DATA;
`;
    let f = new Function("req", codefunction);
    return { status: 200, data: f(req) };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};
const fetchFunction = async (req, parameters) => {
  try {
    let req_headers = { ...req.headers };
    delete req_headers["content-length"];
    delete req_headers["host"];
    delete req_headers["connection"];
    let init = {
      headers: parameters.headers || req_headers,
      body: parameters.body || req.body,
      query: parameters.query || req.query
    };
    const FData = new uFetch();
    let resp = await FData[parameters.method](parameters.url, init);
    let r = await resp.json();
    return { status: resp.status, data: r };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
};
const soapFunction = (req, code) => {
  try {
    let codefunction = `
let RETURN_DATA = {};
${code}
return RETURN_DATA;
`;
    let f = new Function("req", "res", "next", codefunction);
    let Return = f(req, res, next);
    res.status(200).json(Return);
  } catch (error) {
    console.trace(error);
    res.status(500).json({ error: error.message });
  }
};
let db;
const __dirname = dirname(fileURLToPath(import.meta.url));
async function createConnection() {
  const file = join(__dirname, "db.json");
  console.log(file);
  const adapter = new JSONFile(file);
  db = new Low(adapter);
  await db.read();
  db.data = db.data || { PRD: [], DEV: [], QA: [] };
  await db.write();
}
async function getDataFromFunction(params, request) {
  const selectDB = "lowdb";
  let apirestdb = {};
  let data = {};
  const method_request = request.method;
  switch (selectDB) {
    case "XXX":
      apirestdb = {};
      break;
    default:
      createConnection();
      await db.read();
      apirestdb = db.data;
      break;
  }
  let app;
  switch (params.environment.toLowerCase()) {
    case "prd":
      if (apirestdb.PRD) {
        app = apirestdb.PRD.find(
          (element) => element.app.toLowerCase() == params.app
        );
      }
      break;
    case "dev":
      if (apirestdb.DEV) {
        app = apirestdb.DEV.find(
          (element) => element.app.toLowerCase() == params.app
        );
      }
      break;
    case "qa":
      if (apirestdb.QA) {
        app = apirestdb.QA.find(
          (element) => element.app.toLowerCase() == params.app
        );
      }
      break;
  }
  if (app && app.enabled) {
    const route_app = app.routes.find(
      (element) => element.route.toLowerCase() == params.route.toLowerCase()
    );
    if (route_app && route_app.enabled) {
      const method = route_app.methods.find(
        (element) => element.method.toUpperCase() == method_request.toUpperCase() && params.version == "v" + element.version && element.enabled
      );
      if (method) {
        switch (method.handler.name) {
          case "jsFunction":
            data = jsFunction(request, method.handler.code);
            break;
          case "fetchFunction":
            data = fetchFunction(request, method.handler);
            break;
          case "soapFunction":
            data = soapFunction(request, method.handler.code);
            break;
          default:
            data = { status: 404, message: "Method handle not found" };
            break;
        }
      } else {
        data = { status: 404, message: "Method not found" };
      }
    } else {
      data = { status: 404, data: "Route not found" };
    }
  } else {
    data = { status: 404, data: "App not found" };
  }
  return data;
}
async function GET({ request, fetch, params }) {
  console.log(params, fetch);
  let app = await getDataFromFunction(params, request);
  return {
    status: app.status,
    body: app.data
  };
}
export {
  GET
};
