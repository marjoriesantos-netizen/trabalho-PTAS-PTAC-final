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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
    const existente = await TarefaModel.buscarPorId(id);
    if (!existente || existente.usuarioId !== req.usuarioId) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    await TarefaModel.excluir(id);
    res.status(204).send();
  },
};
