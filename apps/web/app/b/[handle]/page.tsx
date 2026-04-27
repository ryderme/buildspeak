import { notFound } from "next/navigation";
import { listBuilderHandles, loadBuilderArticles, loadWords } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
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
  const words = loadWords();
  return (
    <>
      <SiteHeader />
      <BuilderTimeline articles={articles} words={words} />
    </>
  );
}
