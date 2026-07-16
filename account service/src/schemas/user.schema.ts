import { z } from 'zod';

export const AddressInputSchema = z.object({
  tag: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  line1: z.string().trim().min(1, 'Line 1 is required'),
  line2: z.string().nullable().default(null),
  landmark: z.string().trim().min(1, 'Landmark is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pincode: z.string().trim().min(1, 'Pincode is required'),
});

export const RegisterUserInputSchema = z.object({
  fullname: z.string().trim().toLowerCase().min(5, 'please provide valid full name'),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  phone: z.object({
    country_code: z.enum(['+91']).default('+91'),
    number: z
      .string()
      .nullable()
      .default(null)
      .refine((v) => v === null || /^\d{10}$/.test(v), {
        message: 'Please enter a valid 10-digit phone number',
      }),
  }),
  password: z
    .string()
    .min(6, 'Password must be between 6 - 10 characters.')
    .max(10, 'Password must be between 6 - 10 characters.')
    .trim(),
  address: z.array(AddressInputSchema).default([]),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;
