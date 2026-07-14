import { FastifyInstance } from "fastify";
import {
  listApplicantsHandler,
  getApplicantHandler,
  createApplicantHandler,
  updateApplicantHandler,
  deleteApplicantHandler,
} from "./applicants.controller.js";

export async function applicantsRoutes(fastify: FastifyInstance) {
  const authenticate = (fastify as any).authenticate;

  fastify.get("/", { preHandler: [authenticate] }, listApplicantsHandler);
  fastify.post("/", { preHandler: [authenticate] }, createApplicantHandler);
  fastify.get("/:id", { preHandler: [authenticate] }, getApplicantHandler);
  fastify.patch("/:id", { preHandler: [authenticate] }, updateApplicantHandler);
  fastify.delete("/:id", { preHandler: [authenticate] }, deleteApplicantHandler);
}
