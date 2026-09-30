import type { Metadata } from "next";
import { getPublishedInvestigations } from "@/lib/investigations";
import { InvestigationList } from "@/components/research/InvestigationList";

export const metadata: Metadata = {
  title: "Investigaciones · NOSTOS",
  description:
    "Textos y avances de la investigación sobre la despoblación rural en el Ecuador.",
};

export default async function ResearchPage() {
  const investigations = await getPublishedInvestigations();
  return <InvestigationList items={investigations} />;
}
