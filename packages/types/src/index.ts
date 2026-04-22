export type ArticleType = "podcast" | "x" | "blog";

export type CEFR = "A2" | "B1" | "B2" | "C1";

export interface ArticlePreview {
  id: string;
  type: ArticleType;
  title: {
    en: string;
    zh: string;
  };
  source: {
    name: string;
    subtitle: string;
  };
  stats: {
    duration?: string;
    readMinutes: number;
    level: CEFR;
    newWords: number;
    likes?: number;
    replies?: number;
    reposts?: number;
  };
  quote: string;
  cover: {
    label: string;
    from: string;
    to: string;
  };
}

export type Token =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "word";
      surface: string;
      lemma: string;
      translation: string;
      ipa?: string;
      isKnown?: boolean;
    };

export interface Sentence {
  id: string;
  speaker?: string;
  timestamp?: string;
  en: Token[];
  zh: string;
}

export interface ReaderArticle extends ArticlePreview {
  sourceUrl: string;
  speakers?: Array<{
    id: string;
    label: string;
    accent: string;
  }>;
  sentences: Sentence[];
}

export interface DigestTab {
  id: ArticleType;
  label: string;
  count: number;
}

export interface DailyDigest {
  dateLabel: string;
  hero: {
    title: string;
    subtitle: string;
    streakDays: number;
    todayMinutes: number;
    targetMinutes: number;
    wordsToday: number;
    reviewQueue: number;
  };
  tabs: DigestTab[];
  sections: Record<ArticleType, ArticlePreview[]>;
  featuredArticle: ArticlePreview;
}

export type ReviewBucket = "today" | "thisWeek" | "all";

export interface VocabularyEntry {
  lemma: string;
  ipa: string;
  pos: string;
  translation: string;
  source: string;
  speaker: string;
  quote: string;
  quoteZh: string;
  tags: string[];
  bucket: ReviewBucket;
  nextReview: string;
  stage: number;
  seenCount: number;
}

export interface VocabularySnapshot {
  totalWords: number;
  reviewQueue: number;
  weeklyAdds: number;
  entries: VocabularyEntry[];
}

export interface DailyActivity {
  date: string;
  minutes: number;
}

export interface ProfileSummary {
  streakDays: number;
  totalWords: number;
  totalArticles: number;
  totalMinutes: number;
  spotlight: string;
  recentActivity: DailyActivity[];
}
