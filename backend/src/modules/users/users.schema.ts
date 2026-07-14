import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  role: z.enum(["ADMIN", "MANAGER", "LOAN_OFFICER", "REVIEWER"]),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "MANAGER", "LOAN_OFFICER", "REVIEWER"]).optional(),
  active: z.boolean().optional(),
});
