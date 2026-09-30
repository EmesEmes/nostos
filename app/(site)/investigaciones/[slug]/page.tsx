import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedInvestigation,
  getPublishedInvestigations,
} from "@/lib/investigations";
import { InvestigationArticle } from "@/components/research/InvestigationArticle";
import { RichText } from "@/components/RichText";
import { hasContent } from "@/lib/editor-content";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function load(slug: string) {
  if (!SLUG_PATTERN.test(slug)) return null;
  return getPublishedInvestigation(slug);
}

export async function generateStaticParams() {
  const investigations = await getPublishedInvestigations();
  return investigations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/investigaciones/[slug]">): Promise<Metadata> {
  const investigation = await load((await params).slug);
  if (!investigation) return {};

  return {
    title: `${investigation.title_es} · NOSTOS`,
    description: investigation.summary_es || undefined,
    openGraph: {
      type: "article",
      title: investigation.title_es,
      description: investigation.summary_es || undefined,
      publishedTime: investigation.published_at ?? undefined,
      authors: investigation.author ? [investigation.author.name] : undefined,
    },
  };
}

export default async function InvestigationPage({
  params,
}: PageProps<"/investigaciones/[slug]">) {
  const investigation = await load((await params).slug);
  if (!investigation) notFound();

  return (
    <InvestigationArticle
      title_es={investigation.title_es}
      title_en={investigation.title_en}
      summary_es={investigation.summary_es}
      summary_en={investigation.summary_en}
      published_at={investigation.published_at}
      author={investigation.author}
      hasEnglishBody={hasContent(investigation.content_en)}
      bodyEs={<RichText content={investigation.content_es} />}
      bodyEn={<RichText content={investigation.content_en} />}
    />
  );
}
