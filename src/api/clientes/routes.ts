import { Router } from "express";
import { sessionMiddleware } from "../../middlewares/session";
import {
  createCliente,
  deleteCliente,
  getCliente,
  getClientes,
  updateCliente,
} from "./controller";

const router = Router();

router.use(sessionMiddleware);

router.get("/", getClientes);
router.get("/:id", getCliente);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
