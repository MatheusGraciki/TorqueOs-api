import { sql } from "../../lib/neon";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = (empresaId: number) =>
  sql`
    SELECT
      id,
      empresa_id AS "empresaId",
      nome,
      valor,
      estoque,
      created_at AS "createdAt"
    FROM pecas
    WHERE empresa_id = ${empresaId}
    ORDER BY nome ASC
  `;

export const findPecaById = async (id: number, empresaId: number) => {
  const rows = await sql`
    SELECT
      id,
      empresa_id AS "empresaId",
      nome,
      valor,
      estoque,
      created_at AS "createdAt"
    FROM pecas
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    LIMIT 1
  `;

  return rows[0] ?? null;
};

export const createPeca = async (data: PecaCreateInput, empresaId: number) => {
  const rows = await sql`
    INSERT INTO pecas (empresa_id, nome, valor, estoque)
    VALUES (${empresaId}, ${data.nome}, ${data.valor}, ${data.estoque ?? 0})
    RETURNING
      id,
      empresa_id AS "empresaId",
      nome,
      valor,
      estoque,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const updatePeca = async (id: number, data: PecaUpdateInput, empresaId: number) => {
  const rows = await sql`
    UPDATE pecas
    SET
      nome = COALESCE(${data.nome ?? null}, nome),
      valor = COALESCE(${data.valor ?? null}, valor),
      estoque = COALESCE(${data.estoque ?? null}, estoque)
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING
      id,
      empresa_id AS "empresaId",
      nome,
      valor,
      estoque,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const deletePeca = async (id: number, empresaId: number) => {
  const rows = await sql`
    DELETE FROM pecas
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING id
  `;

  return rows[0] ?? null;
};
