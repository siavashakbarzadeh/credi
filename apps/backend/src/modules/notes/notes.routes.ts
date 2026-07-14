import { FastifyInstance } from "fastify";
import { listNotesHandler, createNoteHandler } from "./notes.controller.js";

export async function notesRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/applications/:id/notes", { preHandler: [authenticate] }, listNotesHandler);
  fastify.post("/applications/:id/notes", { preHandler: [authenticate] }, createNoteHandler);
}
