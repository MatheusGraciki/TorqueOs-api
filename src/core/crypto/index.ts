import { compareSync, hashSync } from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 14;

export function hashPassword(password: string): string {
  return hashSync(password, PASSWORD_SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}
