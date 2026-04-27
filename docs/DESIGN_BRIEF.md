# BuildSpeak — Design Brief

Paste the full content of this file into a Claude.ai conversation and ask it
to "design a complete UI system + all pages as static HTML/CSS Artifacts."
You can iterate further by asking for specific page variants or component
deep-dives.

---

## 1. Product context

**BuildSpeak** is a daily web reader for content from top AI builders
(researchers, founders, PMs, engineers). Every day a small batch of
content arrives from a curated list of ~25 X/Twitter accounts, ~6 YouTube
podcasts, and ~2 official AI company blogs. BuildSpeak reads that batch,
translates each paragraph to Chinese, and presents it as a daily issue.

The primary user is a Chinese-native, English-second tech professional in
the AI/SaaS space. They use BuildSpeak as their **daily AI news digest**
in a context where they would otherwise have to read English X/podcasts
directly. The bilingual + word-lookup features are a learning bonus, not
the core promise.

**Tagline candidates** (pick the one the design supports best):
- "Daily reading from the people actually building AI."
- "Don't keep up with AI news. Keep up with AI builders."
- "Today, in builders' own words."

**What the product is NOT**: it is not a Duolingo / language-learning app.
Avoid gamification (streaks-as-pressure, XP, mascots). It is closer in
spirit to: Hacker News + Stratechery + Stripe Press.

---

## 2. Positioning shift the design must support

A previous draft of the product treated this as a "learn English using
real content" tool. We are repositioning to:

> **Daily AI builder digest. Bilingual by default. Tap any word for
> meaning — but read first, look words up second.**

Implications for the design:
- The hero of the home page is **the day's content**, not the user's
  vocab streak.
- Bilingual layout is supportive, not central. It must not get in the way
  of reading just the English (or just the Chinese).
- Audio playback (TTS) is a power feature, not the front of the page.
- Word-lookup popovers must feel like a tool you reach for, not a tutorial
  that interrupts you.

---

## 3. Audience & content shape

Daily volume (real numbers from a recent run):
- **1 podcast** per day, ~40 min, ~13 000 English words, with speaker
  labels and timecodes (e.g. "Speaker 1 | 00:05 - 00:19")
- **0–1 official blog post** per day, long-form (~3 000 words)
- **10–17 builders** with **20–35 tweets total**, each tweet 50–400
  characters, sometimes a quote-tweet

So a single "issue" is a mix of one long-form audio piece, optionally one
long-form blog, and many short pieces from many people. The design must
feel comfortable holding all three in one view.

---

## 4. Pages required

### 4.1 Home (`/`)
Today's issue. Default landing.
- Issue date prominent, with **prev / next day arrows** in the header so
  the user can move backward day-by-day without leaving home
- A single **hero block** at the top: the most editorially valuable item
  of the day (priority: podcast > blog > highest-engagement tweet thread)
- Below the hero, three sections:
  1. **🎙 Podcast** — usually 0 or 1 today; if present, secondary card
     with a 1-line Chinese summary hook
  2. **🐦 X / Twitter** — grouped by builder. Each builder card shows
     name + handle + bio one-liner, then **the first 2 tweets inline**
     (English + Chinese), then "+ N more →" if there are more. Click
     opens the full builder-day reader. Avoid showing only a name list.
  3. **📰 Blog** — usually 0 or 1
- Footer: link to `/archive`, `/vocab`

### 4.2 Reader (`/read/[type]/[id]`)
The detail page for one article.
- Reusable for podcast (long, paragraph-heavy with speaker labels),
  tweet (cards), and blog (long-form)
- Each paragraph: English on the left/top, Chinese on the right/bottom
- Layout toggle: **双语 / 仅英文 / 仅中文** (segmented control)
- Per-paragraph play button (subtle, only on hover/focus)
- Top-of-page play-all button (primary)
- Sentences are highlight-tracked while playing (yellow underline or soft
  background)
- **Words**: each English word is a tap target. On click, a popover shows
  IPA, Chinese definition (1–3 short glosses), the source sentence in
  context, and a "+ 加入生词本" button. If the word is already in the
  user's vocab list, indicate with a thin underline in the text.
- Article header: type label (PODCAST / BLOG / X), source name + handle
  (with link out), publication time, word count, est. reading time
- Footer: previous / next article (within the same day)
- Keyboard: Space = play/stop, ←/→ = previous/next sentence

### 4.3 Archive (`/archive`)
Calendar view of past issues.
- Default: current month + previous month grid
- Each day cell shows: a small icon row indicating what's available
  (🎙 if podcast, 📰 if blog, 🐦 N if N builders posted), and the
  podcast title or top headline truncated
