"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "../../components/notifications/toaster";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      socket = io(WS_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        console.log("[Socket] Connesso");
        socket?.emit("join", userId);
      });

      socket.on("notification", (data: any) => {
        toast(data.title, data.message, "info");
      });

      socket.on("disconnect", () => {
        console.log("[Socket] Disconnesso");
      });

      socket.on("connect_error", (err) => {
        console.error("[Socket] Errore connessione:", err.message);
      });
    }

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave", userId);
      }
    };
  }, [userId]);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, emit };
}
