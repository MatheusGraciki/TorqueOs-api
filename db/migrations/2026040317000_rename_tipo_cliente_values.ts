import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname IN ('tipo_cliente', 'TipoCliente') AND e.enumlabel = 'PESSOA_FISICA'
      ) THEN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
          ALTER TYPE tipo_cliente RENAME VALUE 'PESSOA_FISICA' TO 'pessoa_fisica';
        ELSE
          ALTER TYPE "TipoCliente" RENAME VALUE 'PESSOA_FISICA' TO 'pessoa_fisica';
        END IF;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname IN ('tipo_cliente', 'TipoCliente') AND e.enumlabel = 'JURIDICA'
      ) THEN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
          ALTER TYPE tipo_cliente RENAME VALUE 'JURIDICA' TO 'pessoa_juridica';
        ELSE
          ALTER TYPE "TipoCliente" RENAME VALUE 'JURIDICA' TO 'pessoa_juridica';
        END IF;
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
        WHERE t.typname IN ('tipo_cliente', 'TipoCliente') AND e.enumlabel = 'pessoa_fisica'
      ) THEN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
          ALTER TYPE tipo_cliente RENAME VALUE 'pessoa_fisica' TO 'PESSOA_FISICA';
        ELSE
          ALTER TYPE "TipoCliente" RENAME VALUE 'pessoa_fisica' TO 'PESSOA_FISICA';
        END IF;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname IN ('tipo_cliente', 'TipoCliente') AND e.enumlabel = 'pessoa_juridica'
      ) THEN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_cliente') THEN
          ALTER TYPE tipo_cliente RENAME VALUE 'pessoa_juridica' TO 'JURIDICA';
        ELSE
          ALTER TYPE "TipoCliente" RENAME VALUE 'pessoa_juridica' TO 'JURIDICA';
        END IF;
      END IF;
    END $$;
  `);
}
