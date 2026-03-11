import { Request, Response } from "express";
import { loginService } from "./service";
import { LoginInput } from "./types";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body as LoginInput;
    const usuario = await loginService(email, senha);

    if (!usuario) {
      res.redirect("/login");
      return;
    }

    req.session.usuario = {
      id: usuario.id,
      empresaId: usuario.empresaId,
      nome: usuario.nome,
      email: usuario.email,
    };

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      empresa: usuario.empresa,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao autenticar", details: err });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Erro ao encerrar sessão" });
      return;
    }

    res.clearCookie("oficina.sid");
    res.status(204).send();
  });
};

export const me = (req: Request, res: Response) => {
  if (req.session.usuario == null) {
    res.redirect("/login");
    return;
  }

  res.json({ usuario: req.session.usuario });
};
