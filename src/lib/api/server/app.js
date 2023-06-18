import express from "express";
import {
  getFullApp,
  defaultExamples,
  getAppRoutes,
  getAllApps,
  getAppById,
  upsertApp,
} from "../db/app.js";
import { validateToken } from "./utils.js";

const router = express.Router();

/**
 * @param {any} json
 */
function AppToTable(json) {
  console.log(json);

  const result = [];

  // Recorrer los datos para construir la matriz
  for (const app in json) {
    const appData = json[app];
    for (const namespace in appData.namespaces) {
      const namespaceData = appData.namespaces[namespace];
      for (const name in namespaceData) {
        const envData = namespaceData[name];
        for (const env in envData) {
          const versionData = envData[env];
          for (const version in versionData) {
            const methodData = versionData[version];
            const methods = [];
            for (const method in methodData) {
              methods.push({
                [method]: methodData[method],
              });
            }
            result.push({
              endpoint: `/api/${app}/${namespace}/${name}/${env}/${version}`,
              app,
              enabled: appData.enabled,
              namespace,
              name,
              env,
              version,
              methods,
            });
          }
        }
      }
    }
  }

  return result;
}

router.get("/api/apps", validateToken, async (req, res) => {
  try {
    const apps = await getAllApps();

    res.status(200).json(apps);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/app/:idapp", validateToken, async (req, res) => {
  try {
    let raw = !req.query.raw || req.query.raw == "false" ? false : true;

    console.log(req.params, req.query, raw);

    // @ts-ignore
    let data = await getAppById(req.params.idapp);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/app/:idapp", validateToken, async (req, res) => {
  try {
    console.log(req.params, req.body);

    // @ts-ignore
    let data = await upsertApp(req.body);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

export default router;
