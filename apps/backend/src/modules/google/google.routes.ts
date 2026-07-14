import { FastifyInstance } from "fastify";
import {
  createDocHandler,
  linkDocHandler,
  getDocHandler,
  watchDocHandler,
  syncDocHandler,
} from "./google.controller.js";

export async function googleRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.post("/applications/:id/google-doc/create", { preHandler: [authenticate] }, createDocHandler);
  fastify.post("/applications/:id/google-doc/link", { preHandler: [authenticate] }, linkDocHandler);
  fastify.get("/applications/:id/google-doc", { preHandler: [authenticate] }, getDocHandler);
  fastify.post("/applications/:id/google-doc/watch", { preHandler: [authenticate] }, watchDocHandler);
  fastify.post("/google/sync/:applicationId", { preHandler: [authenticate] }, syncDocHandler);
}
