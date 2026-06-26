# Backend Tasks 5+6+7 — Relatório de Implementação

**Data:** 2026-06-24  
**Status:** DONE

---

## Arquivos Criados

- `src/middlewares/auth.middleware.ts`
- `src/models/tarefa.model.ts`
- `src/controllers/tarefa.controller.ts`
- `src/routes/tarefa.routes.ts`

## Arquivos Modificados

- `src/app.ts` — adicionado import de `tarefaRoutes` e montagem em `/api/tarefas` após `express.json()`

---

## Verificação CRUD — Saídas Reais dos curls

### 1) Sem sessão → 401

```
HTTP/1.1 401 Unauthorized
```

### 2) Login (teste@exemplo.com / senha12345)

```json
{"redirect":false,"token":"rKYfYqZcjNXmVHu9DgBJQ2BZ3id2e1MG","user":{"name":"Teste","email":"teste@exemplo.com","emailVerified":false,"image":null,"createdAt":"2026-06-24T08:54:37.313Z","updatedAt":"2026-06-24T08:54:37.313Z","id":"cc0Wvi76o6lHPo7gw6UhD87b6I8VkzAy"}}
```

### 3) Criar tarefa (POST /api/tarefas) → 201

```json
{"id":"d6fedad3-d240-4bde-a7c3-08b3b8c6c73f","titulo":"Primeira tarefa","descricao":"detalhe","status":"PENDENTE","usuarioId":"cc0Wvi76o6lHPo7gw6UhD87b6I8VkzAy","criadoEm":"2026-06-24T08:58:00.150Z","atualizadoEm":"2026-06-24T08:58:00.150Z"}
```

### 4) Listar tarefas (GET /api/tarefas) → 200

```json
[{"id":"d6fedad3-d240-4bde-a7c3-08b3b8c6c73f","titulo":"Primeira tarefa","descricao":"detalhe","status":"PENDENTE","usuarioId":"cc0Wvi76o6lHPo7gw6UhD87b6I8VkzAy","criadoEm":"2026-06-24T08:58:00.150Z","atualizadoEm":"2026-06-24T08:58:00.150Z"}]
```

### 5) Atualizar tarefa (PUT /api/tarefas/:id) → 200

```json
{"id":"d6fedad3-d240-4bde-a7c3-08b3b8c6c73f","titulo":"Primeira tarefa","descricao":"detalhe","status":"CONCLUIDA","usuarioId":"cc0Wvi76o6lHPo7gw6UhD87b6I8VkzAy","criadoEm":"2026-06-24T08:58:00.150Z","atualizadoEm":"2026-06-24T08:58:11.250Z"}
```

### 6) Deletar tarefa (DELETE /api/tarefas/:id) → 204

```
HTTP/1.1 204 No Content
```

---

## TypeScript (npx tsc --noEmit)

Resultado: **0 erros** após correção de cast em `req.params.id`.

**Nota:** O código do brief usa `const { id } = req.params`, o que gera erro TS2345 porque `ParamsDictionary` tipifica os valores como `string | string[]`. A correção aplicada foi usar `const id = req.params.id as string` nos métodos `atualizar` e `excluir`, mantendo o comportamento idêntico em runtime.

---

## Resumo das Verificações

| Operação         | HTTP Status | Resultado       |
|------------------|-------------|-----------------|
| Sem sessão (401) | 401         | OK              |
| Login            | 200         | Sessão obtida   |
| Criar            | 201         | status PENDENTE |
| Listar           | 200         | Array com item  |
| PUT              | 200         | status CONCLUIDA|
| DELETE           | 204         | Sem corpo       |

---

## Preocupações

Nenhuma preocupação crítica. O cast `as string` em `req.params.id` é a abordagem padrão para Express 4/5 com `strict: true` no TypeScript, já que `ParamsDictionary` não distingue entre params simples e arrays em tempo de compilação.
