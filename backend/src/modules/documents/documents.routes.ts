import { FastifyInstance } from "fastify";
import {
  listDocumentsHandler,
  uploadDocumentHandler,
  updateDocumentHandler,
  deleteDocumentHandler,
} from "./documents.controller.js";

export async function documentsRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/applications/:id/documents", { preHandler: [authenticate] }, listDocumentsHandler);
  fastify.post("/applications/:id/documents", { preHandler: [authenticate] }, uploadDocumentHandler);
  fastify.patch("/documents/:id", { preHandler: [authenticate] }, updateDocumentHandler);
  fastify.delete("/documents/:id", { preHandler: [authenticate] }, deleteDocumentHandler);
}
