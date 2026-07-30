import { notFound } from "next/navigation";
import { cantons } from "@/data/cantons";
import { CantonProfile } from "@/components/CantonProfile";

/**
 * Página de cantón (/cantones/[slug]) — los 10 cantones con mayor
 * decrecimiento, con SOLO los datos reales del análisis 1990–2022.
 * Componente servidor: resuelve el slug y pre-renderiza las 10 rutas;
 * la vista (con idioma) vive en components/CantonProfile.tsx.
 */

export function generateStaticParams() {
  return cantons.map((canton) => ({ slug: canton.slug }));
}

export default function CantonPage({ params }: { params: { slug: string } }) {
  const canton = cantons.find((c) => c.slug === params.slug);
  if (!canton) notFound();
  return <CantonProfile slug={params.slug} />;
}
