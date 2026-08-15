import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code")
    .optional()
    .or(z.literal("")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
