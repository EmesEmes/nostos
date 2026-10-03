import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedSite, getPublishedSites } from "@/lib/sites";
import { hasContent } from "@/lib/editor-content";
import { storageUrl } from "@/lib/storage-paths";
import { RichText } from "@/components/RichText";
import { SiteArticle } from "@/components/sites/SiteArticle";
import { zones } from "@/data/cantonalStudy";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function load(slug: string) {
  if (!SLUG_PATTERN.test(slug)) return null;
  return getPublishedSite(slug);
}

export async function generateStaticParams() {
  const sites = await getPublishedSites();
  return sites.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lugares/[slug]">): Promise<Metadata> {
  const site = await load((await params).slug);
  if (!site) return {};

  const description = site.summary_es || site.tagline_es || undefined;
  return {
    title: `${site.name} · NOSTOS`,
    description,
    openGraph: {
      title: site.name,
      description,
      images: site.cover_path ? [storageUrl(site.cover_path)] : undefined,
    },
  };
}

export default async function SitePage({
  params,
}: PageProps<"/lugares/[slug]">) {
  const site = await load((await params).slug);
  if (!site) notFound();

  const { site_images, testimonies, content_es, content_en, ...rest } = site;
  const zone = zones.find((item) => item.id === site.zone_id);
  const published = zone ? await getPublishedSites() : [];
  const neighbors = (zone?.cantons ?? [])
    .filter((canton) => canton.name !== site.name)
    .map((canton) => ({
      name: canton.name,
      rate: canton.rate,
      slug: published.find((item) => item.name === canton.name)?.slug ?? null,
    }));

  return (
    <SiteArticle
      site={{ ...rest, images: site_images, testimonies }}
      neighbors={neighbors}
      hasSpanishBody={hasContent(content_es)}
      hasEnglishBody={hasContent(content_en)}
      bodyEs={<RichText content={content_es} />}
      bodyEn={<RichText content={content_en} />}
    />
  );
}
