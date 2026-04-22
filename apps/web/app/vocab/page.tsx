import { VocabScreen } from "@/components/vocab/vocab-screen";
import { getFeaturedReaderHref, getProfileSummary, getVocabularySnapshot } from "@/lib/content";

export default async function VocabPage() {
  const [snapshot, profile, readerHref] = await Promise.all([
    getVocabularySnapshot(),
    getProfileSummary(),
    getFeaturedReaderHref(),
  ]);

  return (
    <VocabScreen
      snapshot={snapshot}
      readerHref={readerHref}
      streakDays={profile.streakDays}
    />
  );
}
