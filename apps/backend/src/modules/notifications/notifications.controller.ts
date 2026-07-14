import { FastifyRequest, FastifyReply } from "fastify";
import * as notificationsService from "./notifications.service.js";

export async function listNotificationsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit } = request.query as { page?: string; limit?: string };
  const result = await notificationsService.listNotifications(
    request.user!.id,
    parseInt(page || "1"),
    parseInt(limit || "20")
  );
  return reply.send(result);
}

export async function markReadHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await notificationsService.markAsRead(id, request.user!.id);
  return reply.send({ message: "Notifica segnata come letta" });
}

export async function markAllReadHandler(request: FastifyRequest, reply: FastifyReply) {
  await notificationsService.markAllAsRead(request.user!.id);
  return reply.send({ message: "Tutte le notifiche segnate come lette" });
}
