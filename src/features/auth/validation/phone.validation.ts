import { z } from "zod";

export const phoneSchema = z.object({
  dialCode: z.string().min(1),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{6,14}$/, "Enter a valid phone number"),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^[0-9]{6}$/, "Code must be 6 digits"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
