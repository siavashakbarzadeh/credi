import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import { corsPlugin } from "./plugins/cors.js";
import { websocketPlugin } from "./plugins/websocket.js";
import { authPlugin } from "./plugins/auth.js";
import { validatePlugin } from "./plugins/validate.js";
import { errorHandler } from "./utils/errors.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { applicantsRoutes } from "./modules/applicants/applicants.routes.js";
import { applicationsRoutes } from "./modules/applications/applications.routes.js";
import { documentsRoutes } from "./modules/documents/documents.routes.js";
import { googleRoutes } from "./modules/google/google.routes.js";
import { webhooksRoutes } from "./modules/webhooks/webhooks.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { notesRoutes } from "./modules/notes/notes.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "development" ? "info" : "warn",
    },
    trustProxy: true,
  });

  app.register(fastifyCookie, {
    secret: process.env.JWT_SECRET || "cookie-secret",
  });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.register(corsPlugin);
  app.register(websocketPlugin);
  app.register(authPlugin);
  app.register(validatePlugin);

  app.setErrorHandler(errorHandler);

  const apiPrefix = "/api";

  app.register(authRoutes, { prefix: `${apiPrefix}/auth` });
  app.register(usersRoutes, { prefix: `${apiPrefix}/users` });
  app.register(applicantsRoutes, { prefix: `${apiPrefix}/applicants` });
  app.register(applicationsRoutes, { prefix: `${apiPrefix}/applications` });
  app.register(documentsRoutes, { prefix: `${apiPrefix}` });
  app.register(googleRoutes, { prefix: `${apiPrefix}` });
  app.register(webhooksRoutes, { prefix: `${apiPrefix}/webhooks` });
  app.register(notificationsRoutes, { prefix: `${apiPrefix}/notifications` });
  app.register(notesRoutes, { prefix: `${apiPrefix}` });
  app.register(dashboardRoutes, { prefix: `${apiPrefix}/dashboard` });
  app.register(healthRoutes, { prefix: `${apiPrefix}/health` });

  return app;
}
