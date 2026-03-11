import {
  createCliente,
  deleteCliente,
  findClienteById,
  getClientes as getClientesDb,
  updateCliente,
} from "./db";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = (empresaId: number) => getClientesDb(empresaId);

export const getClienteById = (id: number, empresaId: number) => findClienteById(id, empresaId);

export const createClienteService = (data: ClienteCreateInput, empresaId: number) => createCliente(data, empresaId);

export const updateClienteService = (id: number, data: ClienteUpdateInput, empresaId: number) =>
  updateCliente(id, data, empresaId);

export const deleteClienteService = (id: number, empresaId: number) => deleteCliente(id, empresaId);
