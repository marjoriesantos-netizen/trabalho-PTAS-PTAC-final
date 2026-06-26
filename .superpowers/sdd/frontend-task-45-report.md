# Frontend Tasks 4+5 Report: Middleware (Proxy) + Cabeçalho

## Next.js 16 Middleware Conventions

**Docs location:** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` and `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`

### What changed in Next.js 16

The `middleware` file convention is **deprecated and renamed to `proxy`** in Next.js 16. Key changes:

| Aspect | Next.js 14/15 | Next.js 16 |
|--------|--------------|------------|
| Filename | `middleware.ts` | `proxy.ts` |
| Function name | `export function middleware()` | `export function proxy()` |
| Runtime | Edge (default) | Node.js (default, Edge no longer supported) |
| Location | `src/middleware.ts` | `src/proxy.ts` |
| Config/matcher | Same `config` export with `matcher` | Same — no change |

The `config` object shape and `matcher` array format are **unchanged**. Only the filename and exported function name changed.

The upgrade guide states: *"The named export `middleware` is also deprecated. Rename your function to `proxy`."*

Note from the docs: if edge runtime is needed, keep using the old `middleware.ts` (deprecated but still functional). For Node.js use, `proxy.ts` is the correct path.

## Files Created

### `src/proxy.ts` (adapted from brief's `src/middleware.ts`)

The brief provided code for `src/middleware.ts` exporting `middleware`. This was adapted to Next.js 16 conventions:
- **Filename changed:** `middleware.ts` → `proxy.ts`
- **Function name changed:** `export function middleware(...)` → `export function proxy(...)`
- **Everything else is verbatim:** imports (`NextRequest`, `NextResponse`, `getSessionCookie`), logic, and `config`/`matcher` are identical

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
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

### `src/components/cabecalho.tsx` (verbatim from brief)

No adaptations needed — this is a client component using `better-auth/react` hooks and standard Next.js navigation. Copied verbatim.

## TypeScript Verification

Command:
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22 && cd /home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend && npx tsc --noEmit 2>&1
```

Output:
```
Now using node v22.23.1 (npm v10.9.8)
TypeScript compilation completed
```

**Result: PASS — 0 errors**
