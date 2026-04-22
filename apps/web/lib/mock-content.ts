import type {
  ArticlePreview,
  ArticleType,
  DailyDigest,
  ProfileSummary,
  ReaderArticle,
  Sentence,
  Token,
  VocabularySnapshot,
} from "@buildspeak/types";

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

const readerArticles: ReaderArticle[] = [
  {
    id: "podcast-no-priors-agentic-economy",
    type: "podcast",
    title: {
      en: "The Agentic Economy",
      zh: "代理经济",
    },
    source: {
      name: "No Priors",
      subtitle: "Apr 9, 2026 · with Jeremy Allaire",
    },
    stats: {
      duration: "~52 min",
      readMinutes: 22,
      level: "B2",
      newWords: 18,
    },
    quote: "Stablecoins are the native money layer of the internet.",
    cover: {
      label: "NP",
      from: "#1f3c88",
      to: "#7f8ff4",
    },
    sourceUrl: "https://example.com/no-priors-agentic-economy",
    speakers: [
      { id: "host", label: "Sarah Guo", accent: "#d97757" },
      { id: "guest", label: "Jeremy Allaire", accent: "#2f6feb" },
    ],
    sentences: [
      sentence(
        "np-1",
        "稳定币是互联网原生的货币层。",
        [
          w("Stablecoins", "stablecoin", "稳定币", "/ˈsteɪ.bəl.kɔɪn/"),
          t(" are the native money layer of the internet."),
        ],
        { speaker: "Jeremy Allaire", timestamp: "01:16" },
      ),
      sentence(
        "np-2",
        "真正让人兴奋的是，一支由代理组成的全球支付团队开始出现。",
        [
          t("What gets interesting is when "),
          w("agentic", "agentic", "代理式的", "/eɪˈdʒen.tɪk/"),
          t(" finance starts to feel like a global team of assistants."),
        ],
        { speaker: "Jeremy Allaire", timestamp: "01:42" },
      ),
      sentence(
        "np-3",
        "我们终于在把美元协议写进网络本身。",
        [
          t("We are finally writing a "),
          w("protocol", "protocol", "协议", "/ˈproʊ.tə.kɑːl/"),
          t(" for dollars into the fabric of the web."),
        ],
        { speaker: "Sarah Guo", timestamp: "02:08" },
      ),
    ],
  },
  {
    id: "podcast-lennys-agents-at-work",
    type: "podcast",
    title: {
      en: "Agents At Work",
      zh: "代理开始上班",
    },
    source: {
      name: "Lenny's Podcast",
      subtitle: "Apr 11, 2026 · internal tooling edition",
    },
    stats: {
      duration: "~44 min",
      readMinutes: 18,
      level: "B1",
      newWords: 11,
    },
    quote: "The real unlock is when the agent already knows the company's rituals.",
    cover: {
      label: "LP",
      from: "#0f766e",
      to: "#22c55e",
    },
    sourceUrl: "https://example.com/lennys-agents-at-work",
    speakers: [
      { id: "host", label: "Lenny Rachitsky", accent: "#15803d" },
      { id: "guest", label: "Claire Vo", accent: "#0f766e" },
    ],
    sentences: [
      sentence(
        "lp-1",
        "真正的解锁点，是代理已经知道公司内部的工作仪式。",
        [
          t("The real unlock is when the agent already knows the company's "),
          w("rituals", "ritual", "工作仪式", "/ˈrɪtʃ.u.əlz/"),
          t("."),
        ],
        { speaker: "Claire Vo", timestamp: "03:09" },
      ),
      sentence(
        "lp-2",
        "如果上下文是连续的，工作交接就开始变得不重要。",
        [
          t("If your "),
          w("context", "context", "上下文", "/ˈkɑːn.tekst/"),
          t(" is continuous, handoffs stop being the center of gravity."),
        ],
        { speaker: "Claire Vo", timestamp: "03:34" },
      ),
    ],
  },
  {
    id: "x-swyx-codex-deal",
    type: "x",
    title: {
      en: "Codex Might Be The Best Deal",
      zh: "Codex 可能是最值的收购",
    },
    source: {
      name: "swyx",
      subtitle: "@swyx · Apr 20, 2026",
    },
    stats: {
      readMinutes: 3,
      level: "B2",
      newWords: 7,
      likes: 93,
      replies: 17,
      reposts: 4,
    },
    quote: "I've been waiting for real computer use since 2022.",
    cover: {
      label: "sx",
      from: "#111827",
      to: "#4b5563",
    },
    sourceUrl: "https://example.com/swyx-codex-deal",
    sentences: [
      sentence("sx-1", "Codex 收购 Sky 可能是 OpenAI 去年做得最值的一笔交易。", [
        t("The Codex acquisition might have been one of the best deals OpenAI made last year."),
      ]),
      sentence("sx-2", "我从 2022 年就在等真正的 computer use。", [
        t("I've been waiting for real "),
        w("computer use", "computer use", "计算机代理能力"),
        t(" since 2022."),
      ]),
    ],
  },
  {
    id: "x-karpathy-software-asymptote",
    type: "x",
    title: {
      en: "Software's Asymptote",
      zh: "软件工程的渐近线",
    },
    source: {
      name: "Andrej Karpathy",
      subtitle: "@karpathy · Apr 18, 2026",
    },
    stats: {
      readMinutes: 4,
      level: "C1",
      newWords: 9,
      likes: 412,
      replies: 31,
      reposts: 49,
    },
    quote: "The asymptote of software is a person typing English into a keyboard.",
    cover: {
      label: "AK",
      from: "#7c2d12",
      to: "#f97316",
    },
    sourceUrl: "https://example.com/karpathy-asymptote",
    sentences: [
      sentence("ak-1", "软件工程的渐近线，是一个人往键盘里敲英语。", [
        t("The "),
        w("asymptote", "asymptote", "渐近线", "/ˈæs.ɪmˌtoʊt/"),
        t(" of software engineering is a person typing English into a keyboard."),
      ]),
      sentence("ak-2", "我们现在在训练更好的编译器，也在训练更好的提示词。", [
        t("We are training better compilers, but we are also training better prompts."),
      ]),
    ],
  },
  {
    id: "blog-anthropic-model-context-protocol",
    type: "blog",
    title: {
      en: "Model Context Protocol",
      zh: "模型上下文协议",
    },
    source: {
      name: "Anthropic Engineering",
      subtitle: "Apr 16, 2026 · product note",
    },
    stats: {
      readMinutes: 14,
      level: "B2",
      newWords: 13,
    },
    quote: "Context should be portable, inspectable, and explicit.",
    cover: {
      label: "MCP",
      from: "#1d4ed8",
      to: "#93c5fd",
    },
    sourceUrl: "https://example.com/anthropic-mcp",
    sentences: [
      sentence("mcp-1", "上下文应该可以迁移、可检查，而且显式存在。", [
        t("Context should be "),
        w("portable", "portable", "可迁移的", "/ˈpɔːr.t̬ə.bəl/"),
        t(", inspectable, and explicit."),
      ]),
      sentence("mcp-2", "当工具接口清楚时，代理就不必每次都重新学习世界。", [
        t("When tool interfaces are clear, agents do not have to relearn the world each run."),
      ]),
      sentence("mcp-3", "协议本身就是一种产品决策。", [
        t("The "),
        w("protocol", "protocol", "协议", "/ˈproʊ.tə.kɑːl/"),
        t(" is also a product decision."),
      ]),
    ],
  },
  {
    id: "blog-openai-small-team-speed",
    type: "blog",
    title: {
      en: "Small Teams, Fast Loops",
      zh: "小团队，快循环",
    },
    source: {
      name: "Builder Notes",
      subtitle: "Apr 12, 2026 · operating memo",
    },
    stats: {
      readMinutes: 11,
      level: "B1",
      newWords: 8,
    },
    quote: "Fast feedback lets a tiny team feel improbably large.",
    cover: {
      label: "FN",
      from: "#4338ca",
      to: "#a78bfa",
    },
    sourceUrl: "https://example.com/small-team-speed",
    sentences: [
      sentence("fn-1", "快速反馈会让一个很小的团队显得异常强大。", [
        t("Fast "),
        w("feedback", "feedback", "反馈", "/ˈfiːd.bæk/"),
        t(" lets a tiny team feel improbably large."),
      ]),
      sentence("fn-2", "最难复制的不是创意，而是节奏。", [
        t("What is hardest to copy is not the idea, it is the cadence."),
      ]),
    ],
  },
];

