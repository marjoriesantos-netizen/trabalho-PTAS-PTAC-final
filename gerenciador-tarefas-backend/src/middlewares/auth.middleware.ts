import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
      usuario?: { id: string; email: string; name: string };
    }
  }
}

export async function exigirAutenticacao(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessao = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!sessao) {
    return res.status(401).json({ erro: "Não autenticado" });
  }

  req.usuarioId = sessao.user.id;
  req.usuario = {
    id: sessao.user.id,
    email: sessao.user.email,
    name: sessao.user.name,
  };
  next();
}
