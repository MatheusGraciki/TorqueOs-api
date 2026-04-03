import { sql } from "../../lib/neon";
import { ServicoInput } from "./types";

function mapServicos(rows: Array<Record<string, unknown>>) {
  const byId = new Map<number, Record<string, unknown>>();

  for (const row of rows) {
    const servicoId = Number(row.id);
    if (!byId.has(servicoId)) {
      byId.set(servicoId, {
        id: row.id,
        empresaId: row.empresaId,
        carroId: row.carroId,
        descricaoServico: row.descricaoServico,
        valorHora: row.valorHora,
        horasTrabalhadas: row.horasTrabalhadas,
        custoPecas: row.custoPecas,
        valorTotal: row.valorTotal,
        dataServico: row.dataServico,
        observacoes: row.observacoes,
        createdAt: row.createdAt,
        carro: {
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
          cliente: {
            id: row.cliente_id,
            empresaId: row.cliente_empresa_id,
            nome: row.cliente_nome,
            telefone: row.cliente_telefone,
            email: row.cliente_email,
            tipo: row.cliente_tipo,
            cpf: row.cliente_cpf,
            cnpj: row.cliente_cnpj,
            endereco: row.cliente_endereco,
            createdAt: row.cliente_created_at,
          },
        },
        servicoPecas: [] as Array<Record<string, unknown>>,
      });
    }

    if (row.servico_peca_id != null) {
      const servico = byId.get(servicoId) as { servicoPecas: Array<Record<string, unknown>> };
      servico.servicoPecas.push({
        id: row.servico_peca_id,
        servicoId: row.servico_peca_servico_id,
        pecaId: row.servico_peca_peca_id,
        quantidade: row.servico_peca_quantidade,
        valorUnit: row.servico_peca_valor_unit,
        peca: {
          id: row.peca_id,
          empresaId: row.peca_empresa_id,
          nome: row.peca_nome,
          valor: row.peca_valor,
          estoque: row.peca_estoque,
          createdAt: row.peca_created_at,
        },
      });
    }
  }

  return Array.from(byId.values());
}

export const getServicos = async (empresaId: number) => {
  const rows = (await sql`
    SELECT
      s.id,
      s.empresa_id AS "empresaId",
      s.carro_id AS "carroId",
      s.descricao_servico AS "descricaoServico",
      s.valor_hora AS "valorHora",
      s.horas_trabalhadas AS "horasTrabalhadas",
      s.custo_pecas AS "custoPecas",
      s.valor_total AS "valorTotal",
      s.data_servico AS "dataServico",
      s.observacoes,
      s.created_at AS "createdAt",
      c.id AS carro_id,
      c.empresa_id AS carro_empresa_id,
      c.cliente_id AS carro_cliente_id,
      c.marca AS carro_marca,
      c.modelo AS carro_modelo,
      c.ano AS carro_ano,
      c.placa AS carro_placa,
      c.cor AS carro_cor,
      c.quilometragem AS carro_quilometragem,
      c.created_at AS carro_created_at,
      cl.id AS cliente_id,
      cl.empresa_id AS cliente_empresa_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      cl.email AS cliente_email,
      cl.tipo AS cliente_tipo,
      cl.cpf AS cliente_cpf,
      cl.cnpj AS cliente_cnpj,
      cl.endereco AS cliente_endereco,
      cl.created_at AS cliente_created_at,
      sp.id AS servico_peca_id,
      sp.servico_id AS servico_peca_servico_id,
      sp.peca_id AS servico_peca_peca_id,
      sp.quantidade AS servico_peca_quantidade,
      sp.valor_unit AS servico_peca_valor_unit,
      p.id AS peca_id,
      p.empresa_id AS peca_empresa_id,
      p.nome AS peca_nome,
      p.valor AS peca_valor,
      p.estoque AS peca_estoque,
      p.created_at AS peca_created_at
    FROM servicos s
    JOIN carros c ON c.id = s.carro_id AND c.empresa_id = s.empresa_id
    JOIN clientes cl ON cl.id = c.cliente_id AND cl.empresa_id = c.empresa_id
    LEFT JOIN servico_pecas sp ON sp.servico_id = s.id
    LEFT JOIN pecas p ON p.id = sp.peca_id AND p.empresa_id = s.empresa_id
    WHERE s.empresa_id = ${empresaId}
    ORDER BY s.data_servico DESC
  `) as Array<Record<string, unknown>>;

  return mapServicos(rows);
};

