import { Request, Response } from "express";
import {
  createCarroService,
  deleteCarroService,
  getCarroById,
  getCarros as getCarrosService,
  updateCarroService,
} from "./service";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = async (_req: Request, res: Response) => {
  try {
    const carros = await getCarrosService(_req.empresaId as number);
    res.json(carros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar carros", details: err });
  }
};

export const getCarro = async (req: Request, res: Response) => {
  try {
    const carroId = Number(req.params.id);
    const carro = await getCarroById(carroId, req.empresaId as number);
    if (!carro) {
      res.status(404).json({ error: "Carro não encontrado" });
      return;
    }
    res.json(carro);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar carro", details: err });
  }
};

export const createCarro = async (req: Request, res: Response) => {
  try {
    const carro = await createCarroService(req.body as CarroCreateInput, req.empresaId as number);
    res.status(201).json(carro);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar carro", details: err });
  }
};

export const updateCarro = async (req: Request, res: Response) => {
  try {
    const carroId = Number(req.params.id);
    const carro = await updateCarroService(
      carroId,
      req.body as CarroUpdateInput,
      req.empresaId as number,
    );
    res.json(carro);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar carro", details: err });
  }
};

export const deleteCarro = async (req: Request, res: Response) => {
  try {
    const carroId = Number(req.params.id);
    await deleteCarroService(carroId, req.empresaId as number);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar carro", details: err });
  }
};
