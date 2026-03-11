import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "./api";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", apiRouter);

// Health-check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Oficina API running" });
});

app.listen(PORT, () => {
  console.log(`✅  Servidor rodando em http://localhost:${PORT}`);
});
