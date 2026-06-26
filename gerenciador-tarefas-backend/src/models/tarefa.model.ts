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
