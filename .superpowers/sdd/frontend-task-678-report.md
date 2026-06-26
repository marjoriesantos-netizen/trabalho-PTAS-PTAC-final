# Frontend Tasks 6+7+8 — Relatório de Execução

## Status: CONCLUÍDO COM SUCESSO

## Arquivos criados/modificados

| Arquivo | Ação |
|---|---|
| `src/components/formulario-tarefa.tsx` | CRIADO — formulário reaproservado (criar/editar) |
| `src/app/page.tsx` | SUBSTITUÍDO — dashboard com contadores + últimas tarefas |
| `src/app/tarefas/page.tsx` | CRIADO — listagem com alterar/excluir (AlertDialog) |

## Resultado do `npx tsc --noEmit`

```
TypeScript compilation completed
```

Zero erros após adaptação descrita abaixo.

## Resultado do `npm run build`

```
▲ Next.js 16.2.9 (Turbopack)
✓ Compiled successfully in 2.1s
✓ Generating static pages using 8 workers (7/7) in 381ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cadastro
├ ○ /login
└ ○ /tarefas
ƒ Proxy (Middleware)
```

Build concluído sem erros. 5 rotas geradas: `/`, `/_not-found`, `/cadastro`, `/login`, `/tarefas`.

## Adaptações realizadas

### `Button asChild` — não suportado

**Problema:** O brief usa `<Button asChild><Link href="/tarefas">...</Link></Button>` no `page.tsx` (dashboard). O componente `Button` em `src/components/ui/button.tsx` é baseado em `@base-ui/react/button` (não em Radix/Slot), e não expõe a prop `asChild`. O TypeScript gerou `TS2322: Property 'asChild' does not exist`.

**Solução:** Substituído por `<Link href="/tarefas" className={buttonVariants()}>Nova tarefa</Link>`, importando `buttonVariants` em vez de `Button`. O resultado visual é idêntico — o Link recebe as classes do variant `default` diretamente.

## Aviso do build (não-bloqueante)

O Next.js 16 com Turbopack detectou múltiplos lockfiles no workspace (`/home/jpexati/projetos/package-lock.json` e o do projeto). Emitiu warning sugerindo configurar `turbopack.root` no `next.config`. Não afeta o build nem o runtime — apenas silencia o aviso se necessário.
