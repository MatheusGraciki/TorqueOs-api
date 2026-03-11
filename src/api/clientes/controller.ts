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
    const clientes = await getClientesService();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar clientes", details: err });
  }
};

export const getCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await getClienteById(parseInt(req.params.id));
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
    const cliente = await createClienteService(req.body as ClienteCreateInput);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar cliente", details: err });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await updateClienteService(parseInt(req.params.id), req.body as ClienteUpdateInput);
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar cliente", details: err });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    await deleteClienteService(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar cliente", details: err });
  }
};
