import { createPeca, deletePeca, findPecaById, getPecas as getPecasDb, updatePeca } from "./db";
import { PecaCreateInput, PecaUpdateInput } from "./types";

export const getPecas = (empresaId: number) => getPecasDb(empresaId);

export const getPecaById = (id: number, empresaId: number) => findPecaById(id, empresaId);

export const createPecaService = (data: PecaCreateInput, empresaId: number) => createPeca(data, empresaId);

export const updatePecaService = (id: number, data: PecaUpdateInput, empresaId: number) =>
	updatePeca(id, data, empresaId);

export const deletePecaService = (id: number, empresaId: number) => deletePeca(id, empresaId);
