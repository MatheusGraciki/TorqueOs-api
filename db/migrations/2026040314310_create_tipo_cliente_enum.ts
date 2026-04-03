import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TipoCliente')
         AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
        ALTER TYPE "TipoCliente" RENAME TO tipo_cliente;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
        CREATE TYPE tipo_cliente AS ENUM ('pessoa_fisica', 'pessoa_juridica');
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_cliente' AND e.enumlabel = 'PESSOA_FISICA'
      ) THEN
        ALTER TYPE tipo_cliente RENAME VALUE 'PESSOA_FISICA' TO 'pessoa_fisica';
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_cliente' AND e.enumlabel = 'JURIDICA'
      ) THEN
        ALTER TYPE tipo_cliente RENAME VALUE 'JURIDICA' TO 'pessoa_juridica';
      END IF;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_cliente' AND e.enumlabel = 'pessoa_fisica'
      ) THEN
        ALTER TYPE tipo_cliente RENAME VALUE 'pessoa_fisica' TO 'PESSOA_FISICA';
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_cliente' AND e.enumlabel = 'pessoa_juridica'
      ) THEN
        ALTER TYPE tipo_cliente RENAME VALUE 'pessoa_juridica' TO 'JURIDICA';
      END IF;

      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente')
         AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TipoCliente') THEN
        ALTER TYPE tipo_cliente RENAME TO "TipoCliente";
      END IF;
    END $$;
  `);
}
