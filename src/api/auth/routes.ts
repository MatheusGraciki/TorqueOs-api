import { Router } from "express";
import { login, logout, me } from "./controller";
import { sessionMiddleware } from "../../middlewares/session";

const router = Router();

router.post("/login", login);
router.post("/logout", sessionMiddleware, logout);
router.get("/me", sessionMiddleware, me);

export default router;
