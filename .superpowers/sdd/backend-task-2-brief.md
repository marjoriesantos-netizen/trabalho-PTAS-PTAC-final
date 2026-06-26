# Backend — Task 2: Schema Prisma (Tarefa + tabelas de auth) e migração

Estas são suas REQUISIÇÕES — use os valores exatamente como escritos.

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-backend/`
- **SEM GIT**: não rode git nem commits.
- Use **Node 22 via nvm** em todos os comandos: comece cada bloco de shell com
  `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22` (há um `.nvmrc=22` na pasta).
- Prisma 7 e PostgreSQL já instalados. `.env` já existe com `DATABASE_URL`, não o sobrescreva.

## Objetivo
Criar o schema Prisma com o modelo `Tarefa`, o enum `StatusTarefa` e as tabelas do Better Auth, e rodar a migração inicial.

## Passos

### 1. NÃO rode `npx prisma init`
O `.env` já está configurado. Apenas crie o arquivo `prisma/schema.prisma` manualmente (crie a pasta `prisma/`).

### 2. Escrever `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum StatusTarefa {
  PENDENTE
  EM_ANDAMENTO
  CONCLUIDA
}

model Tarefa {
  id           String       @id @default(uuid())
  titulo       String
  descricao    String?
  status       StatusTarefa @default(PENDENTE)
  usuarioId    String
  usuario      user         @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  criadoEm     DateTime     @default(now())
  atualizadoEm DateTime     @updatedAt
}

// Tabelas do Better Auth (nomes fixos da convenção)
model user {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      session[]
  accounts      account[]
  tarefas       Tarefa[]
}

model session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  user      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime
}

model verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?
}
```

### 3. Criar `src/lib/prisma.ts`
```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

### 4. Rodar a migração
```bash
npx prisma migrate dev --name inicial
```
Pré-requisito: PostgreSQL rodando. Se o banco `gerenciador_tarefas` não existir, o Prisma tentará criá-lo. Se a conexão falhar por credenciais/porta, relate o erro exato (não invente credenciais novas além das que estão no `.env`).

## Verificação (faça e relate)
- `npx prisma generate` roda sem erro e o client é gerado.
- A migração cria as tabelas `Tarefa`, `user`, `session`, `account`, `verification`.
  Confirme via `npx prisma db pull --print` ou listando as migrações em `prisma/migrations/`.
- `npx tsc --noEmit` → sem erros (agora há `src/lib/prisma.ts`).

## Notas Prisma 7
- Mantenha o generator `prisma-client-js` como acima.
- Se o Prisma 7 exigir alguma config adicional obrigatória (ex.: `output`), aplique o
  mínimo necessário para gerar o client e relate o que precisou mudar.

## Não faça
- Não crie `auth.ts`, controllers, rotas ou app ainda (tarefas futuras).
- Não altere o `.env`.
