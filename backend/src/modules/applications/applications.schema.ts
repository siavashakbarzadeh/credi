import { z } from "zod";

export const createApplicationSchema = z.object({
  applicantId: z.string().uuid("ID richiedente non valido").optional(),
  applicant: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      codiceFiscale: z.string().min(16).max(16),
      birthDate: z.string(),
      birthPlace: z.string().optional(),
      nationality: z.string().default("Italiana"),
      maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"]).default("SINGLE"),
      dependents: z.number().int().min(0).default(0),
      phone: z.string().min(1),
      email: z.string().email(),
      idDocType: z.string().optional(),
      idDocNumber: z.string().optional(),
      idDocExpiry: z.string().optional(),
      address: z.string().min(1),
      city: z.string().min(1),
      province: z.string().min(1),
      postalCode: z.string(),
      country: z.string().default("Italia"),
      housingStatus: z.enum(["OWNER", "RENTER", "FAMILY", "OTHER"]).default("OTHER"),
      yearsAtAddress: z.number().int().optional(),
    })
    .optional(),
  loanType: z.enum(["PERSONAL", "MORTGAGE", "AUTO", "BUSINESS", "DEBT_CONSOLIDATION", "OTHER"]),
  requestedAmount: z.number().positive("L'importo deve essere positivo"),
  loanPurpose: z.string().min(1, "Finalità del prestito obbligatoria"),
  durationMonths: z.number().int().positive("Durata non valida"),
  monthlyInstallment: z.number().positive().optional(),
  disbursementDate: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  notes: z.string().optional(),
  employment: z
    .object({
      status: z.enum(["EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED", "RETIRED", "STUDENT"]),
      employer: z.string().optional(),
      jobTitle: z.string().optional(),
      contractType: z.enum(["PERMANENT", "FIXED_TERM", "PART_TIME", "FREELANCE", "OTHER"]).optional(),
      startDate: z.string().optional(),
      monthsEmployed: z.number().int().optional(),
      monthlyNetIncome: z.number().optional(),
      monthlyGrossIncome: z.number().optional(),
      otherIncome: z.number().optional(),
      isSelfEmployed: z.boolean().default(false),
      vatNumber: z.string().optional(),
    })
    .optional(),
  financial: z
    .object({
      monthlyHousingCost: z.number().optional(),
      monthlyExpenses: z.number().optional(),
      existingLoans: z.number().optional(),
      totalMonthlyDebt: z.number().optional(),
      totalExistingDebt: z.number().optional(),
      bankName: z.string().optional(),
      iban: z.string().optional(),
      savings: z.number().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  guarantors: z
    .array(
      z.object({
        fullName: z.string().min(1),
        codiceFiscale: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        address: z.string().optional(),
        relationship: z.string().optional(),
        employment: z.string().optional(),
        income: z.number().optional(),
      })
    )
    .optional(),
  collaterals: z
    .array(
      z.object({
        type: z.enum(["REAL_ESTATE", "VEHICLE", "JEWELRY", "SAVINGS", "OTHER"]),
        description: z.string().optional(),
        estimatedValue: z.number().optional(),
        ownershipStatus: z.string().optional(),
        registrationNumber: z.string().optional(),
        insuranceInfo: z.string().optional(),
      })
    )
    .optional(),
  consents: z
    .array(
      z.object({
        consentType: z.string(),
        granted: z.boolean(),
      })
    )
    .optional(),
});

export const updateApplicationSchema = z.object({
  loanType: z.enum(["PERSONAL", "MORTGAGE", "AUTO", "BUSINESS", "DEBT_CONSOLIDATION", "OTHER"]).optional(),
  requestedAmount: z.number().positive().optional(),
  loanPurpose: z.string().min(1).optional(),
  durationMonths: z.number().int().positive().optional(),
  monthlyInstallment: z.number().positive().optional(),
  disbursementDate: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  notes: z.string().optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "PENDING_DOCUMENTS",
    "DOCUMENT_VERIFICATION",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
  ]),
  reason: z.string().optional(),
});

export const assignSchema = z.object({
  userId: z.string().uuid("ID utente non valido"),
});
