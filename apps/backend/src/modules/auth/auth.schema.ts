import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password obbligatoria"),
});

export const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  role: z.enum(["ADMIN", "MANAGER", "LOAN_OFFICER", "REVIEWER"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
