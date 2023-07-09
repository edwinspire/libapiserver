import express from "express";
import { validateToken, defaultSystemPath } from "../utils.js";
import { getAllHandlers } from "../../db/handler.js";

const router = express.Router();

router.get(defaultSystemPath("handlers"), validateToken, async (req, res) => {
  try {
    const hs = await getAllHandlers();

    res.status(200).json(hs);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

export default router;
