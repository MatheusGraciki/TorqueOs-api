export type ServicoPecaInput = {
  pecaId: number;
  quantidade: number;
  valorUnit: number;
};

export type ServicoInput = {
  empresaId?: number;
  carroId: number;
  descricaoServico: string;
  valorHora: number;
  horasTrabalhadas: number;
  dataServico: string;
  observacoes?: string;
  pecasUtilizadas?: ServicoPecaInput[];
};
