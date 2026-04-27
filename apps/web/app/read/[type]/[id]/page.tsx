import { notFound } from "next/navigation";
import { loadArticle, listArticleIds, loadWords, loadLatestDigest } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { ArticleReader } from "@/components/reader/article-reader";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const ids = listArticleIds();
  return ids.map((id) => {
    const type = id.startsWith("podcast-") ? "podcast" : id.startsWith("blog-") ? "blog" : "tweet";
    return { type, id };
  });
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { id } = await params;
  const article = loadArticle(id);
  if (!article) notFound();
  const words = loadWords();
  const digest = loadLatestDigest();

  return (
    <>
      <SiteHeader date={digest.date} />
      <ArticleReader article={article} words={words} />
    </>
  );
}
