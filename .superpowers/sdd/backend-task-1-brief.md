# Backend — Task 1: Scaffold do projeto e dependências

Estas são suas REQUISIÇÕES — use os valores exatamente como escritos.

## Restrições globais (valem para esta tarefa)
- Todo código, nomes e comentários em **português** (exceto nomes fixos do Better Auth).
- Pasta do projeto: `gerenciador-tarefas-backend/` dentro de `/home/jpexati/projetos/projeto-final/`.
- **SEM GIT**: não rode nenhum comando git, não faça commits. Ignore qualquer passo de commit.
- Backend roda em `http://localhost:3333`; frontend em `http://localhost:3000`.

## Objetivo
Criar o esqueleto do projeto backend Node.js + Express + TypeScript com Prisma e deixar pronto para os próximos passos.

## Passos

### 1. Inicializar e instalar dependências
```bash
cd /home/jpexati/projetos/projeto-final
mkdir -p gerenciador-tarefas-backend && cd gerenciador-tarefas-backend
npm init -y
npm install express cors better-auth @prisma/client
npm install -D typescript tsx @types/express @types/cors prisma
```

### 2. Criar `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### 3. Ajustar `scripts` no `package.json`
```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### 4. Criar `.gitignore`
```
node_modules
dist
.env
```

### 5. Criar `.env.example` e `.env`
`.env.example`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gerenciador_tarefas?schema=public"
BETTER_AUTH_SECRET="troque-por-uma-string-aleatoria-longa"
BETTER_AUTH_URL="http://localhost:3333"
FRONTEND_URL="http://localhost:3000"
PORT=3333
```
Copie para `.env` e gere o `BETTER_AUTH_SECRET` com `openssl rand -base64 32` (coloque o valor real gerado no `.env`, deixe o placeholder no `.env.example`).

## Verificação (faça e relate o resultado)
- `npx tsc --noEmit` → deve terminar sem erros de configuração.
- Liste o conteúdo da pasta para confirmar os arquivos criados.
- Confirme que as dependências foram instaladas (`node_modules` existe, versões no `package.json`).

## Não faça
- Não crie arquivos `src/*.ts` ainda (isso é de tarefas futuras).
- Não rode git.
