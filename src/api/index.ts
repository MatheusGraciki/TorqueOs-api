import { Router } from "express";

import clientesRouter from "./clientes/routes";
import carrosRouter from "./carros/routes";
import servicosRouter from "./servicos/routes";
import pecasRouter from "./pecas/routes";

const apiRouter = Router();

apiRouter.use("/clientes", clientesRouter);
apiRouter.use("/carros", carrosRouter);
apiRouter.use("/servicos", servicosRouter);
apiRouter.use("/pecas", pecasRouter);

export default apiRouter;
