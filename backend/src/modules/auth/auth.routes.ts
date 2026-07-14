import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerHandler,
  meHandler,
  logoutHandler,
  refreshHandler,
} from "./auth.controller.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", loginHandler);
  fastify.post("/register", registerHandler);
  fastify.get("/me", { preHandler: [(fastify as any).authenticate] }, meHandler);
  fastify.post("/logout", logoutHandler);
  fastify.post("/refresh", refreshHandler);

  fastify.get("/google/login", async (request, reply) => {
    const { getGoogleLoginUrl } = await import("./auth.service.js");
    const url = getGoogleLoginUrl();
    return reply.redirect(url);
  });

  fastify.get("/google/login/callback", async (request, reply) => {
    const { code } = request.query as { code: string };
    if (!code) {
      return reply.redirect(`${process.env.FRONTEND_URL}/login?error=missing_code`);
    }
    try {
      const { handleGoogleLoginCallback } = await import("./auth.service.js");
      const result = await handleGoogleLoginCallback(code);
      const params = new URLSearchParams({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      return reply.redirect(`${process.env.FRONTEND_URL}/auth/callback?${params.toString()}`);
    } catch (err: any) {
      return reply.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
  });

  fastify.get("/google/status", { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    const user = request.user as { id: string };
    const { getGoogleConnection } = await import("../../lib/google-auth.js");
    const connection = await getGoogleConnection(user.id);
    return reply.send({
      connected: !!connection,
      googleEmail: connection?.googleEmail || null,
      tokenExpiry: connection?.tokenExpiry || null,
      createdAt: connection?.createdAt || null,
    });
  });

  fastify.delete("/google/disconnect", { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    const user = request.user as { id: string };
    const { disconnectGoogle } = await import("../../lib/google-auth.js");
    try {
      await disconnectGoogle(user.id);
      return reply.send({ message: "Connessione Google rimossa con successo" });
    } catch {
      return reply.status(404).send({ error: "Nessuna connessione Google trovata" });
    }
  });

  fastify.get("/google/start", async (request, reply) => {
    const { getGoogleAuthUrl } = await import("../../lib/google-auth.js");
    const state = (request.query as any).userId || "default";
    const url = getGoogleAuthUrl(state);
    return reply.redirect(url);
  });

  fastify.get("/google/callback", async (request, reply) => {
    const { code, state } = request.query as { code: string; state: string };
    if (!code) {
      return reply.status(400).send({ error: "Codice di autorizzazione mancante" });
    }
    try {
      const { handleGoogleCallback } = await import("../../lib/google-auth.js");
      await handleGoogleCallback(code, state);
      return reply.redirect(`${process.env.FRONTEND_URL}/settings?google=connected`);
    } catch (err: any) {
      return reply.redirect(`${process.env.FRONTEND_URL}/settings?google=error`);
    }
  });
}
