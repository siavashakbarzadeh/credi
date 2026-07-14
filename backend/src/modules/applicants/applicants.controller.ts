import { FastifyRequest, FastifyReply } from "fastify";
import * as applicantsService from "./applicants.service.js";

export async function listApplicantsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, search } = request.query as {
    page?: string;
    limit?: string;
    search?: string;
  };
  const result = await applicantsService.listApplicants(
    parseInt(page || "1"),
    parseInt(limit || "20"),
    search
  );
  return reply.send(result);
}

export async function getApplicantHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const applicant = await applicantsService.getApplicantById(id);
    return reply.send(applicant);
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function createApplicantHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const applicant = await applicantsService.createApplicant(request.body);
    return reply.status(201).send(applicant);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function updateApplicantHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const applicant = await applicantsService.updateApplicant(id, request.body);
    return reply.send(applicant);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

export async function deleteApplicantHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    await applicantsService.deleteApplicant(id);
    return reply.send({ message: "Richiedente eliminato con successo" });
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}
