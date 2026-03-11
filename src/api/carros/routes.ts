import { Router } from "express";
import {
  createCarro,
  deleteCarro,
  getCarro,
  getCarros,
  updateCarro,
} from "./controller";

const router = Router();

router.get("/", getCarros);
router.get("/:id", getCarro);
router.post("/", createCarro);
router.put("/:id", updateCarro);
router.delete("/:id", deleteCarro);

export default router;
