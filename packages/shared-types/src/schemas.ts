import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password obbligatoria"),
});

export const createApplicantSchema = z.object({
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  codiceFiscale: z.string().min(16, "Codice fiscale non valido").max(16),
  birthDate: z.string(),
  birthPlace: z.string().optional(),
  nationality: z.string().default("Italiana"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"]).default("SINGLE"),
  dependents: z.number().int().min(0).default(0),
  phone: z.string().min(1, "Telefono obbligatorio"),
  email: z.string().email("Email non valida"),
  idDocType: z.string().optional(),
  idDocNumber: z.string().optional(),
  idDocExpiry: z.string().optional(),
  address: z.string().min(1, "Indirizzo obbligatorio"),
  city: z.string().min(1, "Città obbligatoria"),
  province: z.string().min(1, "Provincia obbligatoria"),
  postalCode: z.string().min(5, "CAP non valido").max(5),
  country: z.string().default("Italia"),
  housingStatus: z.enum(["OWNER", "RENTER", "FAMILY", "OTHER"]).default("OTHER"),
  yearsAtAddress: z.number().int().min(0).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum([
    "DRAFT", "SUBMITTED", "UNDER_REVIEW", "PENDING_DOCUMENTS",
    "DOCUMENT_VERIFICATION", "APPROVED", "REJECTED", "DISBURSED", "CLOSED",
  ]),
  reason: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});
