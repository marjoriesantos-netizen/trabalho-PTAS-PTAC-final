# Backend Task 2 Report — Schema Prisma e Migração

## Status: DONE_WITH_CONCERNS

---

## Arquivos Criados/Modificados

| Arquivo | Ação |
|---|---|
| `prisma/schema.prisma` | Criado |
| `prisma.config.ts` | Criado (ajuste obrigatório do Prisma 7 — veja Desvios) |
| `src/lib/prisma.ts` | Criado |

---

## Desvios Obrigatórios do Prisma 7

### Problema 1: `url` no datasource não é mais suportado no schema.prisma

**Erro original:**
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter`
for a direct database connection or `accelerateUrl` for Accelerate to the
`PrismaClient` constructor.
```

**Ajuste aplicado (mínimo necessário):**

1. Removida a linha `url = env("DATABASE_URL")` do `datasource db {}` em `prisma/schema.prisma`.

   O bloco ficou:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

2. Criado `prisma.config.ts` na raiz do projeto (nível do `package.json`):
   ```ts
   import { defineConfig } from "prisma/config";
   import "dotenv/config";

   export default defineConfig({
     datasource: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

   Isso move a URL de conexão para a camada CLI (Migrate), conforme documentação Prisma 7.

---

## Saída das Verificações

### `npx prisma generate`
```
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma.
✔ Generated Prisma Client (v7.8.0) to ./node_modules/@prisma/client in 76ms
```
**Status: PASSOU**

### `npx tsc --noEmit`
```
(saída vazia — sem erros)
```
**Status: PASSOU**

### `npx prisma migrate dev --name inicial`
```
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "gerenciador_tarefas", schema "public" at "localhost:5432"

Error: P1000: Authentication failed against database server, the provided database credentials
for `postgres` are not valid.
```
**Status: BLOQUEADO — ver seção de preocupações**

---

## Tabelas Criadas

A migração NÃO foi executada com sucesso. As tabelas abaixo estavam planejadas no schema mas não foram criadas no banco:

- `Tarefa` (com enum `StatusTarefa`)
- `user`
- `session`
- `account`
- `verification`

O diretório `prisma/migrations/` não existe.

---

## Preocupação: Credenciais PostgreSQL Inválidas

O `.env` tem `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gerenciador_tarefas?schema=public"`.

A senha `postgres` para o usuário `postgres` foi rejeitada pelo servidor PostgreSQL local (erro P1000). PostgreSQL está rodando (`pg_isready` confirmou porta 5432 ativa), mas a autenticação falha.

**Ação necessária pelo desenvolvedor:**
1. Verificar qual senha está configurada para o usuário `postgres` no PostgreSQL local (ex.: via `sudo -u postgres psql`).
2. Atualizar o `.env` com as credenciais corretas.
3. Re-executar: `npx prisma migrate dev --name inicial`

Uma vez corrigidas as credenciais, toda a estrutura (schema, config, client) está pronta e a migração deve rodar sem outros impedimentos.

---

## Resumo de Ajustes do Prisma 7

| Requisito do Brief | Aplicado? | Observação |
|---|---|---|
| `prisma/schema.prisma` com modelos exatos | Sim (com ajuste) | `url` removido do datasource (obrigatório no Prisma 7) |
| `src/lib/prisma.ts` | Sim | Sem alterações |
| `prisma generate` sem erro | Sim | Client gerado com sucesso |
| `prisma migrate dev --name inicial` | Não | Bloqueado por credenciais de banco inválidas |
| `tsc --noEmit` sem erro | Sim | Zero erros TypeScript |
| `prisma.config.ts` adicional | Criado | Exigido pelo Prisma 7 para conexão no CLI |
