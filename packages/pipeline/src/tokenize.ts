// tokenize.ts — sentence + word tokenizer for English. Pure regex, no NLP deps.

import type { Sentence, Token } from "@buildspeak/types";

// Common abbreviations that should NOT trigger sentence splits.
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr",
  "inc", "ltd", "co", "corp",
  "vs", "etc", "e.g", "i.e", "vs",
  "u.s", "u.k", "u.n", "p.s",
  "no", "nos", // No. 1
  "fig", "vol", "ch", "p", "pp",
  "a.m", "p.m",
  "st", "ave", "blvd",
]);

/** Split a paragraph into sentences. Conservative — favours not over-splitting. */
export function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const sentences: string[] = [];
  let buf = "";
  const len = cleaned.length;

  for (let i = 0; i < len; i++) {
    const ch = cleaned[i] ?? "";
    buf += ch;
    if (ch !== "." && ch !== "!" && ch !== "?") continue;

    // Look ahead: must be followed by whitespace + (uppercase letter or quote/digit)
    const next = cleaned[i + 1];
    const nextNext = cleaned[i + 2];
    if (next !== " " && next !== undefined) continue;
    if (nextNext !== undefined && !/[A-Z0-9"'“‘]/.test(nextNext)) continue;

    // Check abbreviation: word ending immediately before this period
    if (ch === ".") {
      const wordMatch = buf.match(/(\b[\w.]+)\.$/);
      const tail = wordMatch?.[1]?.toLowerCase();
      if (tail && ABBREVIATIONS.has(tail.replace(/\.+$/, ""))) {
        continue;
      }
      // Single capital letter abbrev (e.g., "J. R. R.")
      if (wordMatch && wordMatch[1] && wordMatch[1].length === 1 && /[A-Z]/.test(wordMatch[1])) {
        continue;
      }
    }

    sentences.push(buf.trim());
    buf = "";
    // skip the trailing space we already inspected
    while (i + 1 < len && cleaned[i + 1] === " ") i++;
  }
  if (buf.trim()) sentences.push(buf.trim());
  return sentences;
}

/** Lower-case a surface form into a dictionary key.
 *  - Strips surrounding apostrophes and trailing 's
 *  - Lowercases
 *  - Returns "" if not a word.
 */
export function wordKey(surface: string): string {
  let s = surface.trim();
  // Strip leading/trailing punctuation (but keep internal apostrophe/hyphen)
  s = s.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
  if (!s) return "";
  s = s.toLowerCase();
  return s;
}

/** Tokenize a sentence into ordered Token[] preserving spaces. */
export function tokenizeSentence(sentence: string): Token[] {
  const tokens: Token[] = [];
  const len = sentence.length;
  let i = 0;
  while (i < len) {
    const ch = sentence[i] ?? "";
    if (/\s/.test(ch)) {
      let j = i;
      while (j < len && /\s/.test(sentence[j] ?? "")) j++;
      tokens.push({ kind: "space", text: sentence.slice(i, j) });
      i = j;
      continue;
    }
    // Word-ish: letters / apostrophes / hyphens / digits embedded in words
    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < len && /[A-Za-z0-9'\-]/.test(sentence[j] ?? "")) j++;
      const text = sentence.slice(i, j);
      const key = wordKey(text);
      if (key) {
        tokens.push({ kind: "word", text, key });
      } else {
        tokens.push({ kind: "punct", text });
      }
      i = j;
      continue;
    }
    // Otherwise: a single punctuation char (or run of same punct chars)
    let j = i + 1;
    while (j < len && /[^\sA-Za-z]/.test(sentence[j] ?? "")) j++;
    tokens.push({ kind: "punct", text: sentence.slice(i, j) });
    i = j;
  }
  return tokens;
}

/** Build sentence objects (with id + tokens) from a paragraph string. */
export function paragraphSentences(paragraphId: string, text: string): Sentence[] {
  const raw = splitSentences(text);
  return raw.map((s, idx) => ({
    id: `${paragraphId}-s${idx}`,
    text: s,
    tokens: tokenizeSentence(s),
  }));
}

/** Collect every unique word key from sentences (for dictionary enrichment). */
export function collectKeys(sentences: Sentence[]): Set<string> {
  const keys = new Set<string>();
  for (const s of sentences) {
    for (const t of s.tokens) {
      if (t.kind === "word" && t.key) keys.add(t.key);
    }
  }
  return keys;
}
