# Backend Task 4 — Relatório de Execução

**Data:** 2026-06-24  
**Status:** DONE

---

## Arquivos criados/modificados

| Arquivo | Ação |
|---------|------|
| `src/app.ts` | Criado |
| `src/server.ts` | Criado |
| `package.json` | Modificado (adição de `dotenv`) |
| `package-lock.json` | Atualizado automaticamente |

---

## Passos executados

### 1. Instalação do dotenv

`dotenv` não estava nas dependências. Instalado via:
```
npm install dotenv
```
Resultado: `added 1 package, changed 1 package, and audited 155 packages in 937ms — 0 vulnerabilities`

### 2. Criação de `src/app.ts`

Arquivo criado conforme brief, com:
- CORS configurado para `FRONTEND_URL` (padrão `http://localhost:3000`) com `credentials: true`
- Handler Better Auth montado em `/api/auth/*splat` (sintaxe Express 5) ANTES do `express.json()`
- Rota `/api/saude` retornando `{"ok":true}`

### 3. Criação de `src/server.ts`

Arquivo criado conforme brief, com `import "dotenv/config"` no topo para carregar variáveis do `.env` no runtime.

---

## Verificação TypeScript

```
npx tsc --noEmit
```
**Resultado:** `TypeScript compilation completed` — sem erros.

---

## Subida do servidor

```
nohup npm run dev > /tmp/backend-dev.log 2>&1 &
```
Log do servidor (`/tmp/backend-dev.log`):
```
> gerenciador-tarefas-backend@1.0.0 dev
> tsx watch src/server.ts

Servidor rodando em http://localhost:3333
```

---

## Verificações (curl)

### /api/saude

```bash
curl -s http://localhost:3333/api/saude
```
**Resposta:**
```json
{"ok":true}
```
✅ OK

### Sign-up (/api/auth/sign-up/email)

```bash
curl -i -s -X POST http://localhost:3333/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","password":"senha12345"}'
```
**Resposta:**
```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:3000
Vary: Origin
Access-Control-Allow-Credentials: true
content-type: application/json
set-cookie: better-auth.session_token=UDVqM0N2bK1c4QLW7grgpRs5vlCAz1pF.hx5Vhq%2F3S3fKwR8Wkh0f%2FqH0lhC1Fu5DHdA2N1ag3vA%3D; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax
Date: Wed, 24 Jun 2026 08:54:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"token":"UDVqM0N2bK1c4QLW7grgpRs5vlCAz1pF","user":{"name":"Teste","email":"teste@exemplo.com","emailVerified":false,"image":null,"createdAt":"2026-06-24T08:54:37.313Z","updatedAt":"2026-06-24T08:54:37.313Z",...}}
```
✅ Status 200, dados do usuário retornados, `Set-Cookie` com sessão presente, CORS com `Access-Control-Allow-Credentials: true`.

---

## Encerramento do servidor

Servidor derrubado via `kill <PID>`. Verificação confirmou que a porta 3333 não responde mais.

---

## Preocupações / Observações

- Nenhuma. Task executada sem desvios em relação ao brief.
- A dependência `dotenv` foi adicionada às deps de produção (não devDeps) pois é usada em runtime via `import "dotenv/config"`.
