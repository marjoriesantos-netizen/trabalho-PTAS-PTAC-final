# Frontend — Task 3: Páginas de cadastro e login + Toaster no layout

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend/`
- **SEM GIT**. **Node 22 via nvm**. Frontend em `http://localhost:3001`, API em `http://localhost:3333`.
- Next.js 16 tem breaking changes. Se algo do código abaixo não compilar/funcionar por
  diferença do Next 16, consulte `node_modules/next/dist/docs/` e adapte o MÍNIMO necessário,
  relatando o que mudou. As APIs usadas aqui (`"use client"`, `useRouter` de `next/navigation`,
  `next/link`) são padrão do App Router.

## Objetivo
Telas de cadastro e login usando o cliente Better Auth, e o `<Toaster />` no layout para feedback.

## Passo 1: Adicionar o Toaster ao `src/app/layout.tsx`
Importe no topo e renderize dentro do `<body>`, logo após `{children}`:
```tsx
import { Toaster } from "@/components/ui/sonner";
```
```tsx
// dentro do <body>, após {children}:
<Toaster />
```
Não remova o conteúdo existente do layout; apenas adicione o import e o componente.

## Passo 2: `src/app/cadastro/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaCadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await signUp.email({ name: nome, email, password: senha });
    setCarregando(false);
    if (error) {
      toast.error(error.message ?? "Erro ao cadastrar");
      return;
    }
    toast.success("Cadastro realizado");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={aoEnviar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={8} required />
            </div>
            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Enviando..." : "Cadastrar"}
            </Button>
            <p className="text-center text-sm">
              Já tem conta? <Link href="/login" className="underline">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Passo 3: `src/app/login/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await signIn.email({ email, password: senha });
    setCarregando(false);
    if (error) {
      toast.error(error.message ?? "E-mail ou senha inválidos");
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={aoEnviar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm">
              Não tem conta? <Link href="/cadastro" className="underline">Cadastre-se</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Verificação
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npx tsc --noEmit
```
Esperado: sem erros. Relate a saída. (O teste de fluxo real no navegador será feito depois,
de forma integrada.)

## Não faça
- Não crie middleware, dashboard, cabeçalho ou telas de tarefa ainda.
- Não use git.
