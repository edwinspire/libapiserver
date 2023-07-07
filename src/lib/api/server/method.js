import express from "express";
import {
  //  getFullApp,
  //  defaultExamples,
  //  getAppRoutes,
  getAllMethods,
} from "../db/method.js";
import { validateToken } from "./utils.js";

const router = express.Router();

router.get("/api/methods", validateToken, async (req, res) => {
  try {
    const methods = await getAllMethods();

    res.status(200).json(methods);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

export default router;
