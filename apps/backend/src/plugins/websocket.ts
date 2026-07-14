import { FastifyInstance } from "fastify";
import { Server } from "http";
import { initSocketIO } from "../lib/socket.js";

export async function websocketPlugin(fastify: FastifyInstance) {
  fastify.addHook("onReady", async () => {
    const httpServer = fastify.server as unknown as Server;
    initSocketIO(httpServer);
    console.log("[WebSocket] Socket.IO inizializzato");
  });
}
