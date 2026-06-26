import { Router } from "express";
import { TarefaController } from "../controllers/tarefa.controller";
import { exigirAutenticacao } from "../middlewares/auth.middleware";

export const tarefaRoutes = Router();

tarefaRoutes.use(exigirAutenticacao);

tarefaRoutes.get("/", TarefaController.listar);
tarefaRoutes.post("/", TarefaController.criar);
tarefaRoutes.put("/:id", TarefaController.atualizar);
tarefaRoutes.delete("/:id", TarefaController.excluir);
