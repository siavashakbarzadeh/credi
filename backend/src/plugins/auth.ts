import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
  }
}

export async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = extractToken(request);
        if (!token) {
          return reply.status(401).send({ error: "Token di autenticazione mancante" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
          email: string;
          role: string;
        };

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, role: true, firstName: true, lastName: true, active: true },
        });

        if (!user || !user.active) {
          return reply.status(401).send({ error: "Utente non valido o disattivato" });
        }

        request.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      } catch (err) {
        return reply.status(401).send({ error: "Token non valido o scaduto" });
      }
    }
  );
}

function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const cookieToken = request.cookies?.access_token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}
