import prisma from "../../lib/prisma";

export const findUsuarioByEmail = (email: string) =>
  prisma.usuario.findUnique({
    where: { email },
    include: { empresa: true },
  });
