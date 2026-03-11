import { Router } from "express";
import { sessionMiddleware } from "../../middlewares/session";
import {
  createPeca,
  deletePeca,
  getPeca,
  getPecas,
  updatePeca,
} from "./controller";

const router = Router();

router.use(sessionMiddleware);

router.get("/", getPecas);
router.get("/:id", getPeca);
router.post("/", createPeca);
router.put("/:id", updatePeca);
router.delete("/:id", deletePeca);

export default router;
