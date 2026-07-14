import prisma from "../../lib/prisma.js";

export async function getDashboardStats(userId?: string) {
  const [
    totalApplications,
    applicationsByStatus,
    recentApplications,
    totalApplicants,
    pendingDocuments,
    recentNotifications,
  ] = await Promise.all([
    prisma.loanApplication.count({ where: { deletedAt: null } }),
    prisma.loanApplication.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.loanApplication.findMany({
      where: { deletedAt: null },
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        assignments: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.applicant.count({ where: { deletedAt: null } }),
    prisma.uploadedDocument.count({ where: { status: "PENDING" } }),
    userId
      ? prisma.notification.findMany({
          where: { userId, read: false },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [],
  ]);

  const statusCounts: Record<string, number> = {};
  applicationsByStatus.forEach((s) => {
    statusCounts[s.status] = s._count.id;
  });

  const totalValue = await prisma.loanApplication.aggregate({
    where: { deletedAt: null },
    _sum: { requestedAmount: true },
  });

  return {
    totalApplications,
    applicationsByStatus: statusCounts,
    recentApplications,
    totalApplicants,
    pendingDocuments,
    recentNotifications,
    totalValue: totalValue._sum.requestedAmount || 0,
  };
}

export default { getDashboardStats };
