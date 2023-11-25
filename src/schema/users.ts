import { Gender, Role, User } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  isArchived: z.boolean(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  hashedPassword: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.nativeEnum(Role),
  groupChatId: z.string().nullable(),
  sectionId: z.string().nullable(),
  departmentId: z.string().nullable(),
}) satisfies z.ZodType<User>;

export const UpdateUsersSchema = UserSchema.extend({
  firstname: z.string(),
  lastname: z.string(),
  bsu_email: z.string().email(),
  personal_email: z.string().email(),
  image: z.string(),
  middlename: z.string(),
  city: z.string(),
  homeNo: z.string(),
  street: z.string(),
  barangay: z.string(),
  province: z.string(),
  contactNo: z.string(),
  password: z
    .string()
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
          value
        ),
      "Must contain 8 Characters, one uppercase, lowercase, one number and one special case character"
    ),
  confirmPassword: z.string(),
  currentPassword: z.string(),
})
  .partial()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UpdateUserSchemaType = z.infer<typeof UpdateUsersSchema>;
