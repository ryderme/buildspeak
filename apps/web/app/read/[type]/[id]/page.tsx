import { notFound } from "next/navigation";
import { loadArticle, listArticleIds, pickWordsFor } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-header";
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
  // Only ship the words this article references — words.json is global and grows over time.
  const words = pickWordsFor([article]);

  return (
    <>
      <SiteHeader />
      <ArticleReader article={article} words={words} />
      <SiteFooter />
    </>
  );
}
