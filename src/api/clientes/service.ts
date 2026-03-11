import {
  createCliente,
  deleteCliente,
  findClienteById,
  getClientes as getClientesDb,
  updateCliente,
} from "./db";
import { ClienteCreateInput, ClienteUpdateInput } from "./types";

export const getClientes = () => getClientesDb();

export const getClienteById = (id: number) => findClienteById(id);

export const createClienteService = (data: ClienteCreateInput) => createCliente(data);

export const updateClienteService = (id: number, data: ClienteUpdateInput) => updateCliente(id, data);

export const deleteClienteService = (id: number) => deleteCliente(id);
