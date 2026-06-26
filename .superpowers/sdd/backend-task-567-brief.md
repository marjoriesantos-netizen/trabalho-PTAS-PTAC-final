# Backend — Tasks 5+6+7: Middleware de auth + Model + Controller + Rotas (CRUD MVC)

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-backend/`
- **SEM GIT**.
- Use **Node 22 via nvm**: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- Express 5, Prisma 6, Better Auth 1.6. `src/lib/auth.ts` e `src/lib/prisma.ts` já existem.
- Padrão MVC: Model = acesso Prisma; Controller = regras da requisição; Routes = endpoints + middleware.
- Toda rota de tarefa é protegida: sem sessão → 401. O `usuarioId` SEMPRE vem do usuário logado, nunca do corpo.

## Objetivo
Implementar o middleware de autenticação, o model, o controller e as rotas de `Tarefa`, montá-las no app e verificar o CRUD completo autenticado.

## Passo 1: `src/middlewares/auth.middleware.ts`
```ts
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
      usuario?: { id: string; email: string; name: string };
    }
  }
}

export async function exigirAutenticacao(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessao = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!sessao) {
    return res.status(401).json({ erro: "Não autenticado" });
  }

  req.usuarioId = sessao.user.id;
  req.usuario = {
    id: sessao.user.id,
    email: sessao.user.email,
    name: sessao.user.name,
  };
  next();
}
```

## Passo 2: `src/models/tarefa.model.ts`
```ts
import { StatusTarefa } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const TarefaModel = {
  listarPorUsuario(usuarioId: string) {
    return prisma.tarefa.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: "desc" },
    });
  },

  criar(dados: {
    titulo: string;
    descricao?: string | null;
    status?: StatusTarefa;
    usuarioId: string;
  }) {
    return prisma.tarefa.create({ data: dados });
  },

  buscarPorId(id: string) {
    return prisma.tarefa.findUnique({ where: { id } });
  },

  atualizar(
    id: string,
    dados: { titulo?: string; descricao?: string | null; status?: StatusTarefa }
  ) {
    return prisma.tarefa.update({ where: { id }, data: dados });
  },

  async excluir(id: string) {
    await prisma.tarefa.delete({ where: { id } });
  },
};
```

## Passo 3: `src/controllers/tarefa.controller.ts`
```ts
import { Request, Response } from "express";
import { StatusTarefa } from "@prisma/client";
import { TarefaModel } from "../models/tarefa.model";

const STATUS_VALIDOS = Object.values(StatusTarefa);

export const TarefaController = {
  async listar(req: Request, res: Response) {
    const tarefas = await TarefaModel.listarPorUsuario(req.usuarioId!);
    res.json(tarefas);
  },

  async criar(req: Request, res: Response) {
    const { titulo, descricao, status } = req.body;
    if (!titulo || typeof titulo !== "string") {
      return res.status(400).json({ erro: "titulo é obrigatório" });
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ erro: "status inválido" });
    }
    const tarefa = await TarefaModel.criar({
      titulo,
      descricao: descricao ?? null,
      status,
      usuarioId: req.usuarioId!,
    });
    res.status(201).json(tarefa);
  },

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const existente = await TarefaModel.buscarPorId(id);
    if (!existente || existente.usuarioId !== req.usuarioId) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    const { titulo, descricao, status } = req.body;
    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ erro: "status inválido" });
    }
    const tarefa = await TarefaModel.atualizar(id, { titulo, descricao, status });
    res.json(tarefa);
  },

  async excluir(req: Request, res: Response) {
    const { id } = req.params;
    const existente = await TarefaModel.buscarPorId(id);
    if (!existente || existente.usuarioId !== req.usuarioId) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    await TarefaModel.excluir(id);
    res.status(204).send();
  },
};
```

## Passo 4: `src/routes/tarefa.routes.ts`
```ts
import { Router } from "express";
import { TarefaController } from "../controllers/tarefa.controller";
import { exigirAutenticacao } from "../middlewares/auth.middleware";

export const tarefaRoutes = Router();

tarefaRoutes.use(exigirAutenticacao);

tarefaRoutes.get("/", TarefaController.listar);
tarefaRoutes.post("/", TarefaController.criar);
tarefaRoutes.put("/:id", TarefaController.atualizar);
tarefaRoutes.delete("/:id", TarefaController.excluir);
```

## Passo 5: Montar no `src/app.ts`
Adicione o import no topo (junto aos outros imports):
```ts
import { tarefaRoutes } from "./routes/tarefa.routes";
```
E, DEPOIS de `app.use(express.json());`, adicione:
```ts
app.use("/api/tarefas", tarefaRoutes);
```
Não remova nem reordene o que já existe (o handler do Better Auth deve continuar ANTES do `express.json()`).

## Passo 6: Verificação completa (relate as saídas reais)
Suba o servidor em background com Node 22, e teste:
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
nohup npm run dev > /tmp/backend-dev.log 2>&1 &
sleep 4

# 1) sem sessão deve dar 401
curl -i -s http://localhost:3333/api/tarefas | head -1

# 2) login salvando cookie (usuário teste@exemplo.com já existe da Task 4; se não, faça sign-up antes)
curl -s -c /tmp/cookies.txt -X POST http://localhost:3333/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha12345"}' > /dev/null

# 3) criar
curl -s -b /tmp/cookies.txt -X POST http://localhost:3333/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Primeira tarefa","descricao":"detalhe"}'
echo

# 4) listar
curl -s -b /tmp/cookies.txt http://localhost:3333/api/tarefas
echo
```
Pegue o `id` retornado na criação e teste PUT e DELETE:
```bash
ID=<id_da_tarefa>
curl -s -b /tmp/cookies.txt -X PUT http://localhost:3333/api/tarefas/$ID \
  -H "Content-Type: application/json" -d '{"status":"CONCLUIDA"}'; echo
curl -i -s -b /tmp/cookies.txt -X DELETE http://localhost:3333/api/tarefas/$ID | head -1
```
Esperado:
- sem sessão → `401`
- criar → `201` com a tarefa (status `PENDENTE`)
- listar → array contendo a tarefa
- PUT → `200` com status `CONCLUIDA`
- DELETE → `204`

Ao final, derrube o servidor de background (não deixe processo solto). Rode também `npx tsc --noEmit` (sem erros).

## Não faça
- Não crie README ainda (próxima tarefa).
- Não mude versões de pacotes nem o schema.
