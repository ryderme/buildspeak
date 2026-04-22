import type { ArticleType } from "@buildspeak/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderScreen } from "@/components/reader/reader-screen";
import {
  getAllReaderRoutes,
  getFeaturedReaderHref,
  getProfileSummary,
  getReaderArticle,
} from "@/lib/content";

type ReaderPageProps = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

const isArticleType = (value: string): value is ArticleType =>
  value === "podcast" || value === "x" || value === "blog";

export const dynamicParams = false;

export const generateStaticParams = async () => getAllReaderRoutes();

export const generateMetadata = async ({
  params,
}: ReaderPageProps): Promise<Metadata> => {
  const { id, type } = await params;

  if (!isArticleType(type)) {
    return {};
  }

  const article = await getReaderArticle(type, id);

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

  const [article, profile, readerHref] = await Promise.all([
    getReaderArticle(type, id),
    getProfileSummary(),
    getFeaturedReaderHref(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <ReaderScreen
      article={article}
      readerHref={readerHref}
      streakDays={profile.streakDays}
    />
  );
}
