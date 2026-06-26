# Frontend — Task 2: Cliente Better Auth, helper de API e tipos

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend/`
- **SEM GIT**. Use **Node 22 via nvm** nos comandos.
- Frontend roda em `http://localhost:3001`; API em `http://localhost:3333`.
- TypeScript em tudo. Código e nomes em português (exceto APIs de libs).

## Objetivo
Criar a base que as telas usarão: cliente Better Auth, helper de fetch com credenciais, e os tipos da Tarefa.

## Passo 1: `src/lib/auth-client.ts`
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

## Passo 2: `src/lib/api.ts`
```ts
const BASE = process.env.NEXT_PUBLIC_API_URL;

export function api(caminho: string, opcoes: RequestInit = {}) {
  return fetch(`${BASE}${caminho}`, {
    ...opcoes,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opcoes.headers ?? {}),
    },
  });
}
```

## Passo 3: `src/lib/tipos.ts`
```ts
export type StatusTarefa = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: StatusTarefa;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export const ROTULO_STATUS: Record<StatusTarefa, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
};
```

## Verificação
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npx tsc --noEmit
```
Esperado: sem erros. Relate a saída.

## Não faça
- Não crie páginas, middleware nem componentes ainda.
- Não use git.
