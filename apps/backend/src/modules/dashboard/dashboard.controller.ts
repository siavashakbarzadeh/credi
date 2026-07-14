import { FastifyRequest, FastifyReply } from "fastify";
import * as dashboardService from "./dashboard.service.js";

export async function getStatsHandler(request: FastifyRequest, reply: FastifyReply) {
  const stats = await dashboardService.getDashboardStats(request.user?.id);
  return reply.send(stats);
}
