import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      ativo BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'usuarios' AND column_name = 'createdAt'
      ) THEN
        ALTER TABLE usuarios RENAME COLUMN "createdAt" TO created_at;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'usuarios' AND column_name = 'password'
      ) THEN
        ALTER TABLE usuarios RENAME COLUMN password TO senha_hash;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'usuarios' AND column_name = 'senhaHash'
      ) THEN
        ALTER TABLE usuarios RENAME COLUMN "senhaHash" TO senha_hash;
      END IF;
    END $$;

    DO $$
    BEGIN
      BEGIN
        ALTER TABLE usuarios
          ADD CONSTRAINT usuarios_empresa_id_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END;
    END $$;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE IF EXISTS usuarios;`);
}
