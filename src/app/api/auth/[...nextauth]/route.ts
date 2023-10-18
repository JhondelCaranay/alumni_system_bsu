import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { env } from "@/env.mjs";
import prisma from "@/libs/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        /* 
          You need to provide your own logic here that takes the credentials
          submitted and returns either a object representing a user or value
          that is false/null if the credentials are invalid.
          e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          You can also use the `req` object to obtain additional parameters
          (i.e., the request IP address) 
        */

        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error("Invalid credentials. Please fill in all fields");
        // }
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: credentials.email,
        //   },
        // });
        // if (!user || !user?.hashedPassword) {
        //   throw new Error("Invalid credentials");
        // }
        // const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        // if (!isCorrectPassword) {
        //   throw new Error("Invalid credentials");
        // }
        // return user;

        /* 
          If no error and we have user data, return it
          Return null if user data could not be retrieved
        */
        return null;
      },
    }),
  ],
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#with-jwt
    jwt({ token, user }) {
      // if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      // session.user.role = token.role;
      return session;
    },
  },
  debug: env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
