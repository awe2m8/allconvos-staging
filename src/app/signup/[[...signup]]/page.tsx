import { SignUp } from "@clerk/nextjs";
import { appUrl } from "@/lib/siteUrls";

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
  const fallbackRedirectUrl = hasExplicitPlan
    ? appUrl(`/start?plan=${rawPlan}`)
    : appUrl("/app/onboarding");
  const signInUrl = hasExplicitPlan ? appUrl(`/login?plan=${rawPlan}`) : appUrl("/login");

  return (
    <main className="min-h-screen bg-ocean-950 flex items-center justify-center px-6 py-20">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl={signInUrl}
        fallbackRedirectUrl={fallbackRedirectUrl}
      />
    </main>
  );
}
