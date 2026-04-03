export type TipoCliente = "pessoa_fisica" | "pessoa_juridica";

export type ClienteCreateInput = {
  empresaId?: number;
  nome: string;
  telefone: string;
  email: string;
  tipo: TipoCliente;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
};

export type ClienteUpdateInput = Partial<ClienteCreateInput>;
