import { Request, Response } from "express";
import { loginService } from "./service";
import { LoginInput } from "./types";
import {
  assertLoginIsNotBlocked,
  registerLoginFailure,
  clearLoginFailures,
  LoginBlockedError,
} from "../../middlewares/loginRateLimit";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body as LoginInput;
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const identity = { ip, email };

    try {
      await assertLoginIsNotBlocked(identity);
    } catch (e) {
      if (e instanceof LoginBlockedError) {
        return res.status(429).json({
          error: "Muitas tentativas, tente novamente depois.",
          retryAfterSeconds: e.retry_after_seconds,
        });
      }

      console.error("Rate limit check error:", e);
      return res.status(429).json({ error: "Muitas tentativas, tente novamente depois." });
    }

    const usuario = await loginService(email, senha);

    if (!usuario) {
      try {
        await registerLoginFailure(identity);
      } catch (e) {
        if (e instanceof LoginBlockedError) {
          return res.status(429).json({
            error: "Muitas tentativas, tente novamente depois.",
            retryAfterSeconds: e.retry_after_seconds,
          });
        }

        console.error("Rate limit register failure error:", e);
        return res.status(429).json({ error: "Muitas tentativas, tente novamente depois." });
      }

      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    await clearLoginFailures(identity);

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
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao autenticar", details: err instanceof Error ? err.message : err });
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
    res.status(401).json({ error: "Nao autenticado" });
    return;
  }

  res.json({ usuario: req.session.usuario });
};
