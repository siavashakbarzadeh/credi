import prisma from "../../lib/prisma.js";
import { createGoogleDoc, getGoogleDocMetadata } from "../../lib/google-docs.js";
import { getDriveFileMetadata, createWatchChannel, stopWatchChannel } from "../../lib/google-drive.js";
import { startWatchForApplication } from "../../lib/google-watch.js";
import { nanoid } from "nanoid";
import { logger } from "../../utils/logger.js";

export async function createGoogleDocForApplication(applicationId: string, userId: string) {
  const app = await prisma.loanApplication.findFirst({
    where: { id: applicationId, deletedAt: null },
    include: { applicant: true },
  });
  if (!app) throw new Error("Pratica non trovata");

  const existing = await prisma.linkedGoogleDocument.findUnique({
    where: { applicationId },
  });
  if (existing) throw new Error("Questa pratica ha già un documento Google collegato");

  const title = `Pratica - ${app.applicant.firstName} ${app.applicant.lastName} - ${app.loanType}`;
  const doc = await createGoogleDoc(userId, title);

  const linked = await prisma.linkedGoogleDocument.create({
    data: {
      googleDocId: doc.documentId,
      googleFileId: doc.documentId,
      applicationId,
      linkedById: userId,
    },
  });

  await prisma.loanApplication.update({
    where: { id: applicationId },
    data: {
      googleDocId: doc.documentId,
      googleFileId: doc.documentId,
      linkedByUserId: userId,
      linkedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "GOOGLE_DOC_CREATED",
      details: { documentId: doc.documentId, title: doc.title },
      userId,
      applicationId,
    },
  });

  return linked;
}

export async function linkGoogleDocToApplication(
  applicationId: string,
  googleDocId: string,
  userId: string
) {
  const app = await prisma.loanApplication.findFirst({
    where: { id: applicationId, deletedAt: null },
  });
  if (!app) throw new Error("Pratica non trovata");

  const existing = await prisma.linkedGoogleDocument.findUnique({
    where: { applicationId },
  });
  if (existing) throw new Error("Questa pratica ha già un documento Google collegato");

  const metadata = await getDriveFileMetadata(userId, googleDocId);

  const linked = await prisma.linkedGoogleDocument.create({
    data: {
      googleDocId,
      googleFileId: metadata.id || googleDocId,
      applicationId,
      linkedById: userId,
    },
  });

  await prisma.loanApplication.update({
    where: { id: applicationId },
    data: {
      googleDocId,
      googleFileId: metadata.id || googleDocId,
      linkedByUserId: userId,
      linkedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "GOOGLE_DOC_LINKED",
      details: { documentId: googleDocId, title: metadata.name },
      userId,
      applicationId,
    },
  });

  return linked;
}

export async function getLinkedGoogleDoc(applicationId: string) {
  const linked = await prisma.linkedGoogleDocument.findUnique({
    where: { applicationId },
    include: {
      linkedBy: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!linked) return null;

  const watchChannels = await prisma.documentWatchChannel.findMany({
    where: { applicationId, active: true },
  });

  return { ...linked, watchChannels };
}

export async function startWatchForDoc(applicationId: string, userId: string) {
  const linked = await prisma.linkedGoogleDocument.findUnique({
    where: { applicationId },
  });
  if (!linked) throw new Error("Nessun documento Google collegato a questa pratica");

  const watch = await startWatchForApplication(userId, applicationId, linked.googleFileId);

  await prisma.activityLog.create({
    data: {
      action: "WATCH_STARTED",
      details: { channelId: watch.channelId },
      userId,
      applicationId,
    },
  });

  return watch;
}

export async function syncGoogleDoc(applicationId: string, userId: string) {
  const linked = await prisma.linkedGoogleDocument.findUnique({
    where: { applicationId },
  });
  if (!linked) throw new Error("Nessun documento Google collegato");

  const metadata = await getDriveFileMetadata(userId, linked.googleFileId);

  await prisma.linkedGoogleDocument.update({
    where: { applicationId },
    data: { lastSyncedAt: new Date() },
  });

  await prisma.activityLog.create({
    data: {
      action: "GOOGLE_DOC_SYNCED",
      details: { title: metadata.name, modifiedTime: metadata.modifiedTime },
      userId,
      applicationId,
    },
  });

  return metadata;
}

export default {
  createGoogleDocForApplication,
  linkGoogleDocToApplication,
  getLinkedGoogleDoc,
  startWatchForDoc,
  syncGoogleDoc,
};