export const findServicoById = async (id: number, empresaId: number) => {
  const rows = (await sql`
    SELECT
      s.id,
      s.empresa_id AS "empresaId",
      s.carro_id AS "carroId",
      s.descricao_servico AS "descricaoServico",
      s.valor_hora AS "valorHora",
      s.horas_trabalhadas AS "horasTrabalhadas",
      s.custo_pecas AS "custoPecas",
      s.valor_total AS "valorTotal",
      s.data_servico AS "dataServico",
      s.observacoes,
      s.created_at AS "createdAt",
      c.id AS carro_id,
      c.empresa_id AS carro_empresa_id,
      c.cliente_id AS carro_cliente_id,
      c.marca AS carro_marca,
      c.modelo AS carro_modelo,
      c.ano AS carro_ano,
      c.placa AS carro_placa,
      c.cor AS carro_cor,
      c.quilometragem AS carro_quilometragem,
      c.created_at AS carro_created_at,
      cl.id AS cliente_id,
      cl.empresa_id AS cliente_empresa_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      cl.email AS cliente_email,
      cl.tipo AS cliente_tipo,
      cl.cpf AS cliente_cpf,
      cl.cnpj AS cliente_cnpj,
      cl.endereco AS cliente_endereco,
      cl.created_at AS cliente_created_at,
      sp.id AS servico_peca_id,
      sp.servico_id AS servico_peca_servico_id,
      sp.peca_id AS servico_peca_peca_id,
      sp.quantidade AS servico_peca_quantidade,
      sp.valor_unit AS servico_peca_valor_unit,
      p.id AS peca_id,
      p.empresa_id AS peca_empresa_id,
      p.nome AS peca_nome,
      p.valor AS peca_valor,
      p.estoque AS peca_estoque,
      p.created_at AS peca_created_at
    FROM servicos s
    JOIN carros c ON c.id = s.carro_id AND c.empresa_id = s.empresa_id
    JOIN clientes cl ON cl.id = c.cliente_id AND cl.empresa_id = c.empresa_id
    LEFT JOIN servico_pecas sp ON sp.servico_id = s.id
    LEFT JOIN pecas p ON p.id = sp.peca_id AND p.empresa_id = s.empresa_id
    WHERE s.id = ${id}
      AND s.empresa_id = ${empresaId}
    ORDER BY s.data_servico DESC
  `) as Array<Record<string, unknown>>;

  if (rows.length === 0) return null;

  const mapped = mapServicos(rows);
  return mapped[0] ?? null;
};

export const createServico = async (data: ServicoInput, custoPecas: number, valorTotal: number, empresaId: number) => {
  const createdRows = await sql`
    INSERT INTO servicos (
      empresa_id,
      carro_id,
      descricao_servico,
      valor_hora,
      horas_trabalhadas,
      custo_pecas,
      valor_total,
      data_servico,
      observacoes
    )
    VALUES (
      ${empresaId},
      ${data.carroId},
      ${data.descricaoServico},
      ${data.valorHora},
      ${data.horasTrabalhadas},
      ${custoPecas},
      ${valorTotal},
      ${new Date(data.dataServico)},
      ${data.observacoes ?? ""}
    )
    RETURNING id
  `;

  const servicoId = Number(createdRows[0]?.id);

  for (const peca of data.pecasUtilizadas ?? []) {
    await sql`
      INSERT INTO servico_pecas (servico_id, peca_id, quantidade, valor_unit)
      VALUES (${servicoId}, ${peca.pecaId}, ${peca.quantidade}, ${peca.valorUnit})
    `;
  }

  return findServicoById(servicoId, empresaId);
};

export const updateServico = async (
  id: number,
  data: ServicoInput,
  custoPecas: number,
  valorTotal: number,
  empresaId: number,
) => {
  await sql`
    UPDATE servicos
    SET
      carro_id = ${data.carroId},
      descricao_servico = ${data.descricaoServico},
      valor_hora = ${data.valorHora},
      horas_trabalhadas = ${data.horasTrabalhadas},
      custo_pecas = ${custoPecas},
      valor_total = ${valorTotal},
      data_servico = ${new Date(data.dataServico)},
      observacoes = ${data.observacoes ?? ""}
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
  `;

  await sql`
    DELETE FROM servico_pecas
    WHERE servico_id = ${id}
  `;

  for (const peca of data.pecasUtilizadas ?? []) {
    await sql`
      INSERT INTO servico_pecas (servico_id, peca_id, quantidade, valor_unit)
      VALUES (${id}, ${peca.pecaId}, ${peca.quantidade}, ${peca.valorUnit})
    `;
  }

  return findServicoById(id, empresaId);
};

export const deleteServico = async (id: number, empresaId: number) => {
  const rows = await sql`
    DELETE FROM servicos
    WHERE id = ${id}
      AND empresa_id = ${empresaId}
    RETURNING id
  `;

  return rows[0] ?? null;
};
