import type {
  ArticlePreview,
  ArticleType,
  CEFR,
  DailyDigest,
  ProfileSummary,
  ReaderArticle,
  Sentence,
  Token,
  VocabularySnapshot,
} from "@buildspeak/types";
import { todaySubscriptionFeed } from "./mock-feed";

const t = (text: string): Token => ({ kind: "text", text });

const w = (
  surface: string,
  lemma: string,
  translation: string,
  ipa?: string,
  isKnown = false,
): Token => ({
  kind: "word",
  surface,
  lemma,
  translation,
  ipa,
  isKnown,
});

const sentence = (
  id: string,
  zh: string,
  en: Token[],
  extras?: Pick<Sentence, "speaker" | "timestamp">,
): Sentence => ({
  id,
  zh,
  en,
  ...extras,
});

const glossary = {
  agentic: {
    lemma: "agentic",
    translation: "代理式的；能动的",
    ipa: "/eɪˈdʒen.tɪk/",
    pos: "adj.",
  },
  stablecoins: {
    lemma: "stablecoin",
    translation: "稳定币",
    ipa: "/ˈsteɪ.bəl.kɔɪn/",
    pos: "n.",
  },
  stablecoin: {
    lemma: "stablecoin",
    translation: "稳定币",
    ipa: "/ˈsteɪ.bəl.kɔɪn/",
    pos: "n.",
  },
  protocol: {
    lemma: "protocol",
    translation: "协议",
    ipa: "/ˈproʊ.tə.kɑːl/",
    pos: "n.",
  },
  artifacts: {
    lemma: "artifact",
    translation: "工件；产物",
    ipa: "/ˈɑːr.t̬ə.fækt/",
    pos: "n.",
  },
  artifact: {
    lemma: "artifact",
    translation: "工件；产物",
    ipa: "/ˈɑːr.t̬ə.fækt/",
    pos: "n.",
  },
  automation: {
    lemma: "automation",
    translation: "自动化",
    ipa: "/ˌɔː.təˈmeɪ.ʃən/",
    pos: "n.",
  },
  security: {
    lemma: "security",
    translation: "安全",
    ipa: "/sɪˈkjʊr.ə.t̬i/",
    pos: "n.",
  },
  tokenized: {
    lemma: "tokenized",
    translation: "代币化的",
    ipa: "/ˈtoʊ.kə.naɪzd/",
    pos: "adj.",
  },
  "computer use": {
    lemma: "computer use",
    translation: "计算机代理能力",
    ipa: "/kəmˈpjuː.t̬ɚ juːs/",
    pos: "n.",
  },
  telepathy: {
    lemma: "telepathy",
    translation: "心灵感应",
    ipa: "/təˈlep.ə.θi/",
    pos: "n.",
  },
  html: {
    lemma: "HTML",
    translation: "HTML",
    ipa: "/ˌeɪtʃ.t̬iː.emˈel/",
    pos: "n.",
  },
} as const;

const podcastTranslations: Record<string, string> = {
  "00:05":
    "今天的 No Priors 请来了 Circle 联合创始人兼 CEO Jeremy Allaire，主题是加密货币、AI、agentic payments 和区块链。",
  "00:22":
    "先从 Circle 的起源说起：它为什么会同时把稳定币、crypto 和 agentic future 放在一起思考？",
  "00:36":
    "Circle 最早的想法，是在互联网上做一套美元协议，让价值可以像信息一样即时、全球、低摩擦地流动。",
  "01:16":
    "更激进的想法是可编程货币：把区块链变成操作系统，让软件机器直接参与经济活动。",
  "02:11":
    "这里的关键问题是：为什么仍然要围绕美元，而不是完全脱离传统金融体系？",
  "05:22":
    "Jeremy 的答案是：未来很长一段时间里，美元仍是主储备货币，而稳定币的价值在于把它做成更安全的 full-reserve money。",
  "08:15":
    "USDC 的设计目标就是互联网原生美元协议，从 25 美分的游戏支付到数亿美元的机构结算都能跑在同一套轨道上。",
  "16:02":
    "真正的变化在于，越来越多白领经济里的工作会由 AI agents 完成，而现有金融基础设施根本支撑不了这种 agentic economy。",
  "20:33":
    "ARC 想扮演的角色，是 agentic economy 的经济操作系统，让价值存储、交易和合约执行都能以机器原生的方式发生。",
  "30:46":
    "接下来讨论的问题，是现实世界资产上链之后，像股票这类资产会不会也变成全球可编程的 token。",
};

