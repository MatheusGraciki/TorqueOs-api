import prisma from "../../lib/prisma";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = () =>
  prisma.peca.findMany({
    orderBy: { nome: "asc" },
  });

export const findPecaById = (id: number) =>
  prisma.peca.findUnique({
    where: { id },
  });

export const createPeca = (data: PecaCreateInput) => prisma.peca.create({ data });

export const updatePeca = (id: number, data: PecaUpdateInput) =>
  prisma.peca.update({ where: { id }, data });

export const deletePeca = (id: number) => prisma.peca.delete({ where: { id } });
