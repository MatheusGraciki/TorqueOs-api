import "dotenv/config";
import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/core/crypto";

async function main() {
  const empresaNome = process.env.SEED_EMPRESA_NOME ?? "Empresa Padrão";
  const usuarioNome = process.env.SEED_USUARIO_NOME ?? "Administrador";
  const usuarioEmail = process.env.SEED_USUARIO_EMAIL ?? "admin@oficina.com";
  const usuarioSenha = process.env.SEED_USUARIO_SENHA ?? "123456";

  const empresa = await prisma.empresa.create({
    data: { nome: empresaNome },
  });

  const senhaHash = hashPassword(usuarioSenha);

  const usuario = await prisma.usuario.upsert({
    where: { email: usuarioEmail },
    update: {
      nome: usuarioNome,
      senhaHash,
      ativo: true,
      empresaId: empresa.id,
    },
    create: {
      nome: usuarioNome,
      email: usuarioEmail,
      senhaHash,
      ativo: true,
      empresaId: empresa.id,
    },
  });

  console.log("Empresa criada:", empresa);
  console.log("Usuário pronto:", {
    id: usuario.id,
    email: usuario.email,
    empresaId: usuario.empresaId,
  });
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