- Click a day → navigate to `/d/[date]` (which is the same Home view but
  pinned to that date)
- Empty days are visually muted but not hidden
- "older months →" pagination at the bottom

### 4.4 Day view (`/d/[date]`)
Identical to Home, but pinned to a specific past date. The prev/next
arrows in the header still work.

### 4.5 Builder profile (`/b/[handle]`)
Everything from one builder, time-ordered (newest first).
- Header: name, handle, bio (full), link to their X profile
- Tweets grouped by date (sticky date dividers)
- Same word-tap and bilingual behavior as the reader

### 4.6 Vocab (`/vocab`)
The user's saved words.
- List view (default): each item shows the word, IPA, the Chinese
  definition, and the original sentence it was tapped from, with a link
  back to that paragraph
- Sort: by date added (default), alphabetical, or "next due for review"
  (review feature is P1 — design only the data shape, not the UI for it)
- Empty state: a single illustrated paragraph nudging the user to tap a
  word in any article
- **Do not** add streak counters, daily goals, or progress bars on this
  page

### 4.7 Auxiliary
- 404 page (in the BuildSpeak voice)
- About page (very short — origin, source list link, design credits, a
  one-line note about the public follow-builders feed)

---

## 5. Components needed in the system

Reusable across pages. Please style each:
- `IssueHeader` — date, prev/next, optional subtitle ("issue 27 — today")
- `HeroCard` — variant for podcast / blog / tweet
- `PodcastCard`, `BlogCard`, `BuilderCard` (with inline tweet preview)
- `TweetItem` — used inside BuilderCard and on Reader for tweet type
- `ParagraphBlock` — the bilingual unit (en + zh)
- `SentenceMark` — wraps a sentence for play-state highlight
- `WordChip` — interactive word in the reader; states: default, in-vocab,
  hovered, mastered (P2)
- `WordPopover` — pop-up dictionary card, ~320px wide, blur background
- `LanguageToggle` — segmented (双语 / 英 / 中)
- `PlayButton` — primary (page level), secondary (paragraph)
- `CalendarGrid` & `CalendarCell` — for archive
- `BuilderHandleBadge` — name + @handle row
- `EngagementRow` — likes / RTs / replies / source link for tweets
- `EmptyState` — for vocab and "no content today"
- `KeyboardHint` — small footer text showing shortcuts
- `Footer`, `SiteHeader`

---

## 6. Visual direction

### Mood
**Editorial, calm, serious.** Reads like a well-designed digital magazine
crossed with a developer tool. The user should feel like "this is the
adult version of an AI newsfeed", not "AI bootcamp".

### Reference vibes (you can blend, not copy)
- **Stratechery** newsletter web — long-form, restrained, calm
- **Stripe Press** — typographic confidence, generous whitespace
- **Linear** changelog page — modern tech editorial without being cold
- **Hacker News** — density when it serves reading speed
- Avoid: Substack-default look, Duolingo, any neon/playful tech aesthetic

### Color
- Light mode primary; dark mode is a P1 (design tokens both, render light)
- Background: warm off-white (around `#FAFAF7` / `#F8F6F1`)
- Foreground: near-black (`#1A1A1A`), not pure black
- One accent color for links, primary buttons, vocab underline. Pick
  something that holds up against warm beige bg — a deep cobalt blue or
  oxblood works. Avoid bright tech-blue.
- Type-specific tints, used very lightly in card backgrounds:
  - Podcast: warm amber tint
  - Tweet: soft sky tint
  - Blog: sage tint
  These should be muted enough to coexist on the home page without
  feeling like a kid's app.
- A play-state highlight color (yellow-ish, ~8% alpha) for sentences

### Typography
- English serif for body (something with personality but readable —
  Source Serif Pro, Iowan Old Style, Charter, IBM Plex Serif, or Newsreader)
- Chinese sans for body (PingFang SC, Noto Sans SC, or Source Han Sans)
- Sans-serif for UI chrome (Inter, IBM Plex Sans, or system-ui)
- Mono for IPA and timecodes (Berkeley Mono, JetBrains Mono, or system-mono)
- Body line-height: ~1.75 for English, ~1.85 for Chinese
- Body size: 17–18px desktop, 16px mobile

### Spacing & rhythm
- Generous: 64px between major sections, 32px between cards
- Reading column: max 720px wide for reader content
- Home column: max 880px

### Density
Calm but not sparse. The home page should comfortably show one full day's
content above the fold on a 1366×768 laptop without hiding everything
behind cards.

