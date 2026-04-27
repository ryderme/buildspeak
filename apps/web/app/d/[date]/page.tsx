import { notFound } from "next/navigation";
import { loadDigestByDate, listAvailableDates, adjacentDates } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { HomeContent } from "@/components/home-content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listAvailableDates().map((date) => ({ date }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const digest = loadDigestByDate(date);
  if (!digest) notFound();
  const all = listAvailableDates();
  const isLatest = all[0] === date;
  const { prev, next } = adjacentDates(date);
  return (
    <>
      <SiteHeader />
      <HomeContent digest={digest} prevDate={prev} nextDate={next} isLatest={isLatest} />
      <SiteFooter />
    </>
  );
}
