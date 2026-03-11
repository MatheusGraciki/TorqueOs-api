import prisma from "../../lib/prisma";
import { ServicoInput } from "./types";

export const getServicos = (empresaId: number) =>
  prisma.servico.findMany({
    where: { empresaId },
    orderBy: { dataServico: "desc" },
    include: {
      carro: { include: { cliente: true } },
      servicoPecas: { include: { peca: true } },
    },
  });

export const findServicoById = (id: number, empresaId: number) =>
  prisma.servico.findUnique({
    where: { id, empresaId },
    include: {
      carro: { include: { cliente: true } },
      servicoPecas: { include: { peca: true } },
    },
  });

export const createServico = (data: ServicoInput, custoPecas: number, valorTotal: number, empresaId: number) =>
  prisma.servico.create({
    data: {
      empresaId,
      carroId: data.carroId,
      descricaoServico: data.descricaoServico,
      valorHora: data.valorHora,
      horasTrabalhadas: data.horasTrabalhadas,
      custoPecas,
      valorTotal,
      dataServico: new Date(data.dataServico),
      observacoes: data.observacoes ?? "",
      servicoPecas: {
        create: (data.pecasUtilizadas ?? []).map((peca) => ({
          pecaId: peca.pecaId,
          quantidade: peca.quantidade,
          valorUnit: peca.valorUnit,
        })),
      },
    },
    include: {
      servicoPecas: { include: { peca: true } },
    },
  });

export const updateServico = async (
  id: number,
  data: ServicoInput,
  custoPecas: number,
  valorTotal: number,
  empresaId: number,
) => {
  await prisma.servicoPeca.deleteMany({ where: { servicoId: id } });

  return prisma.servico.update({
    where: { id, empresaId },
    data: {
      carroId: data.carroId,
      descricaoServico: data.descricaoServico,
      valorHora: data.valorHora,
      horasTrabalhadas: data.horasTrabalhadas,
      custoPecas,
      valorTotal,
      dataServico: new Date(data.dataServico),
      observacoes: data.observacoes ?? "",
      servicoPecas: {
        create: (data.pecasUtilizadas ?? []).map((peca) => ({
          pecaId: peca.pecaId,
          quantidade: peca.quantidade,
          valorUnit: peca.valorUnit,
        })),
      },
    },
    include: {
      servicoPecas: { include: { peca: true } },
    },
  });
};

export const deleteServico = (id: number, empresaId: number) => prisma.servico.delete({ where: { id, empresaId } });
