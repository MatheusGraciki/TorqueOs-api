import "express-session";

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: number;
      empresaId: number;
      nome: string;
      email: string;
    };
    last_activity?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
      empresaId?: number;
    }
  }
}

export {};
