import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  console.error(`[Error] ${request.method} ${request.url}:`, error.message);

  if (error.statusCode === 429) {
    return reply.status(429).send({
      error: "Troppe richieste. Riprovare più tardi.",
    });
  }

  if (error.statusCode === 401) {
    return reply.status(401).send({
      error: "Autenticazione richiesta",
    });
  }

  if (error.statusCode === 403) {
    return reply.status(403).send({
      error: "Accesso negato",
    });
  }

  if (error.statusCode === 404) {
    return reply.status(404).send({
      error: "Risorsa non trovata",
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      error: "Dati di input non validi",
      details: error.validation,
    });
  }

  return reply.status(error.statusCode || 500).send({
    error: process.env.NODE_ENV === "production"
      ? "Errore interno del server"
      : error.message,
  });
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Risorsa") {
    super(`${resource} non trovata`, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Autenticazione richiesta") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Permessi insufficienti") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Dati non validi") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}
