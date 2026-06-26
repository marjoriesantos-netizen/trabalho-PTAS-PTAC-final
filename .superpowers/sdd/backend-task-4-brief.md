# Backend — Task 4: App Express, montagem do Better Auth e CORS

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-backend/`
- **SEM GIT**.
- Use **Node 22 via nvm**: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- Backend em `http://localhost:3333`; frontend em `http://localhost:3000`.
- **Express 5 está instalado** (não Express 4). Atenção à sintaxe de rota curinga (ver abaixo).

## Objetivo
Criar o app Express, montar o handler do Better Auth, configurar CORS e subir o servidor.

## Passo 1: Criar `src/app.ts`
ATENÇÃO — Express 5 NÃO aceita curinga `*` puro em rotas (usa path-to-regexp v8).
Use `/api/auth/*splat` (curinga nomeado). O `express.json()` DEVE vir DEPOIS do handler do Better Auth.

```ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth precisa do corpo cru — montar ANTES do express.json()
// Express 5: curinga deve ser nomeado (*splat), não "*" puro
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/saude", (_req, res) => {
  res.json({ ok: true });
});
```

## Passo 2: Criar `src/server.ts`
```ts
import "dotenv/config";
import { app } from "./app";

const porta = Number(process.env.PORT) || 3333;

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
```
Nota: `import "dotenv/config"` garante que as variáveis do `.env` sejam carregadas no runtime.
Se `dotenv` não estiver instalado, instale com `npm install dotenv`.

## Passo 3: Subir e verificar
Suba o servidor em background e teste. Exemplo:
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
nohup npm run dev > /tmp/backend-dev.log 2>&1 &
sleep 4
curl -s http://localhost:3333/api/saude
echo
# cadastro de teste (use um e-mail único; se já existir, tudo bem)
curl -i -s -X POST http://localhost:3333/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","password":"senha12345"}'
```
Esperado:
- `/api/saude` → `{"ok":true}`
- sign-up → status 200 com dados do usuário e header `Set-Cookie` de sessão
  (se o e-mail já existir de teste anterior, pode retornar erro de usuário existente — nesse caso
  teste o sign-in em `/api/auth/sign-in/email` com as mesmas credenciais).

Ao terminar os testes, derrube o servidor de background (ex.: `pkill -f "tsx watch"` ou mate o PID) para não deixar processo solto. Relate o que apareceu em `/tmp/backend-dev.log` se houver erro.

## Verificação adicional
- `npx tsc --noEmit` → sem erros.

## Não faça
- Não crie middleware de auth nem rotas de tarefa ainda (Tasks 5-7).
