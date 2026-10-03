"use client";

import { createContext, useContext } from "react";
import type { getPublishedSites } from "@/lib/sites";

export type HomeSite = Awaited<ReturnType<typeof getPublishedSites>>[number];

const HomeSitesContext = createContext<HomeSite[]>([]);

export function HomeSitesProvider({
  sites,
  children,
}: {
  sites: HomeSite[];
  children: React.ReactNode;
}) {
  return (
    <HomeSitesContext.Provider value={sites}>
      {children}
    </HomeSitesContext.Provider>
  );
}

export function useHomeSites() {
  return useContext(HomeSitesContext);
}

export function useStudyCantons() {
  return useHomeSites().filter(
    (site): site is HomeSite & { annual_rate: number } =>
      site.kind === "canton" && site.annual_rate !== null,
  );
}
