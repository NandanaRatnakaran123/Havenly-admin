import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const num = (label: string) => z.number({ error: `Enter ${label}` });

export const propertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),
  description: z.string().trim().min(20, "Describe the property in at least 20 characters"),
  type: z.enum(["sale", "rent"]),
  category: z.enum(["apartment", "villa", "house", "plot", "commercial"]),
  price: num("a price").positive("Price must be greater than 0"),
  bedrooms: num("bedrooms").int().min(0).max(20),
  bathrooms: num("bathrooms").int().min(0).max(20),
  areaSqft: num("the area").positive("Area must be greater than 0"),
  address: z.string().trim().min(3, "Address is required"),
  locality: z.string().trim().min(2, "Locality is required"),
  city: z.string().trim().min(1, "Select a city"),
  district: z.string().trim().optional(),
  /** Up to 3 photos (URL or uploaded data URL); empty slots are "". The first is the cover. */
  images: z
    .array(
      z
        .string()
        .trim()
        .refine(
          (v) => v === "" || v.startsWith("data:image/") || URL.canParse(v),
          "Enter a valid image URL",
        ),
    )
    .max(3),
  furnishing: z
    .union([z.literal(""), z.enum(["furnished", "semi-furnished", "unfurnished"])])
    .optional(),
  possession: z.string().trim().min(1, "Select or enter possession status"),
  amenities: z.array(z.string()),
  posterName: z.string().trim().min(2, "Advertiser name is required"),
  posterRole: z.enum(["owner", "agent", "builder"]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  verified: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const settingsSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required"),
  supportEmail: z.string().trim().email("Enter a valid email"),
  supportPhone: z.string().trim().min(6, "Enter a phone number"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{0,15}$/, "Digits only, with country code, e.g. 919876543210"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const serviceSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  summary: z.string().trim().min(10, "Add a short summary"),
  /** One bullet per line in the form; split before saving. */
  points: z.string(),
  status: z.enum(["draft", "published"]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const userSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["admin", "staff", "agent", "buyer"]),
  active: z.boolean(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm the new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current one",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
