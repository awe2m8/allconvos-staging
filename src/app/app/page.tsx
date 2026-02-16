import { redirect } from "next/navigation";
import { appUrl } from "@/lib/siteUrls";

export default function AppHomePage() {
  redirect(appUrl("/app/onboarding"));
}
