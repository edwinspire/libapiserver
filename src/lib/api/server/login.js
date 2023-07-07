import express from "express";
import { User } from "../db/models.js";
import { getUserByCredentials } from "../db/user.js";
import {
  EncryptPwd,
  GenToken,
  tokenVerify,
  customError,
  validateToken,
} from "./utils.js";

const router = express.Router();

router.post("/api/logout", validateToken, async (req, res) => {
  try {
    // Check Token

    console.log(req.headers);

    const token = req.headers["api-token"];
    const data = tokenVerify(token);

    let user = await User.findOne({
      where: {
        // @ts-ignore
        username: data.data.username,
        token: token,
      },
    });

    if (user) {
      //Elimina la variable del Header
      res.set("api-token", undefined);

      await user.update({ token: "", last_login: new Date() });
      await user.save();

      res.status(200).json({
        logout: true,
      });
    } else {
      res.status(403).json({ logout: false, error: "Invalid data" });
    }
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    let user = await getUserByCredentials(
      req.body.username,
      EncryptPwd(req.body.password)
    );

    if (user) {
      let u = { ...user.dataValues };

      // Envía el Token en el Header
      let token = GenToken({
        username: u.username,
        role: u.role.dataValues,
      });
      res.set("api-token", token);

      await user.update({ token: token, last_login: new Date() });
      await user.save();

      res.status(200).json({
        login: true,
        username: u.username,
        first_name: u.first_name,
        last_name: u.last_name,
        role: u.role.dataValues,
        token: token,
      });
    } else {
      res.status(401).json(customError(2));
    }
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
});

export default router;