const xSummaries: Record<string, string> = {
  swyx: "Swyx 在说真正可用的 computer use 终于开始从 demo 变成产品能力。",
  joshwoodward: "Josh Woodward 这条更像 builder 招呼，先作为生态动态样本保留。",
  petergyang: "Peter Yang 觉得 agents 不只在写代码，也开始进入设计和前端工作流。",
  thenanyu: "Nan Yu 这条偏日常吐槽，先保留原文作为 feed 噪声样本。",
  amasad: "Amjad Masad 这条偏轻量社交内容，保留为真实时间线样本。",
  rauchg: "Guillermo Rauch 的重点是安全事件后的产品修补、MFA 强化和密钥轮换。",
  alexalbert__: "Alex Albert 这条是阅读推荐，也说明 builder feed 不全是产品发布。",
  levie: "Aaron Levie 在强调 agent automation 落地需要上下文接线、eval 和专门负责人。",
  ryolu_: "Ryo Lu 的内容偏设计氛围，保留为产品设计团队动态样本。",
  garrytan: "Garry Tan 一边在 YC 视角看人和创业，一边在分享 OpenClaw 生态迁移实践。",
  mattturck: "Matt Turck 在反驳“AI TAM 等于全部人工成本”的简单叙事。",
  zarazhangrui: "Zara Zhang 在强调 agents 直接生成 HTML 往往比 XML 更自然、更好看。",
  nikunj: "Nikunj Kothari 这批内容一半是播客推荐，一半是轻松吐槽，先保留原文。",
  steipete: "Peter Steinberger 连续发布工具更新，重点是安全、可靠性和 Google 工作流连接。",
  danshipper: "Dan Shipper 在连发几个短判断：双 agent 更好，新的模型做 code review 更强。",
  sama: "Sam Altman 这批动态里更值得看的，是把新能力内部代号称作 telepathy 的那条。",
  claudeai: "Claude 官方在推新的 Live Artifacts：可持久保存、带版本历史、还能实时刷新数据。",
};

const preferredTweetIds: Record<string, string> = {
  swyx: "2046362691606855700",
  petergyang: "2046434019307561342",
  rauchg: "2046406894269747668",
  garrytan: "2046464315918864385",
  steipete: "2046356596683411924",
  sama: "2046330082726384051",
  claudeai: "2046328619249684989",
};

const coverPalettes = [
  ["#1f3c88", "#7f8ff4"],
  ["#0f766e", "#22c55e"],
  ["#7c2d12", "#f97316"],
  ["#111827", "#4b5563"],
  ["#1d4ed8", "#93c5fd"],
  ["#4338ca", "#a78bfa"],
  ["#166534", "#4ade80"],
  ["#7e22ce", "#d8b4fe"],
] as const;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const formatDigestDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const hashString = (value: string) =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const makeCover = (seed: string, label: string) => {
  const palette = coverPalettes[hashString(seed) % coverPalettes.length];

  return {
    label,
    from: palette[0],
    to: palette[1],
  };
};

const makeLabel = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || value.slice(0, 2).toUpperCase();

const cleanText = (value: string) =>
  value.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();

const inferLevel = (textLength: number): CEFR => {
  if (textLength > 1200) {
    return "C1";
  }

  if (textLength > 360) {
    return "B2";
  }

  if (textLength > 160) {
    return "B1";
  }

  return "A2";
};

const estimateReadMinutes = (text: string) =>
  clamp(Math.ceil(cleanText(text).split(/\s+/).filter(Boolean).length / 180), 1, 28);

const glossaryTerms = Object.keys(glossary).sort((left, right) => right.length - left.length);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildTokens = (text: string): Token[] => {
  const matches = glossaryTerms
    .flatMap((term) => {
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
      return Array.from(text.matchAll(pattern)).map((match) => ({
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        surface: match[0],
        term,
      }));
    })
    .sort((left, right) => left.start - right.start)
    .filter((match, index, all) => index === 0 || match.start >= all[index - 1].end);

  if (!matches.length) {
    return [t(text)];
  }

  const tokens: Token[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      tokens.push(t(text.slice(cursor, match.start)));
    }

    const entry = glossary[match.term as keyof typeof glossary];
    tokens.push(w(match.surface, entry.lemma, entry.translation, entry.ipa));
    cursor = match.end;
  }

  if (cursor < text.length) {
    tokens.push(t(text.slice(cursor)));
  }

  return tokens;
};

