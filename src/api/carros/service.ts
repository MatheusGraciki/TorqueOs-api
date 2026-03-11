import { createCarro, deleteCarro, findCarroById, getCarros as getCarrosDb, updateCarro } from "./db";
import { CarroCreateInput, CarroUpdateInput } from "./types";

export const getCarros = () => getCarrosDb();

export const getCarroById = (id: number) => findCarroById(id);

export const createCarroService = (data: CarroCreateInput) => createCarro(data);

export const updateCarroService = (id: number, data: CarroUpdateInput) => updateCarro(id, data);

export const deleteCarroService = (id: number) => deleteCarro(id);
