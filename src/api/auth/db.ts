import { sql } from "../../lib/neon";

export const findUsuarioByEmail = async (email: string) => {
  const result = await sql`
    SELECT
      u.id,
      u.empresa_id,
      u.nome,
      u.email,
      u.senha_hash,
      u.ativo,
      e.id AS empresa_id_ref,
      e.nome AS empresa_nome
    FROM usuarios u
    JOIN empresas e ON e.id = u.empresa_id
    WHERE u.email = ${email}
    LIMIT 1
  `;

  if (result.length === 0) return null;

  const usuario = result[0] as {
    id: number;
    empresa_id: number;
    nome: string;
    email: string;
    senha_hash: string;
    ativo: boolean;
    empresa_id_ref: number;
    empresa_nome: string;
  };

  return {
    id: usuario.id,
    empresaId: usuario.empresa_id,
    nome: usuario.nome,
    email: usuario.email,
    senhaHash: usuario.senha_hash,
    ativo: usuario.ativo,
    empresa: {
      id: usuario.empresa_id_ref,
      nome: usuario.empresa_nome,
    },
  };
};
