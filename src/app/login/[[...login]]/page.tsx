import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { normalizePlanId } from "@/lib/billing";
import { appUrl, marketingUrl } from "@/lib/siteUrls";

interface LoginPageProps {
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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const rawPlan = readSingleParam(params.plan);
  const hasExplicitPlan = rawPlan === "lite" || rawPlan === "pro";
  const selectedPlanId = normalizePlanId(rawPlan);
  const fallbackRedirectUrl = hasExplicitPlan
    ? appUrl(`/start?plan=${selectedPlanId}`)
    : appUrl("/app/onboarding");
  const signUpUrl = hasExplicitPlan ? appUrl(`/signup?plan=${selectedPlanId}`) : appUrl("/signup");
  const homeUrl = marketingUrl("/");

  return (
    <main className="relative min-h-screen bg-ocean-950 flex items-center justify-center px-6 py-20">
      <Link
        href={homeUrl}
        className="absolute top-6 left-6 inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        Back to main site
      </Link>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl={signUpUrl}
        fallbackRedirectUrl={fallbackRedirectUrl}
      />
    </main>
  );
}