const vocabularySnapshot: VocabularySnapshot = {
  totalWords: 842,
  reviewQueue: 9,
  weeklyAdds: 21,
  entries: [
    {
      lemma: "agentic",
      ipa: "/eɪˈdʒen.tɪk/",
      pos: "adj.",
      translation: "代理式的；能动的",
      source: "No Priors · Apr 9",
      speaker: "Jeremy Allaire",
      quote: "What gets interesting is when agentic finance starts to feel like a global team of assistants.",
      quoteZh: "真正让人兴奋的是，代理金融开始像一支全球助理团队。",
      tags: ["ai", "automation"],
      bucket: "today",
      nextReview: "Tomorrow",
      stage: 1,
      seenCount: 1,
    },
    {
      lemma: "stablecoin",
      ipa: "/ˈsteɪ.bəl.kɔɪn/",
      pos: "n.",
      translation: "稳定币",
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
      lemma: "asymptote",
      ipa: "/ˈæs.ɪmˌtoʊt/",
      pos: "n.",
      translation: "渐近线",
      source: "@karpathy · Apr 18",
      speaker: "Andrej Karpathy",
      quote: "The asymptote of software engineering is a person typing English into a keyboard.",
      quoteZh: "软件工程的渐近线，是一个人往键盘里敲英语。",
      tags: ["math", "engineering"],
      bucket: "thisWeek",
      nextReview: "Tonight",
      stage: 0,
      seenCount: 0,
    },
    {
      lemma: "portable",
      ipa: "/ˈpɔːr.t̬ə.bəl/",
      pos: "adj.",
      translation: "可迁移的",
      source: "Anthropic Engineering · Apr 16",
      speaker: "Anthropic",
      quote: "Context should be portable, inspectable, and explicit.",
      quoteZh: "上下文应该可以迁移、可检查，而且显式存在。",
      tags: ["protocol", "tools"],
      bucket: "all",
      nextReview: "Learned",
      stage: 5,
      seenCount: 6,
    },
  ],
};

