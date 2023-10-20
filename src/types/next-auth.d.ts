// Ref for module augmentation in next auth: https://next-auth.js.org/getting-started/typescript#module-augmentation

// Guide for role based access control: https://authjs.dev/guides/basics/role-based-access-control

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