const parsePodcastTranscript = (transcript: string) => {
  const blocks = Array.from(
    transcript.matchAll(
      /Speaker (\d+) \| (\d{2}:\d{2}) - (\d{2}:\d{2})\n([\s\S]*?)(?=\n\nSpeaker \d+ \||$)/g,
    ),
  );

  return blocks.map((block, index) => {
    const speaker = block[1] === "1" ? "Sarah Guo" : "Jeremy Allaire";
    const start = block[2];
    const english = cleanText(block[4]);

    return sentence(
      `podcast-${index + 1}`,
      podcastTranslations[start] ?? "译文待接入构建期翻译 pipeline。",
      buildTokens(english),
      {
        speaker,
        timestamp: start,
      },
    );
  });
};

const topTweetForBuilder = (
  builder: (typeof todaySubscriptionFeed.x)[number],
) => {
  const preferredId = preferredTweetIds[builder.handle];

  if (preferredId) {
    const preferredTweet = builder.tweets.find((tweet) => tweet.id === preferredId);
    if (preferredTweet) {
      return preferredTweet;
    }
  }

  return [...builder.tweets].sort(
    (left, right) =>
      right.likes +
      right.retweets * 4 +
      right.replies * 2 -
      (left.likes + left.retweets * 4 + left.replies * 2),
  )[0];
};

const orderedTweetsForBuilder = (
  builder: (typeof todaySubscriptionFeed.x)[number],
) => {
  const featured = topTweetForBuilder(builder);
  return [featured, ...builder.tweets.filter((tweet) => tweet.id !== featured.id)].slice(0, 3);
};

const podcastArticle: ReaderArticle = {
  id: "podcast-no-priors-agentic-economy",
  type: "podcast",
  title: {
    en: "The Agentic Economy",
    zh: "代理经济：AI 代理如何重塑金融系统",
  },
  source: {
    name: todaySubscriptionFeed.podcasts[0].name,
    subtitle: `${formatDate(todaySubscriptionFeed.podcasts[0].publishedAt)} · with Jeremy Allaire`,
  },
  stats: {
    duration: "~52 min",
    readMinutes: 22,
    level: "B2",
    newWords: 18,
  },
  quote: "Stablecoins are the native money layer of the internet.",
  cover: makeCover("No Priors", "NP"),
  sourceUrl: todaySubscriptionFeed.podcasts[0].url,
  speakers: [
    { id: "host", label: "Sarah Guo", accent: "#d97757" },
    { id: "guest", label: "Jeremy Allaire", accent: "#2f6feb" },
  ],
  sentences: parsePodcastTranscript(todaySubscriptionFeed.podcasts[0].transcript),
};

const xArticles: ReaderArticle[] = todaySubscriptionFeed.x.map((builder) => {
  const featuredTweet = topTweetForBuilder(builder);
  const orderedTweets = orderedTweetsForBuilder(builder);
  const joinedText = orderedTweets.map((tweet) => cleanText(tweet.text)).join(" ");
  const sourceName = builder.handle === "claudeai" ? "Claude" : builder.name;

  return {
    id: builder.handle === "swyx" ? "x-swyx-codex-deal" : `x-${builder.handle}`,
    type: "x",
    title: {
      en: `Signals from ${builder.name}`,
      zh: `${builder.name} 的今日 X 动态`,
    },
    source: {
      name: sourceName,
      subtitle: `${builder.handle} · ${formatDate(featuredTweet.createdAt)} · ${builder.tweets.length} posts`,
    },
    stats: {
      readMinutes: estimateReadMinutes(joinedText),
      level: inferLevel(joinedText.length),
      newWords: clamp(buildTokens(joinedText).filter((token) => token.kind === "word").length + 2, 3, 12),
      likes: featuredTweet.likes,
      replies: featuredTweet.replies,
      reposts: featuredTweet.retweets,
    },
    quote: cleanText(featuredTweet.text),
    cover: makeCover(builder.handle, makeLabel(builder.name)),
    sourceUrl: featuredTweet.url,
    sentences: orderedTweets.map((tweet, index) =>
      sentence(
        `${builder.handle}-${index + 1}`,
        xSummaries[builder.handle] ??
          `${builder.name} 的这条动态已接入原文，中文摘要会在后续 pipeline 里生成。`,
        buildTokens(cleanText(tweet.text)),
        {
          timestamp: formatDate(tweet.createdAt),
        },
      ),
    ),
  };
});

