import { VocabScreen } from "@/components/vocab/vocab-screen";
import { getVocabularySnapshot } from "@/lib/mock-content";

export default function VocabPage() {
  return <VocabScreen snapshot={getVocabularySnapshot()} />;
}
