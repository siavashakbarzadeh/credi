type LogLevel = "info" | "warn" | "error" | "debug";

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatLog("info", message, context));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatLog("warn", message, context));
  },
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(formatLog("error", message, context));
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      console.log(formatLog("debug", message, context));
    }
  },
};

export default logger;
