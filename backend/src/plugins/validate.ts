import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ZodSchema, ZodError } from "zod";

export async function validatePlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "validate",
    async (request: FastifyRequest, reply: FastifyReply, schema: {
      body?: ZodSchema;
      query?: ZodSchema;
      params?: ZodSchema;
    }) => {
      try {
        if (schema.body) {
          request.body = schema.body.parse(request.body);
        }
        if (schema.query) {
          request.query = schema.query.parse(request.query) as any;
        }
        if (schema.params) {
          request.params = schema.params.parse(request.params) as any;
        }
      } catch (err) {
        if (err instanceof ZodError) {
          return reply.status(400).send({
            error: "Dati non validi",
            details: err.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          });
        }
        throw err;
      }
    }
  );
}
