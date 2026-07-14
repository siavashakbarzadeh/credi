import { FastifyRequest, FastifyReply } from "fastify";
import * as notesService from "./notes.service.js";

export async function listNotesHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const notes = await notesService.listNotes(id);
  return reply.send(notes);
}

export async function createNoteHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { content } = request.body as { content: string };
  try {
    const note = await notesService.createNote(id, content, request.user!.id);
    return reply.status(201).send(note);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}
