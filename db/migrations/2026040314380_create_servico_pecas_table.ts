import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS servico_pecas (
      id SERIAL PRIMARY KEY,
      servico_id INTEGER NOT NULL,
      peca_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1,
      valor_unit NUMERIC(10, 2) NOT NULL
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servico_pecas' AND column_name = 'servicoId'
      ) THEN
        ALTER TABLE servico_pecas RENAME COLUMN "servicoId" TO servico_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servico_pecas' AND column_name = 'pecaId'
      ) THEN
        ALTER TABLE servico_pecas RENAME COLUMN "pecaId" TO peca_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'servico_pecas' AND column_name = 'valorUnit'
      ) THEN
        ALTER TABLE servico_pecas RENAME COLUMN "valorUnit" TO valor_unit;
      END IF;
    END $$;

    DO $$
    BEGIN
      BEGIN
        ALTER TABLE servico_pecas
          ADD CONSTRAINT servico_pecas_servico_id_fk FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE servico_pecas
          ADD CONSTRAINT servico_pecas_peca_id_fk FOREIGN KEY (peca_id) REFERENCES pecas(id);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE servico_pecas ADD CONSTRAINT servico_pecas_servico_id_peca_id_key UNIQUE (servico_id, peca_id);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE IF EXISTS servico_pecas;`);
}
