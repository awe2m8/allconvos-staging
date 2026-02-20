import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { normalizePlanId } from "@/lib/billing";
import { appUrl, marketingUrl } from "@/lib/siteUrls";

interface SignUpPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readSingleParam(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === "string") {
    return raw;
  }

  if (Array.isArray(raw)) {
    return raw[0];
  }

  return undefined;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const rawPlan = readSingleParam(params.plan);
  const hasExplicitPlan = rawPlan === "lite" || rawPlan === "pro";
  const selectedPlanId = normalizePlanId(rawPlan);
  const postAuthRedirectUrl = hasExplicitPlan
    ? appUrl(`/start?plan=${selectedPlanId}`)
    : appUrl("/billing/checkout");
  const signInUrl = hasExplicitPlan ? appUrl(`/login?plan=${selectedPlanId}`) : appUrl("/login");
  const homeUrl = marketingUrl("/");

  return (
    <main className="relative min-h-screen bg-ocean-950 flex items-center justify-center px-6 py-20">
      <Link
        href={homeUrl}
        className="absolute top-6 left-6 inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        Back to main site
      </Link>
      <SignUp
        path="/signup"
        routing="path"
        signInUrl={signInUrl}
        fallbackRedirectUrl={postAuthRedirectUrl}
        forceRedirectUrl={postAuthRedirectUrl}
      />
    </main>
  );
}
