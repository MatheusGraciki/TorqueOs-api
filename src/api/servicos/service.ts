import {
  createServico,
  deleteServico,
  findServicoById,
  getServicos as getServicosDb,
  updateServico,
} from "./db";
import { ServicoInput } from "./types";

const calcularCustoPecas = (pecasUtilizadas: ServicoInput["pecasUtilizadas"] = []) =>
  pecasUtilizadas.reduce((acc, peca) => acc + peca.quantidade * peca.valorUnit, 0);

export const getServicos = (empresaId: number) => getServicosDb(empresaId);

export const getServicoById = (id: number, empresaId: number) => findServicoById(id, empresaId);

export const createServicoService = (data: ServicoInput, empresaId: number) => {
  const custoPecas = calcularCustoPecas(data.pecasUtilizadas);
  const valorTotal = data.valorHora * data.horasTrabalhadas + custoPecas;
  return createServico(data, custoPecas, valorTotal, empresaId);
};

export const updateServicoService = (id: number, data: ServicoInput, empresaId: number) => {
  const custoPecas = calcularCustoPecas(data.pecasUtilizadas);
  const valorTotal = data.valorHora * data.horasTrabalhadas + custoPecas;
  return updateServico(id, data, custoPecas, valorTotal, empresaId);
};

export const deleteServicoService = (id: number, empresaId: number) => deleteServico(id, empresaId);
