import { FastifyRequest, FastifyReply } from "fastify";
import * as googleService from "./google.service.js";

export async function createDocHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const result = await googleService.createGoogleDocForApplication(id, request.user!.id);
    return reply.status(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function linkDocHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { googleDocId } = request.body as { googleDocId: string };
  try {
    const result = await googleService.linkGoogleDocToApplication(id, googleDocId, request.user!.id);
    return reply.status(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function getDocHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const doc = await googleService.getLinkedGoogleDoc(id);
    return reply.send(doc);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function watchDocHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const watch = await googleService.startWatchForDoc(id, request.user!.id);
    return reply.status(201).send(watch);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function syncDocHandler(request: FastifyRequest, reply: FastifyReply) {
  const { applicationId } = request.params as { applicationId: string };
  try {
    const metadata = await googleService.syncGoogleDoc(applicationId, request.user!.id);
    return reply.send(metadata);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}
