# Frontend — Tasks 4+5: Middleware de proteção + Cabeçalho com logout

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend/`
- **SEM GIT**. **Node 22 via nvm**. Frontend em `:3001`, API em `:3333`.
- Next.js 16 tem breaking changes. **Antes de escrever o middleware**, confirme em
  `node_modules/next/dist/docs/` como o Next 16 espera o arquivo de middleware (nome,
  localização — `src/middleware.ts` —, assinatura, e o objeto `config`/`matcher`).
  Se o Next 16 mudou algo (ex.: nome do arquivo ou API), adapte e relate exatamente o que mudou.

## Objetivo
Proteger as rotas `/` e `/tarefas` (sem sessão → redireciona para `/login`) e criar o cabeçalho
com navegação e logout.

## Passo 1: Middleware — `src/middleware.ts`
Código base (adapte ao Next 16 se necessário, mantendo o comportamento):
```ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const cookieSessao = getSessionCookie(request);
  if (!cookieSessao) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/tarefas"],
};
```
Comportamento exigido: requisições a `/` e `/tarefas` sem cookie de sessão devem ser
redirecionadas para `/login`. Checagem otimista pela presença do cookie (sem ir ao banco);
a validação real é feita pelo backend a cada chamada de API.

## Passo 2: Cabeçalho — `src/components/cabecalho.tsx`
```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function Cabecalho() {
  const router = useRouter();
  const { data: sessao } = useSession();

  async function sair() {
    await signOut();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <nav className="flex gap-4">
        <Link href="/" className="font-semibold">Dashboard</Link>
        <Link href="/tarefas">Tarefas</Link>
      </nav>
      <div className="flex items-center gap-3 text-sm">
        {sessao?.user?.name && <span>Olá, {sessao.user.name}</span>}
        <Button variant="outline" size="sm" onClick={sair}>Sair</Button>
      </div>
    </header>
  );
}
```

## Verificação
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npx tsc --noEmit
```
Esperado: sem erros. Adicionalmente, descreva no relatório como o Next 16 trata o middleware
(confirmou no docs?) e se precisou adaptar.

## Não faça
- Não crie dashboard nem telas de tarefa ainda.
- Não use git.
