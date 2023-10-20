import { User } from "@prisma/client";

export type SafeUser = Omit<User, "role" | "createdAt" | "updatedAt" | "emailVerified"> & {
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
