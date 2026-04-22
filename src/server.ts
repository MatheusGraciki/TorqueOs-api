import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import path from "node:path";
import { loadRoutes } from "./server/loadRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3333;
const webDir = path.resolve(__dirname, "web");

async function bootstrap(): Promise<void> {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:8080",
      credentials: true,
    }),
  );
  app.use(express.json());
  // Redis session store
  const { redis } = await import('./lib/redis');
  const { RedisStore } = await import('connect-redis');
  const sessionSerializer = {
    stringify: JSON.stringify,
    parse: (value: unknown) => {
      if (typeof value === "string") {
        return JSON.parse(value);
      }

      return value;
    },
  };

  app.use(
    session({
      store: new RedisStore({ client: redis, serializer: sessionSerializer }),
      name: "oficina.sid",
      secret: process.env.SESSION_SECRET ?? "oficina-dev-secret",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 3,
      },
    })
  );

  const apiRouter = await loadRoutes();
  app.use("/api", apiRouter);

  app.get("/login", (req, res) => {
    if (req.session.usuario != null) {
      res.redirect("/");
      return;
    }

    res.sendFile(path.join(webDir, "login.html"));
  });

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    if (req.path === "/login") {
      next();
      return;
    }

    if (req.session.usuario == null) {
      res.redirect("/login");
      return;
    }

    next();
  });

  app.get("/", (_req, res) => {
    res.sendFile(path.join(webDir, "index.html"));
  });

  app.get("/*path", (req, res) => {
    if (req.session.usuario == null) {
      res.redirect("/login");
      return;
    }
    res.sendFile(path.join(webDir, "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`✅  Servidor rodando em http://localhost:${PORT}`);
  });
}

void bootstrap();
