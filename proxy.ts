import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const toRoutePattern = (route: string | undefined, fallback: string) => {
  const value = route?.trim() || fallback;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return `${new URL(value).pathname}(.*)`;
  }

  return `${value}(.*)`;
};

const isPublicRoute = createRouteMatcher([
  toRoutePattern(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL, "/sign-in"),
  toRoutePattern(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL, "/sign-up"),
  "/api/spotify/callback(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
