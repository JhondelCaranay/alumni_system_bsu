// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isUserAllowed } from "./lib/utils";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    console.log(
      "🚀 ~ file: middleware.ts:16 ~ middleware ~ pathname:",
      request.nextUrl.pathname
    );

    // console.log(request.nextUrl.pathname)
    // console.log(request.nextauth.token)
    const role = request.nextauth.token?.role as string;
    const pathname = request.nextUrl.pathname;
    // if (pathname.startsWith("/dashboard") && isUserAllowed(role, ["ADMIN"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/course") && isUserAllowed(role, ["ADMIN"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/students") && isUserAllowed(role, ["ADMIN"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/jobs") && isUserAllowed(role, ["ALL"])) {
    //   if (
    //     pathname.endsWith("jobs/create") &&
    //     !isUserAllowed(role, ["ADMIN", "BULSU_PARTNER", "PESO"])
    //   ) {
    //     /*
    //       redirect to /denied if user is not allowed to create jobs
    //     */
    //     return NextResponse.rewrite(new URL("/denied", request.url));
    //   } else {
    //     return NextResponse.next();
    //   }
    // } else if (pathname.startsWith("/dashboard/events") && isUserAllowed(role, ["ALL"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/forums") && isUserAllowed(role, ["ALL"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/users") && isUserAllowed(role, ["ADMIN"])) {
    //   return NextResponse.next();
    // } else if (pathname.startsWith("/dashboard/profile") && isUserAllowed(role, ["ALL"])) {
    //   return NextResponse.next();
    // } else {
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
export const config = {
  matcher: ["/dashboard/:path*"],
};
