import { Router, type Request, type Response } from "express";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROUTE_FILE_NAMES = new Set(["routes.ts", "routes.js"]);

type RouteExport = {
  default?: unknown;
};

function isRouterCandidate(value: unknown): value is Router {
  if (typeof value !== "function" || value === null) {
    return false;
  }

  const maybeRouter = value as unknown as { use?: unknown; stack?: unknown };
  return typeof maybeRouter.use === "function" && Array.isArray(maybeRouter.stack);
}

async function collectRouteFiles(baseDir: string): Promise<string[]> {
  const entries = await readdir(baseDir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(baseDir, entry.name);

      if (entry.isDirectory()) {
        return collectRouteFiles(fullPath);
      }

      if (entry.isFile() && ROUTE_FILE_NAMES.has(entry.name)) {
        return [fullPath];
      }

      return [] as string[];
    }),
  );

  return nested.flat();
}

function toRoutePrefix(apiDir: string, filePath: string): string {
  const relativeDir = path.relative(apiDir, path.dirname(filePath));
  const normalized = relativeDir.split(path.sep).join("/").trim();

  if (!normalized) {
    return "/";
  }

  return `/${normalized}`;
}

export async function loadRoutes(): Promise<Router> {
  const router = Router();
  const apiDir = path.resolve(__dirname, "..", "api");
  const startedAt = Date.now();

  try {
    const routeFiles = await collectRouteFiles(apiDir);

    routeFiles.sort((a, b) => {
      const depthA = a.split(path.sep).length;
      const depthB = b.split(path.sep).length;

      if (depthA !== depthB) {
        return depthA - depthB;
      }

      return a.localeCompare(b);
    });

    for (const routeFile of routeFiles) {
      try {
        const moduleUrl = pathToFileURL(routeFile).href;
        const loaded = (await import(moduleUrl)) as RouteExport;
        const routeModule = loaded.default;

        if (!isRouterCandidate(routeModule)) {
          console.warn(`[routes] Ignorado: ${routeFile} (export default não é Router)`);
          continue;
        }

        const routePrefix = toRoutePrefix(apiDir, routeFile);
        router.use(routePrefix, routeModule);
      } catch (error) {
        console.error(`[routes] Falha ao carregar ${routeFile}`, error);
      }
    }

    if (process.env.DEBUG === "true") {
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
      console.debug(`[routes] carregadas em ${elapsed}s`);
    }
  } catch (error) {
    console.error("[routes] Não foi possível varrer diretório de rotas", error);
  }

  router.use((_req: Request, res: Response) => {
    res.sendStatus(404);
  });

  return router;
}
