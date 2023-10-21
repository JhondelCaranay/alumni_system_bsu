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

export type SafeProfile = Omit<
  Profile,
  "createdAt" | "updatedAt" | "yearEnrolled" | "yearGraduated" | "gender"
> & {
  createdAt: string;
  updatedAt: string;
  yearEnrolled: string;
  yearGraduated: string;
  gender: string;
};

export type UserWithProfile = SafeUser & {
  profile: SafeProfile;
};
