import prisma from "../../lib/prisma";
import { ServicoInput } from "./types";

export const getServicos = () =>
  prisma.servico.findMany({
    orderBy: { dataServico: "desc" },
    include: {
      carro: { include: { cliente: true } },
      servicoPecas: { include: { peca: true } },
    },
  });

export const findServicoById = (id: number) =>
  prisma.servico.findUnique({
    where: { id },
    include: {
      carro: { include: { cliente: true } },
      servicoPecas: { include: { peca: true } },
    },
  });

export const createServico = (data: ServicoInput, custoPecas: number, valorTotal: number) =>
  prisma.servico.create({
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

export const updateServico = async (id: number, data: ServicoInput, custoPecas: number, valorTotal: number) => {
  await prisma.servicoPeca.deleteMany({ where: { servicoId: id } });

  return prisma.servico.update({
    where: { id },
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

export const deleteServico = (id: number) => prisma.servico.delete({ where: { id } });
