import { sql } from "../../lib/neon";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = async (empresaId: number) =>
  sql`
    SELECT
      c.id,
      c.empresa_id AS "empresaId",
      c.cliente_id AS "clienteId",
      c.marca,
      c.modelo,
      c.ano,
      c.placa,
      c.cor,
      c.quilometragem,
      c.created_at AS "createdAt",
      cl.id AS cliente_id_ref,
      cl.empresa_id AS cliente_empresa_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      cl.email AS cliente_email,
      cl.tipo AS cliente_tipo,
      cl.cpf AS cliente_cpf,
      cl.cnpj AS cliente_cnpj,
      cl.endereco AS cliente_endereco,
      cl.created_at AS cliente_created_at
    FROM carros c
    JOIN clientes cl ON cl.id = c.cliente_id AND cl.empresa_id = c.empresa_id
    WHERE c.empresa_id = ${empresaId}
    ORDER BY c.created_at DESC
  `;

export const findCarroById = async (id: number, empresaId: number) => {
  const rows = await sql`
    SELECT
      c.id,
      c.empresa_id,
      c.cliente_id,
      c.marca,
      c.modelo,
      c.ano,
      c.placa,
      c.cor,
      c.quilometragem,
      c.created_at,
      cl.id AS cliente_id_ref,
      cl.empresa_id AS cliente_empresa_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      cl.email AS cliente_email,
      cl.tipo AS cliente_tipo,
      cl.cpf AS cliente_cpf,
      cl.cnpj AS cliente_cnpj,
      cl.endereco AS cliente_endereco,
      cl.created_at AS cliente_created_at,
      s.id AS servico_id,
      s.empresa_id AS servico_empresa_id,
      s.carro_id AS servico_carro_id,
      s.descricao_servico AS servico_descricao,
      s.valor_hora AS servico_valor_hora,
      s.horas_trabalhadas AS servico_horas,
      s.custo_pecas AS servico_custo_pecas,
      s.valor_total AS servico_valor_total,
      s.data_servico AS servico_data,
      s.observacoes AS servico_observacoes,
      s.created_at AS servico_created_at
    FROM carros c
    JOIN clientes cl ON cl.id = c.cliente_id AND cl.empresa_id = c.empresa_id
    LEFT JOIN servicos s ON s.carro_id = c.id AND s.empresa_id = c.empresa_id
    WHERE c.id = ${id}
      AND c.empresa_id = ${empresaId}
    ORDER BY s.data_servico DESC
  `;

  if (rows.length === 0) return null;

  const first = rows[0] as Record<string, unknown>;
  const servicos = rows
    .filter((row) => row.servico_id != null)
    .map((row) => ({
      id: row.servico_id,
      empresaId: row.servico_empresa_id,
      carroId: row.servico_carro_id,
      descricaoServico: row.servico_descricao,
      valorHora: row.servico_valor_hora,
      horasTrabalhadas: row.servico_horas,
      custoPecas: row.servico_custo_pecas,
      valorTotal: row.servico_valor_total,
      dataServico: row.servico_data,
      observacoes: row.servico_observacoes,
      createdAt: row.servico_created_at,
    }));

  return {
    id: first.id,
    empresaId: first.empresa_id,
    clienteId: first.cliente_id,
    marca: first.marca,
    modelo: first.modelo,
    ano: first.ano,
    placa: first.placa,
    cor: first.cor,
    quilometragem: first.quilometragem,
    createdAt: first.created_at,
    cliente: {
      id: first.cliente_id_ref,
      empresaId: first.cliente_empresa_id,
      nome: first.cliente_nome,
      telefone: first.cliente_telefone,
      email: first.cliente_email,
      tipo: first.cliente_tipo,
      cpf: first.cliente_cpf,
      cnpj: first.cliente_cnpj,
      endereco: first.cliente_endereco,
      createdAt: first.cliente_created_at,
    },
    servicos,
  };
};

export const createCarro = async (data: CarroCreateInput, empresaId: number) => {
  const rows = await sql`
    INSERT INTO carros (empresa_id, cliente_id, marca, modelo, ano, placa, cor, quilometragem)
    VALUES (
      ${empresaId},
      ${data.clienteId},
      ${data.marca},
      ${data.modelo},
      ${data.ano},
      ${data.placa},
      ${data.cor},
      ${data.quilometragem ?? 0}
    )
    RETURNING
      id,
      empresa_id AS "empresaId",
      cliente_id AS "clienteId",
      marca,
      modelo,
      ano,
      placa,
      cor,
      quilometragem,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const updateCarro = async (id: number, data: CarroUpdateInput, empresaId: number) => {
  const rows = await sql`
    UPDATE carros
    SET
      cliente_id = COALESCE(${data.clienteId ?? null}, cliente_id),
      marca = COALESCE(${data.marca ?? null}, marca),
      modelo = COALESCE(${data.modelo ?? null}, modelo),
      ano = COALESCE(${data.ano ?? null}, ano),
      placa = COALESCE(${data.placa ?? null}, placa),
      cor = COALESCE(${data.cor ?? null}, cor),
      quilometragem = COALESCE(${data.quilometragem ?? null}, quilometragem)
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING
      id,
      empresa_id AS "empresaId",
      cliente_id AS "clienteId",
      marca,
      modelo,
      ano,
      placa,
      cor,
      quilometragem,
      created_at AS "createdAt"
  `;

  return rows[0] ?? null;
};

export const deleteCarro = async (id: number, empresaId: number) => {
  const rows = await sql`
    DELETE FROM carros
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING id
  `;

  return rows[0] ?? null;
};
