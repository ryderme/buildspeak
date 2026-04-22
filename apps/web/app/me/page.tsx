import { ProfileScreen } from "@/components/profile/profile-screen";
import { getProfileSummary } from "@/lib/mock-content";

export default function ProfilePage() {
  return <ProfileScreen summary={getProfileSummary()} />;
}
