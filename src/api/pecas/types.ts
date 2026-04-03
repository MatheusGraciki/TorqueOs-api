export type PecaCreateInput = {
	nome: string;
	valor: number;
	estoque?: number;
};

export type PecaUpdateInput = Partial<PecaCreateInput>;
