import prisma from "../../lib/prisma";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = () =>
  prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
  });

export const findClienteById = (id: number) =>
  prisma.cliente.findUnique({
    where: { id },
    include: { carros: true },
  });

export const createCliente = (data: ClienteCreateInput) => prisma.cliente.create({ data });

export const updateCliente = (id: number, data: ClienteUpdateInput) =>
  prisma.cliente.update({ where: { id }, data });

export const deleteCliente = (id: number) => prisma.cliente.delete({ where: { id } });
