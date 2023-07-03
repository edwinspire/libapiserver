import express from "express";
import { User } from "../db/models.js";
import { getUserByCredentials } from "../db/user.js";
import { EncryptPwd, GenToken, tokenVerify, customError, validateToken } from "./utils.js";

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

// console.log(EncryptPwd(req.body.password));

    if (user) {
      // Envía el Token en el Header
      let token = GenToken({
        username: user.dataValues.username,
        first_name: user.dataValues.first_name,
        last_name: user.dataValues.last_name,
      });
      res.set("api-token", token);

      await user.update({ token: token, last_login: new Date() });
      await user.save();

      res.status(200).json({
        login: true,
        username: user.dataValues.username,
        first_name: user.dataValues.first_name,
        last_name: user.dataValues.last_name,
        token: token
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
