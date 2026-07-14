import { FastifyInstance } from "fastify";
import {
  listUsersHandler,
  getUserHandler,
  getLoanOfficersHandler,
} from "./users.controller.js";

export async function usersRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/", { preHandler: [authenticate] }, listUsersHandler);
  fastify.get("/loan-officers", { preHandler: [authenticate] }, getLoanOfficersHandler);
  fastify.get("/:id", { preHandler: [authenticate] }, getUserHandler);
}
