import { notFound } from "next/navigation";
import { listBuilderHandles, loadBuilderArticles, pickWordsFor } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { BuilderTimeline } from "@/components/reader/builder-timeline";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listBuilderHandles().map((handle) => ({ handle }));
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const articles = loadBuilderArticles(handle);
  if (!articles.length) notFound();
  // Only the words this builder's tweets reference — keeps per-page payload bounded.
  const words = pickWordsFor(articles);
  return (
    <>
      <SiteHeader />
      <BuilderTimeline articles={articles} words={words} />
      <SiteFooter />
    </>
  );
}
