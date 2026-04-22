import { HomeScreen } from "@/components/home/home-screen";
import { getDailyDigest } from "@/lib/mock-content";

export default function HomePage() {
  return <HomeScreen digest={getDailyDigest()} />;
}
