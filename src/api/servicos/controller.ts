import { Request, Response } from "express";
import {
  createServicoService,
  deleteServicoService,
  getServicoById,
  getServicos as getServicosService,
  updateServicoService,
} from "./service";
import { ServicoInput } from "./types";

export const getServicos = async (_req: Request, res: Response) => {
  try {
    const servicos = await getServicosService(_req.empresaId as number);
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar serviços", details: err });
  }
};

export const getServico = async (req: Request, res: Response) => {
  try {
    const servico = await getServicoById(Number(req.params.id), req.empresaId as number);
    if (!servico) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }
    res.json(servico);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar serviço", details: err });
  }
};

export const createServico = async (req: Request, res: Response) => {
  try {
    const servico = await createServicoService(req.body as ServicoInput, req.empresaId as number);
    res.status(201).json(servico);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar serviço", details: err });
  }
};

export const updateServico = async (req: Request, res: Response) => {
  try {
    const servico = await updateServicoService(
      Number(req.params.id),
      req.body as ServicoInput,
      req.empresaId as number,
    );
    res.json(servico);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar serviço", details: err });
  }
};

export const deleteServico = async (req: Request, res: Response) => {
  try {
    await deleteServicoService(Number(req.params.id), req.empresaId as number);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar serviço", details: err });
  }
};
