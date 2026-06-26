import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { tarefaRoutes } from "./routes/tarefa.routes";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth precisa do corpo cru — montar ANTES do express.json()
// Express 5: curinga deve ser nomeado (*splat), não "*" puro
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/saude", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/tarefas", tarefaRoutes);