const blogArticle: ReaderArticle = {
  id: "blog-claude-security-offense",
  type: "blog",
  title: {
    en: todaySubscriptionFeed.blogs[0].title,
    zh: "为 AI 加速攻防做好安全准备",
  },
  source: {
    name: todaySubscriptionFeed.blogs[0].name,
    subtitle: `${formatDate(todaySubscriptionFeed.blogs[0].publishedAt)} · security guidance`,
  },
  stats: {
    readMinutes: 17,
    level: "C1",
    newWords: 16,
  },
  quote:
    "Within the next 24 months, vast numbers of bugs that sat unnoticed in code will be found by AI models and chained into working exploits.",
  cover: makeCover("claude-security", "CB"),
  sourceUrl: todaySubscriptionFeed.blogs[0].url,
  sentences: [
    sentence(
      "blog-1",
      "Claude Blog 先给出判断：未来两年里，大量长期潜伏的漏洞会被 AI 批量发现，并被串成可用 exploit。",
      buildTokens(
        "Within the next 24 months, vast numbers of bugs that sat unnoticed in code will be found by AI models and chained into working exploits.",
      ),
    ),
    sentence(
      "blog-2",
      "第一优先级不是炫技，而是缩短 patch gap，把 KEV 和高 EPSS 漏洞尽快打掉。",
      buildTokens(
        "Patch everything on the CISA Known Exploited Vulnerabilities catalog immediately. Use EPSS to prioritize the rest.",
      ),
    ),
    sentence(
      "blog-3",
      "第二个变化是漏洞处理量会暴涨，所以 intake、triage 和 remediation tracking 需要自动化提速。",
      buildTokens(
        "Prepare to handle a much higher volume of vulnerability reports. Plan for an order-of-magnitude increase in finding volume.",
      ),
    ),
    sentence(
      "blog-4",
      "文章把 AI-assisted code review 放进了默认工具箱，强调高置信度发现就应该阻塞合并。",
      buildTokens(
        "Add static analysis and AI-assisted code review to your continuous integration pipeline, and block merges on high-confidence findings.",
      ),
    ),
    sentence(
      "blog-5",
      "在防线设计上，它更偏向零信任、硬件绑定身份和短期 token，而不是依赖人类流程摩擦。",
      buildTokens(
        "Adopt zero trust architecture. Tie access to verified hardware rather than credentials. Replace long-lived secrets with short-lived tokens.",
      ),
    ),
    sentence(
      "blog-6",
      "最后一层建议是把模型放到告警队列最前面，用它做 first-pass triage 和 incident bookkeeping。",
      buildTokens(
        "Put a model at the front of your alert queue. Automate the bookkeeping around incidents. Run a tabletop for five simultaneous incidents.",
      ),
    ),
  ],
};

const readerArticles: ReaderArticle[] = [podcastArticle, ...xArticles, blogArticle];

