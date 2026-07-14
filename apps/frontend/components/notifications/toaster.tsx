"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "error" | "info";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastsState: Toast[] = [];

export function toast(title: string, message?: string, type: "success" | "error" | "info" = "info") {
  const id = Math.random().toString(36).substring(7);
  const newToast = { id, title, message, type };
  toastsState = [...toastsState, newToast];
  toastListeners.forEach((l) => l(toastsState));

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(toastsState));
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>(toastsState);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-bottom-5",
            t.type === "error" && "border-destructive",
            t.type === "success" && "border-green-500"
          )}
        >
          <p className="text-sm font-medium">{t.title}</p>
          {t.message && <p className="mt-1 text-sm text-muted-foreground">{t.message}</p>}
        </div>
      ))}
    </div>
  );
}
