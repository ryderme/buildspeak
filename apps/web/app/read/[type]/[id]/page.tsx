import type { ArticleType } from "@buildspeak/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderScreen } from "@/components/reader/reader-screen";
import { getAllReaderRoutes, getReaderArticle } from "@/lib/mock-content";

type ReaderPageProps = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

const isArticleType = (value: string): value is ArticleType =>
  value === "podcast" || value === "x" || value === "blog";

export const dynamicParams = false;

export const generateStaticParams = () => getAllReaderRoutes();

export const generateMetadata = async ({
  params,
}: ReaderPageProps): Promise<Metadata> => {
  const { id, type } = await params;

  if (!isArticleType(type)) {
    return {};
  }

  const article = getReaderArticle(type, id);

  return article
    ? {
        title: `${article.title.en} · BuildSpeak`,
        description: article.quote,
      }
    : {};
};

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id, type } = await params;

  if (!isArticleType(type)) {
    notFound();
  }

  const article = getReaderArticle(type, id);

  if (!article) {
    notFound();
  }

  return <ReaderScreen article={article} />;
}
