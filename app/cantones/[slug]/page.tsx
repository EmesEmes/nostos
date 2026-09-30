import { notFound } from "next/navigation";
import { cantons } from "@/data/cantons";
import { CantonProfile } from "@/components/CantonProfile";

export const dynamicParams = false;

export function generateStaticParams() {
  return cantons.map((canton) => ({ slug: canton.slug }));
}

export default async function CantonPage({
  params,
}: PageProps<"/cantones/[slug]">) {
  const { slug } = await params;
  const canton = cantons.find((c) => c.slug === slug);
  if (!canton) notFound();
  return <CantonProfile slug={slug} />;
}
