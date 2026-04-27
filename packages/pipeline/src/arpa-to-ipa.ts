// arpa-to-ipa.ts — convert CMU ARPAbet phoneme strings to IPA.
// Reference: https://en.wikipedia.org/wiki/ARPABET (CMU 39-phone variant)
//            https://en.wikipedia.org/wiki/Help:IPA/English

const VOWELS_STRESSED = new Map<string, string>([
  ["AA", "ɑ"],
  ["AE", "æ"],
  ["AH", "ʌ"], // stressed schwa-ish
  ["AO", "ɔ"],
  ["AW", "aʊ"],
  ["AY", "aɪ"],
  ["EH", "ɛ"],
  ["ER", "ɝ"],
  ["EY", "eɪ"],
  ["IH", "ɪ"],
  ["IY", "i"],
  ["OW", "oʊ"],
  ["OY", "ɔɪ"],
  ["UH", "ʊ"],
  ["UW", "u"],
]);

const VOWELS_UNSTRESSED = new Map<string, string>([
  ["AH", "ə"], // schwa
  ["ER", "ɚ"], // r-colored schwa
  // Others fall back to the stressed mapping
]);

const CONSONANTS = new Map<string, string>([
  ["B", "b"],
  ["CH", "tʃ"],
  ["D", "d"],
  ["DH", "ð"],
  ["F", "f"],
  ["G", "ɡ"],
  ["HH", "h"],
  ["JH", "dʒ"],
  ["K", "k"],
  ["L", "l"],
  ["M", "m"],
  ["N", "n"],
  ["NG", "ŋ"],
  ["P", "p"],
  ["R", "ɹ"],
  ["S", "s"],
  ["SH", "ʃ"],
  ["T", "t"],
  ["TH", "θ"],
  ["V", "v"],
  ["W", "w"],
  ["Y", "j"],
  ["Z", "z"],
  ["ZH", "ʒ"],
]);

interface Syllable {
  ipa: string;
  stress: 0 | 1 | 2;
}

/** Convert ARPAbet (e.g. "HH AH0 L OW1") to IPA (e.g. "/həˈloʊ/"). */
export function arpaToIpa(arpa: string): string {
  const phonemes = arpa.trim().split(/\s+/).filter(Boolean);
  if (!phonemes.length) return "";

  // Group into syllables. A syllable starts with optional onset consonants and contains exactly one vowel.
  const syllables: Syllable[] = [];
  let onset = "";
  for (const ph of phonemes) {
    const stressMatch = ph.match(/^([A-Z]+)([012])?$/);
    if (!stressMatch) continue;
    const phon = stressMatch[1] ?? "";
    const stress = (stressMatch[2] ? Number(stressMatch[2]) : -1) as 0 | 1 | 2 | -1;

    const isVowel = VOWELS_STRESSED.has(phon);
    if (isVowel) {
      const ipa = (stress === 0 && VOWELS_UNSTRESSED.has(phon))
        ? VOWELS_UNSTRESSED.get(phon)!
        : VOWELS_STRESSED.get(phon)!;
      syllables.push({ ipa: onset + ipa, stress: (stress === -1 ? 0 : stress) as 0 | 1 | 2 });
      onset = "";
    } else {
      const c = CONSONANTS.get(phon);
      if (!c) continue;
      // If we already finished a syllable, attach this consonant as a coda to it
      // unless the next phoneme is a vowel (deferred onset).
      onset += c;
    }
  }
  // Append any trailing consonants as a coda to the last syllable.
  if (onset && syllables.length) {
    const last = syllables[syllables.length - 1]!;
    last.ipa += onset;
    onset = "";
  } else if (onset && !syllables.length) {
    // No vowels at all (rare)
    return `/${onset}/`;
  }

  // Re-balance: move trailing consonants of one syllable to the next syllable's onset
  // ONLY if doing so improves the look (heuristic: keep at least 1 consonant before each stressed vowel).
  // For simplicity, leave as-is — coda-heavy is acceptable for learner display.

  const out = syllables
    .map((s, idx) => {
      const mark = s.stress === 1 ? "ˈ" : s.stress === 2 ? "ˌ" : "";
      // Don't add stress mark on first syllable if it's the only one or if all unstressed
      if (idx === 0 && syllables.length === 1) return s.ipa;
      return `${mark}${s.ipa}`;
    })
    .join("");

  return `/${out}/`;
}
