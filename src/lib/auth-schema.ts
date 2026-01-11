import { z } from "zod";

export const registrationSchema = z.object({
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  nin: z
    .string()
    .min(5, "NIN must be valid")
    .regex(/^[A-Z0-9]+$/, "NIN must contain only alphanumeric characters"), 
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 characters"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
