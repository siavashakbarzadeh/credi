import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma.js";
import { emitToUser } from "../../lib/socket.js";
import { logger } from "../../utils/logger.js";

export async function webhooksRoutes(fastify: FastifyInstance) {
  fastify.post("/google-drive", async (request: FastifyRequest, reply: FastifyReply) => {
    const channelId = request.headers["x-goog-channel-id"] as string;
    const resourceId = request.headers["x-goog-resource-id"] as string;
    const resourceState = request.headers["x-goog-resource-state"] as string;
    const syncToken = request.headers["x-goog-resource-uri"] as string;

    logger.info("[Webhook] Ricevuto notifica Google Drive", {
      channelId,
      resourceId,
      resourceState,
    });

    if (!channelId) {
      return reply.status(400).send({ error: "Channel ID mancante" });
    }

    const watchChannel = await prisma.documentWatchChannel.findUnique({
      where: { channelId },
      include: {
        application: {
          include: {
            assignments: true,
            linkedGoogleDocs: true,
          },
        },
      },
    });

    if (!watchChannel) {
      logger.warn("[Webhook] Canale non trovato", { channelId });
      return reply.status(200).send({ status: "ignored" });
    }

    if (!watchChannel.active) {
      return reply.status(200).send({ status: "inactive" });
    }

    if (resourceState === "sync") {
      if (syncToken) {
        await prisma.documentWatchChannel.update({
          where: { channelId },
          data: { syncToken },
        });
      }
      return reply.status(200).send({ status: "sync_update" });
    }

    if (resourceState === "update") {
      const application = watchChannel.application;

      await prisma.activityLog.create({
        data: {
          action: "GOOGLE_DOC_UPDATED",
          details: {
            channelId,
            resourceId,
            timestamp: new Date().toISOString(),
          },
          userId: application.linkedByUserId || application.assignments[0]?.userId || "system",
          applicationId: application.id,
        },
      });

      for (const assignment of application.assignments) {
        const notification = await prisma.notification.create({
          data: {
            type: "GOOGLE_DOC_UPDATED",
            title: "Documento Google aggiornato",
            message: "Il documento Google collegato alla pratica è stato modificato.",
            userId: assignment.userId,
            applicationId: application.id,
          },
        });

        emitToUser(assignment.userId, "notification", {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          applicationId: application.id,
        });
      }

      if (application.linkedByUserId) {
        const alreadyNotified = application.assignments.some(
          (a: any) => a.userId === application.linkedByUserId
        );
        if (!alreadyNotified) {
          const notification = await prisma.notification.create({
            data: {
              type: "GOOGLE_DOC_UPDATED",
              title: "Documento Google aggiornato",
              message: "Il documento Google che hai collegato è stato modificato.",
              userId: application.linkedByUserId,
              applicationId: application.id,
            },
          });

          emitToUser(application.linkedByUserId, "notification", {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            applicationId: application.id,
          });
        }
      }
    }

    return reply.status(200).send({ status: "processed" });
  });
}
