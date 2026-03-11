import { Router } from "express";
import { sessionMiddleware } from "../../middlewares/session";
import {
  createServico,
  deleteServico,
  getServico,
  getServicos,
  updateServico,
} from "./controller";

const router = Router();

router.use(sessionMiddleware);

router.get("/", getServicos);
router.get("/:id", getServico);
router.post("/", createServico);
router.put("/:id", updateServico);
router.delete("/:id", deleteServico);

export default router;
