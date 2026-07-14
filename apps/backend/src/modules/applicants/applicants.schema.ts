import { z } from "zod";

export const createApplicantSchema = z.object({
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  codiceFiscale: z.string().min(16, "Codice fiscale non valido").max(16),
  birthDate: z.string().or(z.date()),
  birthPlace: z.string().optional(),
  nationality: z.string().default("Italiana"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"]).default("SINGLE"),
  dependents: z.number().int().min(0).default(0),
  phone: z.string().min(1, "Telefono obbligatorio"),
  email: z.string().email("Email non valida"),
  idDocType: z.string().optional(),
  idDocNumber: z.string().optional(),
  idDocExpiry: z.string().or(z.date()).optional(),
  address: z.string().min(1, "Indirizzo obbligatorio"),
  city: z.string().min(1, "Città obbligatoria"),
  province: z.string().min(1, "Provincia obbligatoria"),
  postalCode: z.string().min(5, "CAP non valido").max(5),
  country: z.string().default("Italia"),
  housingStatus: z.enum(["OWNER", "RENTER", "FAMILY", "OTHER"]).default("OTHER"),
  yearsAtAddress: z.number().int().min(0).optional(),
});

export const updateApplicantSchema = createApplicantSchema.partial();
