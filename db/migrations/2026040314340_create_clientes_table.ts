import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT NOT NULL,
      tipo tipo_cliente NOT NULL,
      cpf TEXT,
      cnpj TEXT,
      endereco TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'clientes' AND column_name = 'empresaId'
      ) THEN
        ALTER TABLE clientes RENAME COLUMN "empresaId" TO empresa_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'clientes' AND column_name = 'createdAt'
      ) THEN
        ALTER TABLE clientes RENAME COLUMN "createdAt" TO created_at;
      END IF;
    END $$;

    DO $$
    BEGIN
      BEGIN
        ALTER TABLE clientes
          ADD CONSTRAINT clientes_empresa_id_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE clientes ADD CONSTRAINT clientes_empresa_id_cpf_key UNIQUE (empresa_id, cpf);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE clientes ADD CONSTRAINT clientes_empresa_id_cnpj_key UNIQUE (empresa_id, cnpj);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE IF EXISTS clientes;`);
}
