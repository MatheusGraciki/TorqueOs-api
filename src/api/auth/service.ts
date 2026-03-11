import { findUsuarioByEmail } from "./db";
import { comparePassword } from "../../core/crypto";

export const loginService = async (email: string, senha: string) => {
  const usuario = await findUsuarioByEmail(email);
  if (!usuario || !usuario.ativo) {
    return null;
  }

  const senhaValida = comparePassword(senha, usuario.senhaHash);
  if (!senhaValida) {
    return null;
  }

  return {
    id: usuario.id,
    empresaId: usuario.empresaId,
    nome: usuario.nome,
    email: usuario.email,
    empresa: {
      id: usuario.empresa.id,
      nome: usuario.empresa.nome,
    },
  };
};
