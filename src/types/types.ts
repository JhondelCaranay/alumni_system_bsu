import { Department, Profile, User } from "@prisma/client";

export type SafeDeparment = Omit<Department, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeUser = Omit<
  User,
  "role" | "createdAt" | "updatedAt" | "emailVerified" | "hashedPassword"
> & {
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type UserWithProfile = SafeUser & {
  profile: Profile;
};
