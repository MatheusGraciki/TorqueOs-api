import { Router } from "express";
import {
  createServico,
  deleteServico,
  getServico,
  getServicos,
  updateServico,
} from "./controller";

const router = Router();

router.get("/", getServicos);
router.get("/:id", getServico);
router.post("/", createServico);
router.put("/:id", updateServico);
router.delete("/:id", deleteServico);

export default router;
