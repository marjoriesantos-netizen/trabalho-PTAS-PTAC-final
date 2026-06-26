# Relatório — Backend Task 1: Scaffold do projeto

## Status: DONE_WITH_CONCERNS

---

## O que foi criado

Todos os arquivos do scaffold foram criados na pasta `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-backend/`.

### Arquivos criados

| Arquivo | Descrição |
|---|---|
| `package.json` | Inicializado com `npm init -y`; scripts `dev`, `build` e `start` configurados conforme brief |
| `package-lock.json` | Gerado automaticamente pelo npm |
| `tsconfig.json` | Configuração TypeScript (com ajuste descrito abaixo) |
| `.gitignore` | Ignorando `node_modules`, `dist` e `.env` |
| `.env.example` | Variáveis de ambiente com placeholder para BETTER_AUTH_SECRET |
| `.env` | Variáveis de ambiente com BETTER_AUTH_SECRET real gerado via `openssl rand -base64 32` |
| `node_modules/` | 157 entradas; todos os pacotes instalados com sucesso |

---

## Dependências instaladas

### Produção (`dependencies`)
```json
{
  "@prisma/client": "^7.8.0",
  "better-auth": "^1.6.20",
  "cors": "^2.8.6",
  "express": "^5.2.1"
}
```

### Desenvolvimento (`devDependencies`)
```json
{
  "@types/cors": "^2.8.19",
  "@types/express": "^5.0.6",
  "prisma": "^7.8.0",
  "tsx": "^4.22.4",
  "typescript": "^6.0.3"
}
```

---

## Resultado das verificações

### Versão do Node.js utilizada
- Node.js **v22.23.1** (npm 10.9.8)
- **Motivo**: O Node.js padrão da máquina era v18.17.1, incompatível com `@prisma/client@7.8.0` e `prisma@7.8.0` que exigem `^20.19 || ^22.12 || >=24.0`. A versão v22.23.1 foi instalada via nvm e usada para instalar as dependências.

### `npx tsc --noEmit`
```
error TS18003: No inputs were found in config file 'tsconfig.json'.
  Specified 'include' paths were '["src"]' and 'exclude' paths were '[".../dist"]'.
Exit code: 2
```
**Explicação**: O erro `TS18003` é esperado e não é um erro de configuração do tsconfig em si — ocorre porque a pasta `src/` ainda não existe e nenhum arquivo `.ts` foi criado (o brief proíbe isso na Task 1). A configuração do TypeScript em si está válida. O erro desaparecerá quando os arquivos `.ts` forem adicionados na Task 2.

### Listagem de arquivos
```
gerenciador-tarefas-backend/
├── .env
├── .env.example
├── .gitignore
├── node_modules/   (157 pacotes)
├── package-lock.json
├── package.json
└── tsconfig.json
```

---

## Desvios em relação ao brief

### 1. Ajuste no `tsconfig.json`: `moduleResolution` e `module`

**Brief especifica:**
```json
"module": "CommonJS",
"moduleResolution": "Node",
```

**Aplicado:**
```json
"module": "NodeNext",
"moduleResolution": "NodeNext",
```

**Motivo**: O TypeScript 6.0.3 (versão instalada pelo `npm install -D typescript`) deprecou `moduleResolution: "Node"` / `"node10"` com o erro `TS5107`, que seria um erro de configuração que impediria a compilação no futuro. O par `module: "NodeNext"` + `moduleResolution: "NodeNext"` é o equivalente moderno recomendado para projetos Node.js CommonJS/ESM. **Se a tarefa seguinte precisar de `module: "CommonJS"` estrito, ajustar ambos para `"commonjs"` e `"node"` usando TypeScript 5.x (downgrade).**

### 2. Node.js v22 (não v18)

O brief não especifica versão do Node.js, mas o ambiente tinha v18 como padrão. As dependências mais recentes exigem v20.19+ ou v22.12+. Foi usado **v22.23.1** via nvm, que atende todos os requisitos.

---

## Próximos passos

- Garantir que o ambiente execute com Node.js v22 (via `nvm use 22` ou `.nvmrc`).
- Task 2 criará os arquivos `src/*.ts`; o erro `TS18003` será resolvido automaticamente.
