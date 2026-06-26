# Backend — Task 3: Configuração do Better Auth

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-backend/`
- **SEM GIT**.
- Use **Node 22 via nvm**: comece blocos shell com
  `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- better-auth 1.6.20, Prisma 6.19.3 já instalados. As tabelas `user/session/account/verification`
  já existem no banco (migração já aplicada). NÃO altere `.env`, `prisma/schema.prisma` nem o banco
  sem necessidade comprovada.

## Objetivo
Criar a configuração do Better Auth (servidor) usando o adaptador Prisma, com login por
e-mail e senha.

## Passo 1: Criar `src/lib/auth.ts`
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:3000"],
});
```

Nota: o `src/lib/prisma.ts` é `import { PrismaClient } from "@prisma/client"; export const prisma = new PrismaClient();` (Prisma 6, runtime lê `url=env()` do schema). Não mude isso.

## Passo 2: Conferir compatibilidade do schema com o Better Auth
Rode:
```bash
npx @better-auth/cli generate
```
Esse comando inspeciona a config e compara com o schema Prisma esperado.
- Se ele disser que o schema está compatível (ou não sugerir mudanças), ótimo.
- Se sugerir adicionar/alterar campos, **NÃO aplique automaticamente de forma destrutiva**.
  Anote exatamente o que ele sugere no relatório. Se for um acréscimo simples e seguro de
  campo opcional, você pode aplicar ao `schema.prisma` e rodar `npx prisma migrate dev --name ajuste-auth`.
  Em caso de dúvida, apenas relate e deixe como está.

## Passo 3: Verificar tipagem
```bash
npx tsc --noEmit
```
Esperado: sem erros.

## Verificação (relate)
- Conteúdo final de `src/lib/auth.ts`.
- Saída do `npx @better-auth/cli generate` (compatível? sugeriu algo?).
- Resultado do `tsc --noEmit`.

## Não faça
- Não monte rotas Express nem middleware ainda (tarefas futuras).
- Não mude versões de pacotes.
