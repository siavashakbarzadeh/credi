import { FastifyRequest, FastifyReply } from "fastify";

type Role = "ADMIN" | "MANAGER" | "LOAN_OFFICER" | "REVIEWER";

export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: "Autenticazione richiesta" });
    }

    if (!roles.includes(request.user.role as Role)) {
      return reply.status(403).send({
        error: "Permessi insufficienti",
        required: roles,
        current: request.user.role,
      });
    }
  };
}
