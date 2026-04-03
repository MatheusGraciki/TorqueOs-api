import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS servicos (
      id SERIAL PRIMARY KEY,
      empresa_id INTEGER NOT NULL,
      carro_id INTEGER NOT NULL,
      descricao_servico TEXT NOT NULL,
      valor_hora NUMERIC(10, 2) NOT NULL,
      horas_trabalhadas NUMERIC(10, 2) NOT NULL,
      custo_pecas NUMERIC(10, 2) NOT NULL DEFAULT 0,
      valor_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
      data_servico TIMESTAMP NOT NULL,
      observacoes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'empresaId'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "empresaId" TO empresa_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'carroId'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "carroId" TO carro_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'descricaoServico'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "descricaoServico" TO descricao_servico;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'valorHora'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "valorHora" TO valor_hora;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'horasTrabalhadas'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "horasTrabalhadas" TO horas_trabalhadas;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'custoPecas'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "custoPecas" TO custo_pecas;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'valorTotal'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "valorTotal" TO valor_total;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'dataServico'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "dataServico" TO data_servico;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servicos' AND column_name = 'createdAt'
      ) THEN
        ALTER TABLE servicos RENAME COLUMN "createdAt" TO created_at;
      END IF;
    END $$;

    DO $$
    BEGIN
      BEGIN
        ALTER TABLE servicos
          ADD CONSTRAINT servicos_empresa_id_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE servicos
          ADD CONSTRAINT servicos_carro_id_fk FOREIGN KEY (carro_id) REFERENCES carros(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE IF EXISTS servicos;`);
}
