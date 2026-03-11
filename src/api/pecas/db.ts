import prisma from "../../lib/prisma";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = (empresaId: number) =>
  prisma.peca.findMany({
    where: { empresaId },
    orderBy: { nome: "asc" },
  });

export const findPecaById = (id: number, empresaId: number) =>
  prisma.peca.findUnique({
    where: { id, empresaId },
  });

export const createPeca = (data: PecaCreateInput, empresaId: number) =>
  prisma.peca.create({ data: { ...data, empresaId } });

export const updatePeca = (id: number, data: PecaUpdateInput, empresaId: number) =>
  prisma.peca.update({ where: { id, empresaId }, data });

export const deletePeca = (id: number, empresaId: number) => prisma.peca.delete({ where: { id, empresaId } });
