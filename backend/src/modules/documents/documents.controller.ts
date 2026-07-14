import { FastifyRequest, FastifyReply } from "fastify";
import * as documentsService from "./documents.service.js";

export async function listDocumentsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { applicationId } = request.params as { applicationId: string };
  const docs = await documentsService.listDocuments(applicationId);
  return reply.send(docs);
}

export async function uploadDocumentHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: "Nessun file caricato" });
    }
    const doc = await documentsService.uploadDocument(id, data, request.user!.id);
    return reply.status(201).send(doc);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function updateDocumentHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { status, rejectionReason } = request.body as { status: string; rejectionReason?: string };
  try {
    const doc = await documentsService.updateDocumentStatus(id, status, rejectionReason);
    return reply.send(doc);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function deleteDocumentHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    await documentsService.deleteDocument(id);
    return reply.send({ message: "Documento eliminato con successo" });
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}
