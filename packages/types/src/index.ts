// Shared types between pipeline (build-time) and web app (runtime).
// Pipeline writes JSON conforming to these; web reads it.

export type ArticleType = "podcast" | "tweet" | "blog";

/** A single English word/punctuation token within a sentence. */
export interface Token {
  /** "word" for lookupable words, "punct" for punctuation, "space" for whitespace separators we want to render explicitly. */
  kind: "word" | "punct" | "space";
  /** Original surface form, exactly as in source. */
  text: string;
  /** Lowercased lemma-ish key for dictionary lookup. Only set when kind === "word". */
  key?: string;
}

/** A single English sentence — the unit TTS plays at a time. */
export interface Sentence {
  id: string;
  /** Tokens that compose this sentence (in order, including spaces/punct). */
  tokens: Token[];
  /** Plain text version of the sentence (for TTS). */
  text: string;
}

/** A paragraph holds N sentences in English plus the matched Chinese translation. */
export interface Paragraph {
  id: string;
  /** Optional speaker label (e.g. "Speaker 1", "Jeremy Allaire"). */
  speaker?: string;
  /** Optional timecode label (e.g. "00:05 - 00:19"). */
  timecode?: string;
  sentences: Sentence[];
  /** Chinese translation of the paragraph as a whole. */
  zh: string;
  /** Tweet-only metadata; absent for podcast/blog paragraphs. */
  meta?: TweetMeta;
}

export interface TweetMeta {
  likes: number;
  retweets: number;
  replies: number;
  createdAt: string;
  tweetUrl: string;
}

/** Article = paragraph[] + metadata. The unit at /read/[type]/[id]. */
export interface Article {
  id: string;
  type: ArticleType;
  /** Source name: "No Priors", "Aaron Levie", "Claude Blog" etc. */
  sourceName: string;
  /** Subtitle: handle for X, podcast show, blog name, etc. */
  sourceHandle?: string;
  /** Bio for X builders (raw, not translated). */
  sourceBio?: string;
  /** Article title in English. */
  title: string;
  /** Optional Chinese title hint. */
  titleZh?: string;
  url: string;
  publishedAt: string;
  /** Date of the digest issue this article belongs to — YYYY-MM-DD. */
  digestDate: string;
  paragraphs: Paragraph[];
  /** Approximate word count for the English text. */
  wordCount: number;
  /** Engagement metrics (X only). */
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

/** Daily digest groups today's articles by type. */
export interface DailyDigest {
  date: string; // YYYY-MM-DD
  generatedAt: string; // ISO
  podcasts: Article[];
  tweets: Article[];
  blogs: Article[];
  /** Pre-computed summary numbers shown on Home. */
  stats: {
    podcastCount: number;
    builderCount: number;
    tweetCount: number;
    blogCount: number;
  };
}

/** Per-word reference data used by the word-popup. */
export interface WordEntry {
  /** Lowercased lemma-ish key. */
  key: string;
  /** IPA transcription, when known. */
  ipa?: string;
  /** Chinese definition (multi-pos joined with `; `). */
  zh?: string;
  /** Inferred difficulty band: 1 = very common, 5 = rare. */
  band?: 1 | 2 | 3 | 4 | 5;
}

/** Saved by the user in localStorage. */
export interface VocabEntry {
  key: string;
  surface: string; // original casing they tapped
  ipa?: string;
  zh?: string;
  /** Where they added it from. */
  context: {
    sentence: string;
    articleId: string;
    articleTitle: string;
  };
  addedAt: number; // ms epoch
}
