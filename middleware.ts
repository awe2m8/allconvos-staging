import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { appUrl, isRequestOnAppOrigin, shouldRedirectToAppOrigin } from "@/lib/siteUrls";

const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
  "/billing(.*)",
  "/api/billing(.*)",
  "/api/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (
    process.env.NODE_ENV === "production" &&
    request.nextUrl.pathname === "/" &&
    isRequestOnAppOrigin(requestHost)
  ) {
    const { userId } = await auth();
    return NextResponse.redirect(appUrl(userId ? "/app/onboarding" : "/login"), 307);
  }

  if (
    shouldRedirectToAppOrigin({
      requestPathname: request.nextUrl.pathname,
      requestHost,
    })
  ) {
    return NextResponse.redirect(appUrl(`${request.nextUrl.pathname}${request.nextUrl.search}`), 307);
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
