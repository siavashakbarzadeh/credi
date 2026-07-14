import prisma from "../../lib/prisma.js";

export async function listApplicants(page = 1, limit = 20, search?: string) {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        deletedAt: null,
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { codiceFiscale: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { deletedAt: null };

  const [applicants, total] = await Promise.all([
    prisma.applicant.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.applicant.count({ where }),
  ]);

  return { applicants, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getApplicantById(id: string) {
  const applicant = await prisma.applicant.findFirst({
    where: { id, deletedAt: null },
    include: {
      applications: {
        select: {
          id: true,
          status: true,
          loanType: true,
          requestedAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!applicant) throw new Error("Richiedente non trovato");
  return applicant;
}

export async function createApplicant(data: any) {
  return prisma.applicant.create({
    data: {
      ...data,
      birthDate: new Date(data.birthDate),
      idDocExpiry: data.idDocExpiry ? new Date(data.idDocExpiry) : null,
    },
  });
}

export async function updateApplicant(id: string, data: any) {
  const updateData: any = { ...data };
  if (data.birthDate) updateData.birthDate = new Date(data.birthDate);
  if (data.idDocExpiry) updateData.idDocExpiry = new Date(data.idDocExpiry);

  const applicant = await prisma.applicant.findFirst({
    where: { id, deletedAt: null },
  });
  if (!applicant) throw new Error("Richiedente non trovato");

  return prisma.applicant.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteApplicant(id: string) {
  const applicant = await prisma.applicant.findFirst({
    where: { id, deletedAt: null },
  });
  if (!applicant) throw new Error("Richiedente non trovato");

  return prisma.applicant.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export default { listApplicants, getApplicantById, createApplicant, updateApplicant, deleteApplicant };
