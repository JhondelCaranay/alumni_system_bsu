// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isUserAllowed } from "./lib/utils";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    const role = request.nextauth.token?.role || "";
    const roleLowerCase = role.toLowerCase();
    const pathname = request.nextUrl.pathname;

    /* 
      check if role in path name is valid
    */
    if (!pathname.startsWith("/" + roleLowerCase)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    const isPathMatch = (pathname: string, matcher: string) => {
      return pathname.startsWith(matcher);
    };

    if (
      isPathMatch(pathname, `/${roleLowerCase}/dashboard`) &&
      isUserAllowed(role, ["ADMIN"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/courses`) &&
      isUserAllowed(role, ["ADMIN"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/sections`) &&
      isUserAllowed(role, ["ADMIN"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/users`) &&
      isUserAllowed(role, ["ADMIN"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/students`) &&
      isUserAllowed(role, ["ADMIN"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/jobs`) &&
      isUserAllowed(role, ["ALL"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/events`) &&
      isUserAllowed(role, ["ALL"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/forums`) &&
      isUserAllowed(role, ["ALL"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/messages`) &&
      isUserAllowed(role, ["ALL"])
    ) {
      return NextResponse.next();
    } else if (
      isPathMatch(pathname, `/${roleLowerCase}/profile`) &&
      isUserAllowed(role, ["ALL"])
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|$|assets|images).*)",
  ],
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
