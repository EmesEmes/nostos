import { Hero } from "@/components/home/Hero";
import { MapSection } from "@/components/home/LivingMap/MapSection";
import { TheProblem } from "@/components/home/TheProblem";
import { Statement } from "@/components/home/Statement";
import { Magnitude } from "@/components/home/Magnitude";
import { Numbers } from "@/components/home/Numbers";
import { Findings } from "@/components/home/Findings";
import { CaseStudy } from "@/components/home/CaseStudy";
import { CantonsGrid } from "@/components/home/CantonsGrid";
import { Closing } from "@/components/home/Closing";
import { Participate } from "@/components/home/Participate";
import { HomeSitesProvider } from "@/components/home/HomeSites";
import { getPublishedSites } from "@/lib/sites";

export default async function HomePage() {
  const sites = await getPublishedSites();

  return (
    <HomeSitesProvider sites={sites}>
      <main>
        <Hero />
        <TheProblem />
        <MapSection />
        <Statement />
        <Magnitude />
        <Numbers />
        <Findings />
        <CaseStudy />
        <CantonsGrid />
        <Closing />
        <Participate />
      </main>
    </HomeSitesProvider>
  );
}
