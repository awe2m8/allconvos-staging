import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { VSL } from "@/components/sections/VSL";
import { MessagingDemo } from "@/components/sections/MessagingDemo";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main className="bg-ocean-950 min-h-screen relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <MessagingDemo />
      <VSL />
      <DashboardPreview />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
