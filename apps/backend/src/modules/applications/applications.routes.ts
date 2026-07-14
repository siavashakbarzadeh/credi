import { FastifyInstance } from "fastify";
import {
  listApplicationsHandler,
  getApplicationHandler,
  createApplicationHandler,
  updateApplicationHandler,
  updateStatusHandler,
  assignHandler,
  deleteApplicationHandler,
  getActivityHandler,
} from "./applications.controller.js";

export async function applicationsRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/", { preHandler: [authenticate] }, listApplicationsHandler);
  fastify.post("/", { preHandler: [authenticate] }, createApplicationHandler);
  fastify.get("/:id", { preHandler: [authenticate] }, getApplicationHandler);
  fastify.patch("/:id", { preHandler: [authenticate] }, updateApplicationHandler);
  fastify.delete("/:id", { preHandler: [authenticate] }, deleteApplicationHandler);
  fastify.patch("/:id/status", { preHandler: [authenticate] }, updateStatusHandler);
  fastify.post("/:id/assign", { preHandler: [authenticate] }, assignHandler);
  fastify.get("/:id/activity", { preHandler: [authenticate] }, getActivityHandler);
}
