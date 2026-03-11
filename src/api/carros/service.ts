import { createCarro, deleteCarro, findCarroById, getCarros as getCarrosDb, updateCarro } from "./db";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = (empresaId: number) => getCarrosDb(empresaId);

export const getCarroById = (id: number, empresaId: number) => findCarroById(id, empresaId);

export const createCarroService = (data: CarroCreateInput, empresaId: number) => createCarro(data, empresaId);

export const updateCarroService = (id: number, data: CarroUpdateInput, empresaId: number) =>
	updateCarro(id, data, empresaId);

export const deleteCarroService = (id: number, empresaId: number) => deleteCarro(id, empresaId);
