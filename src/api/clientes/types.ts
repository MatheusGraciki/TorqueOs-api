export type TipoCliente = "PESSOA_FISICA" | "JURIDICA";

export type ClienteCreateInput = {
  nome: string;
  telefone: string;
  email: string;
  tipo: TipoCliente;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
};

export type ClienteUpdateInput = Partial<ClienteCreateInput>;
