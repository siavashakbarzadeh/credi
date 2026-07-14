import { nanoid } from "nanoid";
import prisma from "./prisma.js";
import { createWatchChannel, stopWatchChannel } from "./google-drive.js";
import { googleWatchRenewalQueue } from "./bullmq.js";

const WATCH_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function startWatchForApplication(
  userId: string,
  applicationId: string,
  fileId: string
) {
  const existing = await prisma.documentWatchChannel.findFirst({
    where: { applicationId, active: true },
  });

  if (existing) {
    await stopWatchForApplication(existing.channelId, existing.resourceId || "");
  }

  const channelId = nanoid();
  const expiration = Date.now() + WATCH_DURATION_MS;
  const webhookUrl = `${process.env.BACKEND_URL}/api/webhooks/google-drive`;

  const result = await createWatchChannel(userId, fileId, webhookUrl, channelId, expiration);

  const watchChannel = await prisma.documentWatchChannel.create({
    data: {
      channelId: result.channelId,
      resourceId: result.resourceId,
      expiration: new Date(expiration),
      applicationId,
    },
  });

  await googleWatchRenewalQueue.add(
    "renew",
    { channelId: result.channelId, applicationId },
    { delay: WATCH_DURATION_MS - 10 * 60 * 1000 }
  );

  return watchChannel;
}

export async function stopWatchForApplication(channelId: string, resourceId: string) {
  try {
    await stopWatchChannel("system", channelId, resourceId);
  } catch (err) {
    console.error("[GoogleWatch] Errore arresto watch channel:", err);
  }

  await prisma.documentWatchChannel.update({
    where: { channelId },
    data: { active: false },
  });
}

export async function renewWatchChannel(channelId: string, applicationId: string) {
  const watch = await prisma.documentWatchChannel.findUnique({
    where: { channelId },
    include: { application: { include: { linkedGoogleDocs: true } } },
  });

  if (!watch || !watch.active) {
    return null;
  }

  if (!watch.application.linkedGoogleDocs.length) {
    await prisma.documentWatchChannel.update({
      where: { channelId },
      data: { active: false },
    });
    return null;
  }

  const fileId = watch.application.linkedGoogleDocs[0].googleFileId;

  await stopWatchForApplication(watch.channelId, watch.resourceId || "");

  return startWatchForApplication("system", applicationId, fileId);
}

export default { startWatchForApplication, stopWatchForApplication, renewWatchChannel };
