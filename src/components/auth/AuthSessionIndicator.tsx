"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, SignedIn, useUser } from "@clerk/nextjs";
import { appUrl } from "@/lib/siteUrls";

export function AuthSessionIndicator() {
  const pathname = usePathname();
  const { user } = useUser();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  const loginUrl = appUrl("/login");
  const appHomeUrl = appUrl("/app/onboarding");
  const userLabel = user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "Account";

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      <SignedIn>
        <div className="rounded-xl border border-white/15 bg-ocean-950/90 px-4 py-3 shadow-2xl backdrop-blur-md min-w-[220px]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Logged In
          </div>
          <p className="mt-1 truncate text-[11px] font-mono text-gray-400">{userLabel}</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href={appHomeUrl}
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-white hover:bg-white/10"
            >
              Open App
            </Link>
            <SignOutButton redirectUrl={loginUrl}>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-neon/40 px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-neon hover:bg-neon/10"
              >
                Logout
              </button>
            </SignOutButton>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
