import { Request, Response } from "express";
import {
  createPecaService,
  deletePecaService,
  getPecaById,
  getPecas as getPecasService,
  updatePecaService,
} from "./service";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = async (_req: Request, res: Response) => {
  try {
    const pecas = await getPecasService();
    res.json(pecas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar peças", details: err });
  }
};

export const getPeca = async (req: Request, res: Response) => {
  try {
    const peca = await getPecaById(parseInt(req.params.id));
    if (!peca) {
      res.status(404).json({ error: "Peça não encontrada" });
      return;
    }
    res.json(peca);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar peça", details: err });
  }
};

export const createPeca = async (req: Request, res: Response) => {
  try {
    const peca = await createPecaService(req.body as PecaCreateInput);
    res.status(201).json(peca);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar peça", details: err });
  }
};

export const updatePeca = async (req: Request, res: Response) => {
  try {
    const peca = await updatePecaService(parseInt(req.params.id), req.body as PecaUpdateInput);
    res.json(peca);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar peça", details: err });
  }
};

export const deletePeca = async (req: Request, res: Response) => {
  try {
    await deletePecaService(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar peça", details: err });
  }
};
