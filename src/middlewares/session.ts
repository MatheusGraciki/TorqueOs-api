import type { NextFunction, Request, Response } from "express";

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const usuario = req.session.usuario;

  if (usuario == null) {
    res.redirect("/login");
    return;
  }

  const usuarioIdValido = Number.isInteger(usuario.id) && usuario.id > 0;
  const empresaIdValido = Number.isInteger(usuario.empresaId) && usuario.empresaId > 0;

  if (!usuarioIdValido || !empresaIdValido) {
    req.session.destroy(() => {
      res.clearCookie("oficina.sid");
      res.redirect("/login");
    });
    return;
  }

  req.usuarioId = usuario.id;
  req.empresaId = usuario.empresaId;
  req.session.last_activity = Date.now();

  next();
}