const vocabularySnapshot: VocabularySnapshot = {
  totalWords: 24,
  reviewQueue: 6,
  weeklyAdds: 14,
  entries: [
    {
      lemma: "agentic",
      ipa: glossary.agentic.ipa,
      pos: glossary.agentic.pos,
      translation: glossary.agentic.translation,
      source: "No Priors · Apr 9",
      speaker: "Jeremy Allaire",
      quote:
        "The agentic economy is being born as we speak.",
      quoteZh: "所谓的 agentic economy，正在此刻成形。",
      tags: ["ai", "economy"],
      bucket: "today",
      nextReview: "Tomorrow",
      stage: 1,
      seenCount: 1,
    },
    {
      lemma: "stablecoin",
      ipa: glossary.stablecoin.ipa,
      pos: glossary.stablecoin.pos,
      translation: glossary.stablecoin.translation,
      source: "No Priors · Apr 9",
      speaker: "Jeremy Allaire",
      quote: "Stablecoins are the native money layer of the internet.",
      quoteZh: "稳定币是互联网原生的货币层。",
      tags: ["finance", "crypto"],
      bucket: "today",
      nextReview: "In 3 days",
      stage: 2,
      seenCount: 3,
    },
    {
      lemma: "artifact",
      ipa: glossary.artifact.ipa,
      pos: glossary.artifact.pos,
      translation: glossary.artifact.translation,
      source: "Claude · Apr 20",
      speaker: "Claude",
      quote:
        "In Cowork, Claude can now build live artifacts: dashboards and trackers connected to your apps and files.",
      quoteZh: "在 Cowork 里，Claude 现在能直接生成 live artifacts，例如连接应用和文件的仪表盘与追踪器。",
      tags: ["product", "ui"],
      bucket: "thisWeek",
      nextReview: "Tonight",
      stage: 1,
      seenCount: 1,
    },
    {
      lemma: "telepathy",
      ipa: glossary.telepathy.ipa,
      pos: glossary.telepathy.pos,
      translation: glossary.telepathy.translation,
      source: "Sam Altman · Apr 20",
      speaker: "Sam Altman",
      quote: 'The internal working name for this was "telepathy", and it feels like it.',
      quoteZh: "这个能力的内部代号叫 telepathy，而且它真的有那种感觉。",
      tags: ["product", "ai"],
      bucket: "all",
      nextReview: "Learned",
      stage: 4,
      seenCount: 5,
    },
  ],
};

const profileSummary: ProfileSummary = {
  streakDays: 28,
  totalWords: vocabularySnapshot.totalWords,
  totalArticles: readerArticles.length,
  totalMinutes: readerArticles.reduce((sum, article) => sum + article.stats.readMinutes, 0) + 96,
  spotlight: "AI builders are collapsing product, security, and agent infrastructure into the same daily feed.",
  recentActivity: Array.from({ length: 14 }, (_, index) => {
    const date = new Date("2026-04-22T00:00:00.000Z");
    date.setUTCDate(date.getUTCDate() - (13 - index));

    return {
      date: date.toISOString().slice(0, 10),
      minutes: [0, 9, 14, 23, 11, 0, 27, 15, 19, 31, 16, 0, 18, 24][index] ?? 0,
    };
  }),
};

const groupByType = (): DailyDigest["sections"] => ({
  podcast: readerArticles.filter((article) => article.type === "podcast"),
  x: readerArticles.filter((article) => article.type === "x"),
  blog: readerArticles.filter((article) => article.type === "blog"),
});

export const getDailyDigest = (): DailyDigest => {
  const sections = groupByType();

  return {
    dateLabel: formatDigestDate(todaySubscriptionFeed.generatedAt),
    hero: {
      title: "Twelve new things the AI builders said out loud today.",
      subtitle: `今天这份订阅 feed 里有 ${todaySubscriptionFeed.stats.podcastEpisodes} 期播客、${todaySubscriptionFeed.stats.totalTweets} 条推文、${todaySubscriptionFeed.stats.blogPosts} 篇博客，全部来自你追踪的 AI builders。`,
      streakDays: profileSummary.streakDays,
      todayMinutes: 14,
      targetMinutes: 20,
      wordsToday: 7,
      reviewQueue: vocabularySnapshot.reviewQueue,
    },
    tabs: [
      { id: "podcast", label: "Podcasts", count: sections.podcast.length },
      { id: "x", label: "X Posts", count: sections.x.length },
      { id: "blog", label: "Blogs", count: sections.blog.length },
    ],
    sections,
    featuredArticle: podcastArticle,
  };
};

export const getReaderArticle = (
  type: ArticleType,
  id: string,
): ReaderArticle | undefined =>
  readerArticles.find((article) => article.type === type && article.id === id);

export const getAllReaderRoutes = (): Array<Pick<ArticlePreview, "id" | "type">> =>
  readerArticles.map((article) => ({ id: article.id, type: article.type }));

export const getFeaturedReaderHref = (): string =>
  `/read/${podcastArticle.type}/${podcastArticle.id}`;

export const getVocabularySnapshot = (): VocabularySnapshot => vocabularySnapshot;

export const getProfileSummary = (): ProfileSummary => profileSummary;
