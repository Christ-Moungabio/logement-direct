import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

const email = z
  .string({ error: "Indiquez votre adresse e-mail." })
  .trim()
  .toLowerCase()
  .min(1, "Indiquez votre adresse e-mail.")
  .pipe(z.email("Cette adresse e-mail n'est pas valide."));

const whatsappNumber = z
  .string({ error: "Indiquez votre numéro WhatsApp." })
  .transform((value) => value.replace(/[\s.\-()]/g, ""))
  .pipe(z.string().min(1, "Indiquez votre numéro WhatsApp."))
  .transform((value) => value.replace(/^(\+242|00242|242(?=\d{9}$))/, ""))
  .pipe(z.string().regex(/^\d{9}$/, "Le numéro doit compter 9 chiffres, par exemple 06 123 45 67."))
  .transform((digits) => `+242${digits}`);

export const signupSchema = z
  .object({
    role: z.enum(["tenant", "owner"], { error: "Choisissez votre profil." }),
    fullName: z
      .string({ error: "Indiquez votre nom complet." })
      .trim()
      .min(2, "Indiquez votre nom complet.")
      .max(80, "80 caractères maximum."),
    email,
    whatsappNumber,
    password: z
      .string({ error: "Choisissez un mot de passe." })
      .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit compter au moins ${PASSWORD_MIN_LENGTH} caractères.`)
      .max(72, "72 caractères maximum."),
    passwordConfirm: z.string({ error: "Confirmez votre mot de passe." }),
    terms: z.literal("on", { error: "Vous devez accepter les conditions d'utilisation." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Les deux mots de passe ne sont pas identiques.",
    when: ({ value }) =>
      typeof value?.password === "string" && typeof value?.passwordConfirm === "string",
  });

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Indiquez votre mot de passe." }).min(1, "Indiquez votre mot de passe."),
});

export function fieldErrors(error) {
  return z.flattenError(error).fieldErrors;
}
