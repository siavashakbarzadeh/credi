import { FastifyRequest, FastifyReply } from "fastify";
import * as authService from "./auth.service.js";
import { LoginInput, RegisterInput } from "./auth.schema.js";

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = request.body as LoginInput;
    const result = await authService.login(data);

    reply.setCookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    reply.setCookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return reply.send(result);
  } catch (err: any) {
    return reply.status(401).send({ error: err.message });
  }
}

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = request.body as RegisterInput;
    const user = await authService.register(data);
    return reply.status(201).send(user);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Autenticazione richiesta" });
    }
    const user = await authService.getMe(request.user.id);
    return reply.send(user);
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access_token", { path: "/" });
  reply.clearCookie("refresh_token", { path: "/" });
  return reply.send({ message: "Sessione terminata con successo" });
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { refreshToken } = request.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(refreshToken);

    reply.setCookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    reply.setCookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return reply.send(tokens);
  } catch (err: any) {
    return reply.status(401).send({ error: err.message });
  }
}
