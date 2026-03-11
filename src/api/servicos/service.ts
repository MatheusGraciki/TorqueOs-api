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

export const getServicos = () => getServicosDb();

export const getServicoById = (id: number) => findServicoById(id);

export const createServicoService = (data: ServicoInput) => {
  const custoPecas = calcularCustoPecas(data.pecasUtilizadas);
  const valorTotal = data.valorHora * data.horasTrabalhadas + custoPecas;
  return createServico(data, custoPecas, valorTotal);
};

export const updateServicoService = (id: number, data: ServicoInput) => {
  const custoPecas = calcularCustoPecas(data.pecasUtilizadas);
  const valorTotal = data.valorHora * data.horasTrabalhadas + custoPecas;
  return updateServico(id, data, custoPecas, valorTotal);
};

export const deleteServicoService = (id: number) => deleteServico(id);