const profileSummary: ProfileSummary = {
  streakDays: 28,
  totalWords: 842,
  totalArticles: 63,
  totalMinutes: 913,
  spotlight: "AI builders are becoming the best English teachers in your feed.",
  recentActivity: Array.from({ length: 14 }, (_, index) => {
    const date = new Date("2026-04-22T00:00:00.000Z");
    date.setUTCDate(date.getUTCDate() - (13 - index));

    return {
      date: date.toISOString().slice(0, 10),
      minutes: [0, 12, 18, 24, 8, 0, 31, 16, 22, 27, 14, 0, 19, 26][index] ?? 0,
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
    dateLabel: "Tue, Apr 22, 2026",
    hero: {
      title: "Twelve new things the AI builders said out loud today.",
      subtitle: "跟着 AI 建造者读原声、原推文和原博客，把行业动态直接变成英语输入。",
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
    featuredArticle: sections.podcast[0],
  };
};

export const getReaderArticle = (
  type: ArticleType,
  id: string,
): ReaderArticle | undefined =>
  readerArticles.find((article) => article.type === type && article.id === id);

export const getAllReaderRoutes = (): Array<Pick<ArticlePreview, "id" | "type">> =>
  readerArticles.map((article) => ({ id: article.id, type: article.type }));

export const getFeaturedReaderHref = (): string => {
  const featuredArticle = getDailyDigest().featuredArticle;
  return `/read/${featuredArticle.type}/${featuredArticle.id}`;
};

export const getVocabularySnapshot = (): VocabularySnapshot => vocabularySnapshot;

export const getProfileSummary = (): ProfileSummary => profileSummary;
