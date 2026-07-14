import { FastifyRequest, FastifyReply } from "fastify";
import * as applicationsService from "./applications.service.js";

export async function listApplicationsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, status, officerId, search, minAmount, maxAmount } = request.query as any;
  const result = await applicationsService.listApplications(
    parseInt(page || "1"),
    parseInt(limit || "20"),
    { status, officerId, search, minAmount: minAmount ? parseFloat(minAmount) : undefined, maxAmount: maxAmount ? parseFloat(maxAmount) : undefined }
  );
  return reply.send(result);
}

export async function getApplicationHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const app = await applicationsService.getApplicationById(id);
    return reply.send(app);
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function createApplicationHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const app = await applicationsService.createApplication(request.body, request.user!.id);
    return reply.status(201).send(app);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function updateApplicationHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const app = await applicationsService.updateApplication(id, request.body);
    return reply.send(app);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function updateStatusHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { status, reason } = request.body as { status: string; reason?: string };
  try {
    const app = await applicationsService.updateApplicationStatus(id, status, reason, request.user!.id);
    return reply.send(app);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function assignHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { userId } = request.body as { userId: string };
  try {
    const result = await applicationsService.assignApplication(id, userId, request.user!.id);
    return reply.send(result);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function deleteApplicationHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    await applicationsService.softDeleteApplication(id);
    return reply.send({ message: "Pratica eliminata con successo" });
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function getActivityHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const activity = await applicationsService.getApplicationActivity(id);
  return reply.send(activity);
}
