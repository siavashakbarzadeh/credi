import prisma from "../../lib/prisma.js";

export async function listNotes(applicationId: string) {
  return prisma.internalNote.findMany({
    where: { applicationId },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createNote(applicationId: string, content: string, userId: string) {
  const note = await prisma.internalNote.create({
    data: {
      content,
      applicationId,
      userId,
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "NOTE_ADDED",
      details: { preview: content.substring(0, 100) },
      userId,
      applicationId,
    },
  });

  return note;
}

export default { listNotes, createNote };
