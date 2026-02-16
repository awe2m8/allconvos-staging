import { SignUp } from "@clerk/nextjs";
import { normalizePlanId } from "@/lib/billing";
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
  const planId = normalizePlanId(readSingleParam(params.plan));
  const fallbackRedirectUrl = appUrl(`/start?plan=${planId}`);
  const signInUrl = appUrl(`/login?plan=${planId}`);

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
