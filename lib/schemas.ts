import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const adminCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const jobListingSchema = z.object({
  title: z.string().min(3, "Title is required").max(120),
  company: z.string().min(2, "Company name is required").max(100),
  location: z.string().min(2, "Location is required").max(100),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  salaryMin: z.coerce.number().int().positive().nullable().optional(),
  salaryMax: z.coerce.number().int().positive().nullable().optional(),
  contactEmail: z.string().email("Invalid contact email"),
});

export const jobListingUpdateSchema = jobListingSchema.partial();

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminCreateInput = z.infer<typeof adminCreateSchema>;
export type JobListingInput = z.infer<typeof jobListingSchema>;
export type JobListingUpdateInput = z.infer<typeof jobListingUpdateSchema>;
