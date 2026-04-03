import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS carros (
      id SERIAL PRIMARY KEY,
      empresa_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      placa TEXT NOT NULL,
      cor TEXT NOT NULL,
      quilometragem INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'carros' AND column_name = 'empresaId'
      ) THEN
        ALTER TABLE carros RENAME COLUMN "empresaId" TO empresa_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'carros' AND column_name = 'clienteId'
      ) THEN
        ALTER TABLE carros RENAME COLUMN "clienteId" TO cliente_id;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'carros' AND column_name = 'createdAt'
      ) THEN
        ALTER TABLE carros RENAME COLUMN "createdAt" TO created_at;
      END IF;
    END $$;

    DO $$
    BEGIN
      BEGIN
        ALTER TABLE carros
          ADD CONSTRAINT carros_empresa_id_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE carros
          ADD CONSTRAINT carros_cliente_id_fk FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;

      BEGIN
        ALTER TABLE carros ADD CONSTRAINT carros_empresa_id_placa_key UNIQUE (empresa_id, placa);
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE IF EXISTS carros;`);
}
