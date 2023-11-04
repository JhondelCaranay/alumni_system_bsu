// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isUserAllowed } from "./lib/utils";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    console.log("🚀 ~ file: middleware.ts:16 ~ middleware ~ pathname:", request.nextUrl.pathname);

    // console.log(request.nextUrl.pathname)
    // console.log(request.nextauth.token)
    const role = request.nextauth.token?.role as string;

    if (request.nextUrl.pathname.startsWith("/dashboard") && !isUserAllowed(role, ["ADMIN"])) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
    // if (
    //   request.nextUrl.pathname.startsWith("/client") &&
    //   request.nextauth.token?.role !== "admin" &&
    //   request.nextauth.token?.role !== "manager"
    // ) {
    //   return NextResponse.rewrite(new URL("/denied", request.url));
    // }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/client", "/dashboard"] };
