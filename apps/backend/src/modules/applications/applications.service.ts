import prisma from "../../lib/prisma.js";
import { emitToUser } from "../../lib/socket.js";
import { logger } from "../../utils/logger.js";

export async function listApplications(
  page = 1,
  limit = 20,
  filters: {
    status?: string;
    officerId?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
  } = {}
) {
  const skip = (page - 1) * limit;
  const where: any = { deletedAt: null };

  if (filters.status) where.status = filters.status;
  if (filters.officerId) {
    where.assignments = { some: { userId: filters.officerId } };
  }
  if (filters.minAmount || filters.maxAmount) {
    where.requestedAmount = {};
    if (filters.minAmount) where.requestedAmount.gte = filters.minAmount;
    if (filters.maxAmount) where.requestedAmount.lte = filters.maxAmount;
  }
  if (filters.search) {
    where.OR = [
      { applicant: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { applicant: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { applicant: { codiceFiscale: { contains: filters.search, mode: "insensitive" } } },
      { loanPurpose: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.loanApplication.findMany({
      where,
      skip,
      take: limit,
      include: {
        applicant: {
          select: { id: true, firstName: true, lastName: true, codiceFiscale: true, phone: true, email: true },
        },
        assignments: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        documents: {
          select: { id: true, documentType: true, status: true },
        },
        _count: { select: { documents: true, internalNotes: true, notifications: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.loanApplication.count({ where }),
  ]);

  return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getApplicationById(id: string) {
  const app = await prisma.loanApplication.findFirst({
    where: { id, deletedAt: null },
    include: {
      applicant: true,
      employment: true,
      financialProfile: true,
      guarantors: true,
      collaterals: true,
      documents: {
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      notes: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      assignments: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        },
      },
      statusHistory: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      linkedGoogleDocs: true,
      watchChannels: { where: { active: true } },
      consents: {
        include: {
          recordedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!app) throw new Error("Pratica non trovata");

  const missingDocTypes = getMissingDocumentTypes(app.documents);
  return { ...app, missingDocumentTypes: missingDocTypes };
}

function getMissingDocumentTypes(documents: any[]) {
  const requiredTypes = ["ID_CARD", "INCOME_PROOF", "PAYSLIP", "BANK_STATEMENT", "TAX_DOCUMENT", "RESIDENCE_PROOF"];
  const uploadedTypes = new Set(documents.map((d) => d.documentType));
  return requiredTypes.filter((t) => !uploadedTypes.has(t));
}

export async function createApplication(data: any, userId: string) {
  const result = await prisma.$transaction(async (tx: any) => {
    let applicantId = data.applicantId;

    if (!applicantId && data.applicant) {
      const applicant = await tx.applicant.create({
        data: {
          ...data.applicant,
          birthDate: new Date(data.applicant.birthDate),
          idDocExpiry: data.applicant.idDocExpiry ? new Date(data.applicant.idDocExpiry) : null,
        },
      });
      applicantId = applicant.id;
    }

    if (!applicantId) {
      throw new Error("Richiedente obbligatorio: fornire applicantId o dati del richiedente");
    }

    const application = await tx.loanApplication.create({
      data: {
        loanType: data.loanType,
        requestedAmount: data.requestedAmount,
        loanPurpose: data.loanPurpose,
        durationMonths: data.durationMonths,
        monthlyInstallment: data.monthlyInstallment || null,
        disbursementDate: data.disbursementDate ? new Date(data.disbursementDate) : null,
        urgency: data.urgency || "MEDIUM",
        notes: data.notes || null,
        applicantId,
        status: "DRAFT",
      },
    });

    if (data.employment) {
      await tx.employmentInfo.create({
        data: {
          ...data.employment,
          startDate: data.employment.startDate ? new Date(data.employment.startDate) : null,
          monthlyNetIncome: data.employment.monthlyNetIncome || null,
          monthlyGrossIncome: data.employment.monthlyGrossIncome || null,
          otherIncome: data.employment.otherIncome || null,
          applicationId: application.id,
        },
      });
    }

    if (data.financial) {
      await tx.financialProfile.create({
        data: {
          ...data.financial,
          monthlyHousingCost: data.financial.monthlyHousingCost || null,
          monthlyExpenses: data.financial.monthlyExpenses || null,
          existingLoans: data.financial.existingLoans || null,
          totalMonthlyDebt: data.financial.totalMonthlyDebt || null,
          totalExistingDebt: data.financial.totalExistingDebt || null,
          savings: data.financial.savings || null,
          applicationId: application.id,
        },
      });
    }

    if (data.guarantors?.length) {
      await tx.guarantor.createMany({
        data: data.guarantors.map((g: any) => ({
          ...g,
          income: g.income || null,
          applicationId: application.id,
        })),
      });
    }

    if (data.collaterals?.length) {
      await tx.collateral.createMany({
        data: data.collaterals.map((c: any) => ({
          ...c,
          estimatedValue: c.estimatedValue || null,
          applicationId: application.id,
        })),
      });
    }

    await tx.applicationAssignment.create({
      data: {
        userId,
        applicationId: application.id,
      },
    });

    await tx.activityLog.create({
      data: {
        action: "CREATED",
        details: { description: "Pratica creata" },
        userId,
        applicationId: application.id,
      },
    });

    await tx.statusHistory.create({
      data: {
        toStatus: "DRAFT",
        reason: "Pratica creata",
        userId,
        applicationId: application.id,
      },
    });

    if (data.consents?.length) {
      await tx.consentRecord.createMany({
        data: data.consents.map((c: any) => ({
          consentType: c.consentType,
          granted: c.granted,
          applicationId: application.id,
          recordedById: userId,
        })),
      });
    }

    return application;
  });

  return getApplicationById(result.id);
}

export async function updateApplication(id: string, data: any) {
  const app = await prisma.loanApplication.findFirst({
    where: { id, deletedAt: null },
  });
  if (!app) throw new Error("Pratica non trovata");

  return prisma.loanApplication.update({
    where: { id },
    data: {
      ...data,
      disbursementDate: data.disbursementDate ? new Date(data.disbursementDate) : undefined,
    },
  });
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  reason: string | undefined,
  userId: string
) {
  const app = await prisma.loanApplication.findFirst({
    where: { id, deletedAt: null },
  });
  if (!app) throw new Error("Pratica non trovata");

  const result = await prisma.$transaction(async (tx: any) => {
    const updated = await tx.loanApplication.update({
      where: { id },
      data: { status: status as any },
    });

    await tx.statusHistory.create({
      data: {
        fromStatus: app.status,
        toStatus: status as any,
        reason: reason || null,
        userId,
        applicationId: id,
      },
    });

    await tx.activityLog.create({
      data: {
        action: "STATUS_CHANGED",
        details: { from: app.status, to: status, reason: reason || null },
        userId,
        applicationId: id,
      },
    });

    return updated;
  });

  const statusLabels: Record<string, string> = {
    DRAFT: "Bozza",
    SUBMITTED: "Sottoposta",
    UNDER_REVIEW: "In revisione",
    PENDING_DOCUMENTS: "Documenti in attesa",
    DOCUMENT_VERIFICATION: "Verifica documentale",
    APPROVED: "Approvata",
    REJECTED: "Rifiutata",
    DISBURSED: "Erogata",
    CLOSED: "Chiusa",
  };

  const notifications = await prisma.applicationAssignment.findMany({
    where: { applicationId: id },
    select: { userId: true },
  });

  for (const n of notifications) {
    const notification = await prisma.notification.create({
      data: {
        type: "STATUS_CHANGE",
        title: "Stato pratica aggiornato",
        message: `Lo stato della pratica è stato aggiornato a "${statusLabels[status] || status}".`,
        userId: n.userId,
        applicationId: id,
      },
    });

    emitToUser(n.userId, "notification", {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      applicationId: id,
    });
  }

  return result;
}

export async function assignApplication(id: string, userId: string, assignedBy: string) {
  const app = await prisma.loanApplication.findFirst({
    where: { id, deletedAt: null },
  });
  if (!app) throw new Error("Pratica non trovata");

  const result = await prisma.$transaction(async (tx: any) => {
    await tx.applicationAssignment.upsert({
      where: { applicationId: id },
      update: { userId },
      create: { applicationId: id, userId },
    });

    await tx.activityLog.create({
      data: {
        action: "ASSIGNED",
        details: { assignedTo: userId, assignedBy },
        userId: assignedBy,
        applicationId: id,
      },
    });

    return { success: true };
  });

  const notification = await prisma.notification.create({
    data: {
      type: "CASE_ASSIGNED",
      title: "Pratica assegnata",
      message: "Ti è stata assegnata una nuova pratica.",
      userId,
      applicationId: id,
    },
  });

  emitToUser(userId, "notification", {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    applicationId: id,
  });

  return result;
}

export async function softDeleteApplication(id: string) {
  const app = await prisma.loanApplication.findFirst({
    where: { id, deletedAt: null },
  });
  if (!app) throw new Error("Pratica non trovata");

  return prisma.loanApplication.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function getApplicationActivity(id: string) {
  return prisma.activityLog.findMany({
    where: { applicationId: id },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  assignApplication,
  softDeleteApplication,
  getApplicationActivity,
};
