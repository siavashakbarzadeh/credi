import prisma from "../../lib/prisma.js";

export async function logActivity(data: {
  action: string;
  details?: Record<string, unknown>;
  userId: string;
  applicationId?: string;
}) {
  return prisma.activityLog.create({
    data: {
      action: data.action,
      details: data.details || {},
      userId: data.userId,
      applicationId: data.applicationId,
    },
  });
}

export async function getRecentActivity(limit = 20) {
  return prisma.activityLog.findMany({
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
      application: {
        select: {
          id: true,
          applicant: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export default { logActivity, getRecentActivity };
