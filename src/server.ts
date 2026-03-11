import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadRoutes } from "./server/loadRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;

async function bootstrap(): Promise<void> {
  app.use(cors());
  app.use(express.json());

  const routes = await loadRoutes();
  app.use("/api", routes);

  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Oficina API running" });
  });

  app.listen(PORT, () => {
    console.log(`✅  Servidor rodando em http://localhost:${PORT}`);
  });
}

void bootstrap();
