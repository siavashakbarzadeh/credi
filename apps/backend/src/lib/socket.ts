import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initSocketIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connesso: ${socket.id}`);

    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] Utente ${userId} nella stanza user:${userId}`);
    });

    socket.on("leave", (userId: string) => {
      socket.leave(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnesso: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO non inizializzato");
  }
  return io;
}

export function emitToUser(userId: string, event: string, data: unknown) {
  const server = getIO();
  server.to(`user:${userId}`).emit(event, data);
}

export function emitToAll(event: string, data: unknown) {
  const server = getIO();
  server.emit(event, data);
}

export default { initSocketIO, getIO, emitToUser, emitToAll };
