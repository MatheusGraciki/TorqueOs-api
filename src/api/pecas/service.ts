import { createPeca, deletePeca, findPecaById, getPecas as getPecasDb, updatePeca } from "./db";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = () => getPecasDb();

export const getPecaById = (id: number) => findPecaById(id);

export const createPecaService = (data: PecaCreateInput) => createPeca(data);

export const updatePecaService = (id: number, data: PecaUpdateInput) => updatePeca(id, data);

export const deletePecaService = (id: number) => deletePeca(id);
