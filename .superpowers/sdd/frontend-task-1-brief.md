# Frontend — Task 1: Scaffold Next.js + Tailwind + shadcn/ui

## Restrições globais
- Pasta de trabalho: `/home/jpexati/projetos/projeto-final/`
- O projeto frontend deve ficar em `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend/`
- **SEM GIT**: não rode git nem commits. (O create-next-app pode tentar inicializar git;
  se criar uma pasta `.git`, remova-a com `rm -rf gerenciador-tarefas-frontend/.git`.)
- Use **Node 22 via nvm**: comece blocos shell com
  `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`.
- Frontend roda em `http://localhost:3000`; consome a API em `http://localhost:3333`.
- Todos os comandos devem ser NÃO-interativos (use as flags indicadas).

## Objetivo
Criar o esqueleto do app Next.js com TypeScript, Tailwind e shadcn/ui, instalar o cliente
Better Auth e configurar a variável de ambiente da API.

## Passo 1: Criar o projeto Next.js (não-interativo)
```bash
cd /home/jpexati/projetos/projeto-final
npx create-next-app@latest gerenciador-tarefas-frontend \
  --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-turbopack --yes
cd gerenciador-tarefas-frontend
rm -rf .git   # garantir sem git
```

## Passo 2: Inicializar shadcn/ui e instalar componentes (não-interativo)
```bash
npx shadcn@latest init -d
npx shadcn@latest add button input card dialog alert-dialog select badge label sonner textarea
```
Se algum componente exigir confirmação, use a flag de sobrescrita não-interativa
(ex.: `--yes` / `--overwrite`) conforme a versão do shadcn. Relate a versão do shadcn usada.

## Passo 3: Instalar o cliente Better Auth
```bash
npm install better-auth
```

## Passo 4: Criar `.env.local`
Conteúdo exato:
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Passo 5: Verificar
- Suba o dev server em background e cheque que responde:
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
nohup npm run dev > /tmp/frontend-dev.log 2>&1 &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```
Esperado: `200`. Veja `/tmp/frontend-dev.log` se não for 200.
- Derrube o dev server ao final (não deixe processo solto, ex.: `pkill -f "next dev"`).
- Confirme que os componentes shadcn foram criados em `src/components/ui/`
  (button, input, card, dialog, alert-dialog, select, badge, label, sonner, textarea).

## Relate
- Versões: Next.js, React, Tailwind, shadcn.
- Lista dos componentes em `src/components/ui/`.
- Código HTTP do dev server.
- Quaisquer prompts/erros e como resolveu.

## Não faça
- Não crie páginas, middleware nem lógica de auth ainda (tarefas futuras).
- Não use git.
