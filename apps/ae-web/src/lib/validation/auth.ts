import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("email")),
    password: z.string().min(6, t("passwordLength"))
  });

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
