import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Please enter a valid email" })),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Please enter a valid email" })),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Please enter a valid email" })),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const totpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, { message: "Enter the 6-digit code from your authenticator app" })
    .max(32, { message: "Code is too long" }),
});

export const verifyTotpSchema = totpCodeSchema.extend({
  rememberDevice: z.boolean(),
});

export type LoginFormSchemaType = z.infer<typeof loginSchema>;
export type SignupFormSchemaType = z.infer<typeof signupSchema>;
export type ForgotPasswordFormSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormSchemaType = z.infer<typeof resetPasswordSchema>;
export type TotpCodeFormSchemaType = z.infer<typeof totpCodeSchema>;
export type VerifyTotpFormSchemaType = z.infer<typeof verifyTotpSchema>;
