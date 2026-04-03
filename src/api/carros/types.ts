export type CarroCreateInput = {
	clienteId: number;
	marca: string;
	modelo: string;
	ano: number;
	placa: string;
	cor: string;
	quilometragem?: number;
};

export type CarroUpdateInput = Partial<CarroCreateInput>;
