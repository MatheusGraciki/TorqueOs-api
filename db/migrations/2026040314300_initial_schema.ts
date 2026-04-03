import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // This migration is kept for compatibility only.
  // Schema creation has been split into one migration per table.
  pgm.sql(`SELECT 1;`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`SELECT 1;`);
}
