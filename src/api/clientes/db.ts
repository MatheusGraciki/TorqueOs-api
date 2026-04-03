import { sql } from "../../lib/neon";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = (empresaId: number) =>
  sql`
    SELECT
      id,
      empresa_id AS "empresaId",
      nome,
      telefone,
      email,
      tipo,
      cpf,
      cnpj,
      endereco,
      created_at AS "createdAt"
    FROM clientes
    WHERE empresa_id = ${empresaId}
    ORDER BY created_at DESC
  `;

export const findClienteById = async (id: number, empresaId: number) => {
  const rows = await sql`
    SELECT
      cl.id,
      cl.empresa_id,
      cl.nome,
      cl.telefone,
      cl.email,
      cl.tipo,
      cl.cpf,
      cl.cnpj,
      cl.endereco,
      cl.created_at,
      c.id AS carro_id,
      c.empresa_id AS carro_empresa_id,
      c.cliente_id AS carro_cliente_id,
      c.marca AS carro_marca,
      c.modelo AS carro_modelo,
      c.ano AS carro_ano,
      c.placa AS carro_placa,
      c.cor AS carro_cor,
      c.quilometragem AS carro_quilometragem,
      c.created_at AS carro_created_at
    FROM clientes cl
    LEFT JOIN carros c ON c.cliente_id = cl.id AND c.empresa_id = cl.empresa_id
    WHERE cl.id = ${id}
      AND cl.empresa_id = ${empresaId}
    ORDER BY c.created_at DESC
  `;

  if (rows.length === 0) return null;

  const first = rows[0] as Record<string, unknown>;
  const carros = rows
    .filter((row) => row.carro_id != null)
    .map((row) => ({
      id: row.carro_id,
      empresaId: row.carro_empresa_id,
      clienteId: row.carro_cliente_id,
      marca: row.carro_marca,
      modelo: row.carro_modelo,
      ano: row.carro_ano,
      placa: row.carro_placa,
      cor: row.carro_cor,
      quilometragem: row.carro_quilometragem,
      createdAt: row.carro_created_at,
    }));

  return {
    id: first.id,
    empresaId: first.empresa_id,
    nome: first.nome,
    telefone: first.telefone,
    email: first.email,
    tipo: first.tipo,
    cpf: first.cpf,
    cnpj: first.cnpj,
    endereco: first.endereco,
    createdAt: first.created_at,
    carros,
  };
};

export const createCliente = async (data: ClienteCreateInput, empresaId: number) => {
  const rows = await sql`
    INSERT INTO clientes (empresa_id, nome, telefone, email, tipo, cpf, cnpj, endereco)
    VALUES (
      ${empresaId},
      ${data.nome},
      ${data.telefone ?? ""},
      ${data.email ?? ""},
      ${data.tipo},
      ${data.tipo === "pessoa_fisica" ? (data.cpf ?? null) : null},
      ${data.tipo === "pessoa_juridica" ? (data.cnpj ?? null) : null},
      ${data.endereco ?? ""}
    )
    RETURNING
      id,
      empresa_id AS "empresaId",
      nome,
      telefone,
      email,
      tipo,
      cpf,
      cnpj,
      endereco,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const updateCliente = async (id: number, data: ClienteUpdateInput, empresaId: number) => {
  const rows = await sql`
    UPDATE clientes
    SET
      nome = COALESCE(${data.nome ?? null}, nome),
      telefone = COALESCE(${data.telefone ?? null}, telefone),
      email = COALESCE(${data.email ?? null}, email),
      tipo = COALESCE(${data.tipo ?? null}, tipo),
      endereco = COALESCE(${data.endereco ?? null}, endereco),
      cpf = CASE
        WHEN ${data.tipo === "pessoa_fisica"} THEN ${data.cpf ?? null}
        WHEN ${data.tipo === "pessoa_juridica"} THEN NULL
        WHEN ${data.cpf !== undefined} THEN ${data.cpf ?? null}
        ELSE cpf
      END,
      cnpj = CASE
        WHEN ${data.tipo === "pessoa_juridica"} THEN ${data.cnpj ?? null}
        WHEN ${data.tipo === "pessoa_fisica"} THEN NULL
        WHEN ${data.cnpj !== undefined} THEN ${data.cnpj ?? null}
        ELSE cnpj
      END
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING
      id,
      empresa_id AS "empresaId",
      nome,
      telefone,
      email,
      tipo,
      cpf,
      cnpj,
      endereco,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const deleteCliente = async (id: number, empresaId: number) => {
  const rows = await sql`
    DELETE FROM clientes
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING id
  `;

  return rows[0] ?? null;
};
