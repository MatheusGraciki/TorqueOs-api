import { Request, Response } from "express";
import {
  createClienteService,
  deleteClienteService,
  getClienteById,
  getClientes as getClientesService,
  updateClienteService,
} from "./service";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await getClientesService(_req.empresaId as number);
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar clientes", details: err });
  }
};

export const getCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await getClienteById(Number(req.params.id), req.empresaId as number);
    if (!cliente) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cliente", details: err });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const empresaId = req.empresaId;
    if (!Number.isInteger(empresaId) || (empresaId as number) <= 0) {
      res.redirect("/login");
      return;
    }

    const body = req.body as ClienteCreateInput;
    console.debug("[clientes.create] payload recebido", { body, empresaId });
    if (!body?.nome?.trim()) {
      res.status(400).json({ error: "Erro ao criar cliente", details: { message: "Nome é obrigatório" } });
      return;
    }

    if (!body?.tipo) {
      res.status(400).json({ error: "Erro ao criar cliente", details: { message: "Tipo é obrigatório" } });
      return;
    }

    if (!body?.endereco?.trim()) {
      res.status(400).json({ error: "Erro ao criar cliente", details: { message: "Endereço é obrigatório" } });
      return;
    }

    if (body.tipo === "pessoa_fisica" && !body?.cpf?.trim()) {
      res.status(400).json({ error: "Erro ao criar cliente", details: { message: "CPF é obrigatório para pessoa física" } });
      return;
    }

    if (body.tipo === "pessoa_juridica" && !body?.cnpj?.trim()) {
      res.status(400).json({ error: "Erro ao criar cliente", details: { message: "CNPJ é obrigatório para pessoa jurídica" } });
      return;
    }

    const cliente = await createClienteService(body, empresaId as number);
    res.status(201).json(cliente);
  } catch (err: any) {
    console.error("[clientes.create] erro", {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      clientVersion: err?.clientVersion,
      meta: err?.meta,
    });

    res.status(400).json({
      error: "Erro ao criar cliente",
      details: {
        name: err?.name,
        message: err?.message ?? String(err),
        code: err?.code,
        clientVersion: err?.clientVersion,
      },
    });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await updateClienteService(
      Number(req.params.id),
      req.body as ClienteUpdateInput,
      req.empresaId as number,
    );
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar cliente", details: err });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    await deleteClienteService(Number(req.params.id), req.empresaId as number);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar cliente", details: err });
  }
};
