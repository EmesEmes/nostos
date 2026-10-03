import type { Metadata } from "next";
import { getPublishedSites } from "@/lib/sites";
import { SiteList } from "@/components/sites/SiteList";

export const metadata: Metadata = {
  title: "Lugares de estudio · NOSTOS",
  description:
    "Los territorios donde la investigación escucha a quienes se quedan.",
};

export default async function SitesPage() {
  const sites = await getPublishedSites();
  return <SiteList sites={sites} />;
}
