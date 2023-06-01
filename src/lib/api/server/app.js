import express from "express";
import { getAllApps, getFullApp } from "../db/app.js";
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
    console.log(req.params);

    const app = await getFullApp(req.params.idapp);

    res.status(200).json(app);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

export default router;
