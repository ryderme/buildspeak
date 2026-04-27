import { loadLatestDigest, adjacentDates } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { HomeContent } from "@/components/home-content";

export default function HomePage() {
  const digest = loadLatestDigest();
  const { prev, next } = adjacentDates(digest.date);
  return (
    <>
      <SiteHeader />
      <HomeContent digest={digest} prevDate={prev} nextDate={next} isLatest={true} />
      <SiteFooter />
    </>
  );
}
