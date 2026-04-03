import "dotenv/config";
import { sql } from "../src/lib/neon";
import { hashPassword } from "../src/core/crypto";

async function main() {
  const empresaNome = process.env.SEED_EMPRESA_NOME ?? "Empresa Padrao";
  const usuarioNome = process.env.SEED_USUARIO_NOME ?? "Administrador";
  const usuarioEmail = process.env.SEED_USUARIO_EMAIL ?? "admin@oficina.com";
  const usuarioSenha = process.env.SEED_USUARIO_SENHA ?? "123456";

  const empresaRows = await sql`
    INSERT INTO empresas (nome)
    VALUES (${empresaNome})
    RETURNING id, nome
  `;

  const empresa = empresaRows[0] as { id: number; nome: string };
  const senhaHash = hashPassword(usuarioSenha);

  const usuarioRows = await sql`
    INSERT INTO usuarios (empresa_id, nome, email, senha_hash, ativo)
    VALUES (${empresa.id}, ${usuarioNome}, ${usuarioEmail}, ${senhaHash}, true)
    ON CONFLICT (email)
    DO UPDATE SET
      empresa_id = EXCLUDED.empresa_id,
      nome = EXCLUDED.nome,
      senha_hash = EXCLUDED.senha_hash,
      ativo = true
    RETURNING id, email, empresa_id
  `;

  const usuario = usuarioRows[0] as { id: number; email: string; empresa_id: number };

  console.log("Empresa criada:", empresa);
  console.log("Usuario pronto:", {
    id: usuario.id,
    email: usuario.email,
    empresaId: usuario.empresa_id,
  });
}

main().catch((error) => {
  console.error("Erro ao executar seed:", error);
  process.exit(1);
});
