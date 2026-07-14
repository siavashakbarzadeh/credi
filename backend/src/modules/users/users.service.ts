import prisma from "../../lib/prisma.js";

export async function listUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        createdAt: true,
        _count: { select: { assignments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: { active: true } }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
      _count: { select: { assignments: true, internalNotes: true, activityLogs: true } },
    },
  });

  if (!user) throw new Error("Utente non trovato");
  return user;
}

export async function getLoanOfficers() {
  return prisma.user.findMany({
    where: { role: { in: ["LOAN_OFFICER", "MANAGER"] }, active: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
    orderBy: { firstName: "asc" },
  });
}

export default { listUsers, getUserById, getLoanOfficers };
