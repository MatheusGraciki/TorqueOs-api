import prisma from "../../lib/prisma";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = (empresaId: number) =>
  prisma.cliente.findMany({
    where: { empresaId },
    orderBy: { createdAt: "desc" },
  });

export const findClienteById = (id: number, empresaId: number) =>
  prisma.cliente.findUnique({
    where: { id, empresaId },
    include: { carros: true },
  });

export const createCliente = (data: ClienteCreateInput, empresaId: number) =>
  prisma.cliente.create({
    data: {
      empresaId,
      nome: data.nome,
      telefone: data.telefone ?? "",
      email: data.email ?? "",
      tipo: data.tipo,
      cpf: data.tipo === "PESSOA_FISICA" ? (data.cpf ?? null) : null,
      cnpj: data.tipo === "JURIDICA" ? (data.cnpj ?? null) : null,
      endereco: data.endereco ?? "",
    },
  });

export const updateCliente = (id: number, data: ClienteUpdateInput, empresaId: number) =>
  prisma.cliente.update({
    where: { id, empresaId },
    data: {
      ...(data.nome != null ? { nome: data.nome } : {}),
      ...(data.telefone != null ? { telefone: data.telefone } : {}),
      ...(data.email != null ? { email: data.email } : {}),
      ...(data.tipo != null ? { tipo: data.tipo } : {}),
      ...(data.endereco != null ? { endereco: data.endereco } : {}),
      ...(data.tipo === "PESSOA_FISICA"
        ? { cpf: data.cpf ?? null, cnpj: null }
        : data.tipo === "JURIDICA"
          ? { cnpj: data.cnpj ?? null, cpf: null }
          : {
              ...(data.cpf !== undefined ? { cpf: data.cpf } : {}),
              ...(data.cnpj !== undefined ? { cnpj: data.cnpj } : {}),
            }),
    },
  });

export const deleteCliente = (id: number, empresaId: number) => prisma.cliente.delete({ where: { id, empresaId } });
