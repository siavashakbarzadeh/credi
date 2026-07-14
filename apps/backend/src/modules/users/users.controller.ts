import { FastifyRequest, FastifyReply } from "fastify";
import * as usersService from "./users.service.js";

export async function listUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit } = request.query as { page?: string; limit?: string };
  const result = await usersService.listUsers(
    parseInt(page || "1"),
    parseInt(limit || "20")
  );
  return reply.send(result);
}

export async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const user = await usersService.getUserById(id);
    return reply.send(user);
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

export async function getLoanOfficersHandler(request: FastifyRequest, reply: FastifyReply) {
  const officers = await usersService.getLoanOfficers();
  return reply.send(officers);
}
