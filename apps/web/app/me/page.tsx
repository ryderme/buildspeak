import { ProfileScreen } from "@/components/profile/profile-screen";
import { getFeaturedReaderHref, getProfileSummary } from "@/lib/content";

export default async function ProfilePage() {
  const [summary, readerHref] = await Promise.all([
    getProfileSummary(),
    getFeaturedReaderHref(),
  ]);

  return <ProfileScreen summary={summary} readerHref={readerHref} />;
}