---

## 7. Responsive behavior

- **≥1024px**: Reader uses a 1.4fr / 1fr two-column bilingual layout
  (English wider). Home is single-column with 880px max width.
- **768–1023px**: Reader stacks; English first, Chinese directly below
  per paragraph.
- **<768px**: Single column everywhere. Hero card simplifies to title +
  source + 2-line summary. Word popovers anchor bottom-sheet style on
  mobile (full width, slide up from bottom).

---

## 8. Microcopy & voice

- Chinese-first labels for navigation, but English is allowed when
  natural ("PODCAST" / "BLOG" badges look better in English)
- Tone: like an editor explaining things calmly to a smart peer; not a
  teacher, not a hype account
- Avoid emoji except in the section badges (🎙 🐦 📰)
- Empty states: one short sentence, no exclamation marks
- Date format: "2026 年 4 月 27 日 · 周一" on screen, "Apr 27 2026" only
  in monospace small contexts

---

## 9. Sample content to design with

Use real samples below so the design isn't styled around lorem.

### Sample podcast paragraph (No Priors with Jeremy Allaire, 2026-04-22)
> EN — Speaker 1 | 00:05 - 00:19
>
> Today on No Priors we have Jeremy Allaire, the co founder and CEO of
> Circle. We'll be talking about cryptocurrency, AI, agentic payments,
> AI evolving on the blockchain, and a variety of other topics. Great.
> Well, thank you so much for joining us today. It's a pleasure to have
> you.
>
> ZH —
>
> 今天做客 No Priors 节目的是 Circle 的联合创始人兼 CEO Jeremy Allaire。
> 我们会聊 cryptocurrency（加密货币）、AI、agentic payments（agent
> 驱动支付）、AI 在 blockchain（区块链）上的演进，以及其他各种话题。太好了。
> 非常感谢你今天加入我们，很高兴邀请到你。

### Sample tweets (Aaron Levie, @levie, Box CEO)
> EN: The jump from working with a chatbot to having an agent that
> actually helps assemble a process requires a real amount of work.
> Most companies will need to have dedicated people that are responsible
> for bringing automation to their teams.
>
> ZH: 从用聊天机器人到让一个 agent 真正参与流程组装，这个跳跃需要相当多的
> 工作。大多数公司都会需要专门的人员负责把自动化引入团队。
>
> ❤ 132   🔁 24   💬 8     12:34 · 2026-04-21

### Sample word popover content
- Word: `agentic`
- IPA: (no CMU entry, so popover hides this row)
- ZH: 自主代理的
- Context: "the agentic economy will reshape software procurement"
- Buttons: ♪ 朗读 · + 加入生词本

### Sample word popover with IPA
- Word: `software`
- IPA: `/ˈsɔˌftwɛɹ/`
- ZH: 软件
- Context: "...autonomous software machines."

---

## 10. Constraints / non-goals

- All pages render statically (Next.js 16 SSG export). No realtime data
  on the page.
- No login. No per-user server state. Vocab and read-state live in
  localStorage only.
- No comments, no community, no sharing UI beyond a copy-link button.
- No streaks, no XP, no daily goal nags. The product respects the
  user's time.
- Don't design a payment / paywall flow.

---

## 11. Deliverables expected from the design

1. A short style guide page documenting tokens: colors (with hex),
   typography scale, spacing scale, radii, shadow ramp.
2. The 7 page layouts above (Home / Reader / Archive / Day view /
   Builder / Vocab / About + 404), at desktop and mobile breakpoints.
3. The component states for the WordPopover and the LanguageToggle and
   the PlayButton.
4. One "in motion" annotation for the sentence-while-playing highlight
   (a frame showing how the highlight looks).
5. Output as standalone HTML + CSS, **no JavaScript framework**, so the
   developer (Claude Code) can convert to React + Tailwind v4 cleanly.
   Use CSS variables for tokens. Use class names that describe role,
   not appearance (e.g. `.reader-en`, `.vocab-pill`, not `.text-blue-700`).

---

## 12. Open questions you can answer at design time

If unsure, decide and document the choice in a short note at the top of
the deliverable:

- Light only, or also a dark mode pass?
- Serif or sans for headings? (recommendation: serif for content
  headings on Reader, sans for UI labels everywhere else)
- Hero treatment: does today's hero get a large illustration / pattern
  block, or is it pure type?
- Do builder cards on Home show avatars (we don't have them yet, but the
  X handle is enough to query gravatar-style placeholders) or initials
  in a circle?
