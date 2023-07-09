import express from 'express';
import appRoutes from "./app.js";
import loginRoutes from "./login.js";
import handlersRoutes from "./handler.js";
import methodsRoutes from "./method.js";
import usersRoutes from "./user.js";

const router = express.Router();

// Unir las instancias de enrutador
router.use(appRoutes);
router.use(loginRoutes);
router.use(handlersRoutes);
router.use(methodsRoutes);
router.use(usersRoutes);

export default router;