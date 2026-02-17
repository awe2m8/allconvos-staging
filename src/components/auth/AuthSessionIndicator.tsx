"use client";

import { usePathname } from "next/navigation";
import { SignOutButton, SignedIn, useUser } from "@clerk/nextjs";
import { LogOut, UserCircle2 } from "lucide-react";
import { appUrl } from "@/lib/siteUrls";

export function AuthSessionIndicator() {
  const pathname = usePathname();
  const { user } = useUser();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  const loginUrl = appUrl("/login");
  const userLabel = user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "Account";

  return (
    <div className="fixed bottom-4 left-4 z-[60]">
      <SignedIn>
        <div className="min-w-[260px] rounded-2xl border border-[#24406a] bg-[#08152a]/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex items-center rounded-md border border-neon/40 bg-neon/15 px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-neon">
              FRONT DESK CORE
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8aa2c5]">Logged In</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-[#a8b7cd]">
              <UserCircle2 className="h-4 w-4 shrink-0" />
              <p className="truncate text-sm font-medium">{userLabel}</p>
            </div>
            <SignOutButton redirectUrl={loginUrl}>
              <button
                type="button"
                className="flex w-full items-center gap-2 text-left text-[#a8b7cd] hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
