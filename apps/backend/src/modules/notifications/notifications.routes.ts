import { FastifyInstance } from "fastify";
import {
  listNotificationsHandler,
  markReadHandler,
  markAllReadHandler,
} from "./notifications.controller.js";

export async function notificationsRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/", { preHandler: [authenticate] }, listNotificationsHandler);
  fastify.patch("/:id/read", { preHandler: [authenticate] }, markReadHandler);
  fastify.patch("/read-all", { preHandler: [authenticate] }, markAllReadHandler);
}
