import { FastifyInstance } from "fastify";
import { getStatsHandler } from "./dashboard.controller.js";

export async function dashboardRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/stats", { preHandler: [authenticate] }, getStatsHandler);
}
