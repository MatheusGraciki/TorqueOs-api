import prisma from "../../lib/prisma";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = (empresaId: number) =>
  prisma.carro.findMany({
    where: { empresaId },
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

export const findCarroById = (id: number, empresaId: number) =>
  prisma.carro.findUnique({
    where: { id, empresaId },
    include: { cliente: true, servicos: true },
  });

export const createCarro = (data: CarroCreateInput, empresaId: number) =>
  prisma.carro.create({ data: { ...data, empresaId } });

export const updateCarro = (id: number, data: CarroUpdateInput, empresaId: number) =>
  prisma.carro.update({ where: { id, empresaId }, data });

export const deleteCarro = (id: number, empresaId: number) => prisma.carro.delete({ where: { id, empresaId } });
