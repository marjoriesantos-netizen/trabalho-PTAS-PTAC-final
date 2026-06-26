# Frontend — Tasks 6+7+8: Dashboard + Formulário de tarefa + Listagem (CRUD UI)

## Restrições globais
- Pasta: `/home/jpexati/projetos/projeto-final/gerenciador-tarefas-frontend/`
- **SEM GIT**. **Node 22 via nvm**. Frontend em `:3001`, API em `:3333`.
- Reaproveitar o MESMO formulário para criar e editar tarefa.
- Exclusão SEMPRE com confirmação (AlertDialog).
- Next.js 16: se algum import de componente shadcn ou API do Next não compilar, consulte
  `node_modules/next/dist/docs/` e/ou o componente em `src/components/ui/` e adapte o MÍNIMO,
  relatando. Os componentes shadcn já instalados: button, input, card, dialog, alert-dialog,
  select, badge, label, sonner, textarea.

## Objetivo
Criar a dashboard (contadores + últimas tarefas), o formulário reaproservado e a listagem com alterar/excluir.

## Passo 1: `src/components/formulario-tarefa.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Tarefa, StatusTarefa, ROTULO_STATUS } from "@/lib/tipos";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS: StatusTarefa[] = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"];

export function FormularioTarefa({
  aberto, aoFechar, aoSalvar, tarefa,
}: {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: () => void;
  tarefa?: Tarefa;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<StatusTarefa>("PENDENTE");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setTitulo(tarefa?.titulo ?? "");
    setDescricao(tarefa?.descricao ?? "");
    setStatus(tarefa?.status ?? "PENDENTE");
  }, [tarefa, aberto]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const corpo = JSON.stringify({ titulo, descricao, status });
    const resposta = tarefa
      ? await api(`/api/tarefas/${tarefa.id}`, { method: "PUT", body: corpo })
      : await api("/api/tarefas", { method: "POST", body: corpo });
    setCarregando(false);
    if (!resposta.ok) {
      toast.error("Erro ao salvar tarefa");
      return;
    }
    toast.success(tarefa ? "Tarefa atualizada" : "Tarefa criada");
    aoSalvar();
    aoFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && aoFechar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tarefa ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={salvar} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as StatusTarefa)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s} value={s}>{ROTULO_STATUS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Passo 2: `src/app/page.tsx` (dashboard — SUBSTITUIR o conteúdo gerado pelo create-next-app)
```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Tarefa, ROTULO_STATUS, StatusTarefa } from "@/lib/tipos";
import { Cabecalho } from "@/components/cabecalho";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    api("/api/tarefas")
      .then((r) => r.json())
      .then(setTarefas)
      .catch(() => setTarefas([]));
  }, []);

  const contar = (s: StatusTarefa) => tarefas.filter((t) => t.status === s).length;

  return (
    <div>
      <Cabecalho />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button asChild><Link href="/tarefas">Nova tarefa</Link></Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card><CardHeader><CardTitle className="text-sm">Total</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{tarefas.length}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Pendentes</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{contar("PENDENTE")}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Em andamento</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{contar("EM_ANDAMENTO")}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Concluídas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{contar("CONCLUIDA")}</CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Últimas tarefas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tarefas.slice(0, 5).map((t) => (
              <div key={t.id} className="flex justify-between border-b py-2 last:border-0">
                <span>{t.titulo}</span>
                <span className="text-sm text-muted-foreground">{ROTULO_STATUS[t.status]}</span>
              </div>
            ))}
            {tarefas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa ainda.</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
```

## Passo 3: `src/app/tarefas/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Tarefa, ROTULO_STATUS } from "@/lib/tipos";
import { Cabecalho } from "@/components/cabecalho";
import { FormularioTarefa } from "@/components/formulario-tarefa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [formAberto, setFormAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Tarefa | undefined>(undefined);
  const [aExcluir, setAExcluir] = useState<Tarefa | undefined>(undefined);

  function carregar() {
    api("/api/tarefas").then((r) => r.json()).then(setTarefas).catch(() => setTarefas([]));
  }

  useEffect(() => { carregar(); }, []);

  function novaTarefa() { setEmEdicao(undefined); setFormAberto(true); }
  function editar(t: Tarefa) { setEmEdicao(t); setFormAberto(true); }

  async function confirmarExclusao() {
    if (!aExcluir) return;
    const resposta = await api(`/api/tarefas/${aExcluir.id}`, { method: "DELETE" });
    if (resposta.ok) {
      toast.success("Tarefa excluída");
      carregar();
    } else {
      toast.error("Erro ao excluir");
    }
    setAExcluir(undefined);
  }

  return (
    <div>
      <Cabecalho />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Minhas tarefas</h1>
          <Button onClick={novaTarefa}>Nova tarefa</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tarefas.map((t) => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{t.titulo}</CardTitle>
                <Badge variant="secondary">{ROTULO_STATUS[t.status]}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.descricao && <p className="text-sm text-muted-foreground">{t.descricao}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => editar(t)}>Alterar</Button>
                  <Button variant="destructive" size="sm" onClick={() => setAExcluir(t)}>Excluir</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {tarefas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa. Crie a primeira!</p>}
        </div>
      </main>

      <FormularioTarefa
        aberto={formAberto}
        aoFechar={() => setFormAberto(false)}
        aoSalvar={carregar}
        tarefa={emEdicao}
      />

      <AlertDialog open={!!aExcluir} onOpenChange={(v) => !v && setAExcluir(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{aExcluir?.titulo}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

## Verificação
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npx tsc --noEmit
npm run build
```
Esperado: `tsc` sem erros e `npm run build` concluindo com sucesso (build compila as 4 rotas:
`/`, `/login`, `/cadastro`, `/tarefas`). Relate a saída do build (rotas geradas) e qualquer
adaptação necessária por causa do Next 16 / shadcn (base-ui).

## Não faça
- Não use git.
- Não mude o backend.
