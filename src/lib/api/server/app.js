import express from "express";
import {
//  getFullApp,
//  defaultExamples,
//  getAppRoutes,
  getAllApps,
  getAppById,
  upsertApp,
} from "../db/app.js";
import { validateToken } from "./utils.js";

const router = express.Router();


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
