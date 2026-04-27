import { loadLatestDigest, adjacentDates } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { HomeContent } from "@/components/home-content";

export default function HomePage() {
  const digest = loadLatestDigest();
  const { prev, next } = adjacentDates(digest.date);
  return (
    <>
      <SiteHeader date={digest.date} />
      <HomeContent digest={digest} prevDate={prev} nextDate={next} />
    </>
  );
}
