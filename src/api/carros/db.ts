import prisma from "../../lib/prisma";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = () =>
  prisma.carro.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

export const findCarroById = (id: number) =>
  prisma.carro.findUnique({
    where: { id },
    include: { cliente: true, servicos: true },
  });

export const createCarro = (data: CarroCreateInput) => prisma.carro.create({ data });

export const updateCarro = (id: number, data: CarroUpdateInput) =>
  prisma.carro.update({ where: { id }, data });

export const deleteCarro = (id: number) => prisma.carro.delete({ where: { id } });
