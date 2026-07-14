import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}
