import { HomeScreen } from "@/components/home/home-screen";
import { getDailyDigest, getFeaturedReaderHref } from "@/lib/content";

export default async function HomePage() {
  const [digest, readerHref] = await Promise.all([
    getDailyDigest(),
    getFeaturedReaderHref(),
  ]);

  return <HomeScreen digest={digest} readerHref={readerHref} />;
}
