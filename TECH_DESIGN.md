# BuildSpeak —— 技术方案（v0.1）

> 配套文档：`SPEC.md`（产品说明）、`design/`（Claude Design 原始稿）
> 面向读者：实现者 / Review 者。读完应能直接开搭脚手架。

---

## 1. 总览

BuildSpeak 是一个**内容驱动的学习工具**，技术上的本质是：

> **一条日更内容管线** + **一个静态优先的阅读器 Web App** + **一层浏览器本地的学习状态**。

关键取舍：
- MVP 不做后端、不做登录、不做用户数据库。所有"内容"在构建期生成为 JSON，所有"用户数据"存浏览器 `localStorage`，降低上线门槛，加快迭代。
- 所有计算密集型任务（翻译、音标补全、分词、生词抽取）放在**构建期**跑一次，运行时只做渲染 + 交互。
- 音频：MVP 用浏览器 `SpeechSynthesis`（零成本 & 零部署），V2 才预生成 TTS。

---

## 2. 架构图

```
 ┌──────────────────────────────────────────────────────────────┐
 │              follow-builders 仓库（已有）                     │
 │  feed-podcasts.json · feed-x.json · feed-blogs.json          │
 └─────────────────────────────┬────────────────────────────────┘
                               │ GitHub raw / git submodule
                               ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                 Content Pipeline（Node 脚本）                 │
 │  ingest → normalize → translate(Claude) → tokenize →         │
 │  ipa(CMU dict) → difficulty → emit content/*.json            │
 └─────────────────────────────┬────────────────────────────────┘
                               │ 写入 apps/web/content/
                               ▼
 ┌──────────────────────────────────────────────────────────────┐
 │               Next.js 15 App Router（SSG）                    │
 │  /  /read/:type/:id  /vocab  /me                             │
 │  纯静态页面 + Server Components 读 content JSON              │
 └─────────────────────────────┬────────────────────────────────┘
                               │ static export
                               ▼
                        Vercel / Cloudflare Pages
                               │
                               ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                        浏览器端                               │
 │  - 交互（点词、播放、跟读）                                   │
 │  - localStorage：生词本、打卡、设置                           │
 │  - SpeechSynthesis：朗读                                     │
 └──────────────────────────────────────────────────────────────┘
```

**关键判断**：内容是推送式（每日 N 条），不是按需拉取；所以用 SSG 而不是 SSR，甚至不需要 DB。

---

## 3. 技术栈

| 层 | 选型 | 原因 |
|---|---|---|
| 框架 | Next.js 15 App Router | SSG 导出、路由好、React Server Components 可直接读 JSON |
| 语言 | TypeScript（strict） | 内容管线 + 前端共用类型 |
| 样式 | Tailwind CSS v4 + CSS vars | Design 的 inline style 直接可迁移 |
| 组件 | shadcn/ui（少量） + 自定义 | 原型本身几乎没复用成熟组件，多数自己搭 |
| 字体 | Source Serif 4 / Inter / Noto Sans SC / JetBrains Mono | 与设计稿一致 |
| 图标 | lucide-react | 原型里 BSIcons 手写 SVG，迁到 lucide |
| 状态 | Zustand（客户端） | 生词本、设置、播放器状态。小巧，比 Redux 合适 |
| 内容管线 | Node + Zod + `@anthropic-ai/sdk` | Schema 校验 + Claude 翻译 |
| 分词 | `compromise` 或 `wink-nlp` | 浏览器/Node 两侧都能跑的英文分词 |
| 音标 | `cmu-pronouncing-dictionary`（npm） + Wiktionary API 兜底 | 13 万词本地库，构建期查 |
| 朗读 MVP | Web Speech API | 零成本 |
| 朗读 V2 | ElevenLabs / Azure TTS | 预生成 mp3 到 R2/Cloudflare |
| 存储 MVP | `localStorage`（Zustand persist） | 无登录 |
| 存储 V2 | Supabase（Postgres + Auth） | 多端同步 |
| 部署 | Vercel | 静态导出，GitHub Pages 亦可 |
| 包管理 | pnpm + Turborepo | 单仓多 package（web + pipeline + types） |

---

## 4. 目录结构

```
buildspeak/
├── SPEC.md
├── TECH_DESIGN.md              ← 本文档
├── design/                     ← Claude Design 原稿（只读）
│
├── apps/
│   └── web/                    ← Next.js 应用
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx                 # /           首页
│       │   ├── read/[type]/[id]/page.tsx # /read/:type/:id
│       │   ├── vocab/page.tsx
│       │   ├── vocab/review/page.tsx
│       │   ├── me/page.tsx
│       │   └── settings/page.tsx
│       ├── components/         # BuildSpeak 组件库（从 design/ 迁移）
│       │   ├── home/
│       │   ├── reader/         # WordCard / PlayerBar / Sentence
│       │   ├── vocab/
│       │   ├── profile/
│       │   └── ui/             # shadcn + atoms
│       ├── lib/
│       │   ├── speech.ts       # Web Speech API 封装
│       │   ├── store/          # Zustand stores
│       │   │   ├── vocab.ts
│       │   │   ├── progress.ts
│       │   │   └── settings.ts
│       │   └── content.ts      # 读取 content/*.json
│       ├── content/            # ← pipeline 写入（构建期生成）
│       │   ├── digest/2026-04-22.json
│       │   ├── articles/podcast-no-priors-ep118.json
│       │   └── ...
│       └── public/
│
├── packages/
│   ├── types/                  # 共享 TS 类型（Article / Word / Digest）
│   ├── pipeline/               # 内容管线 CLI
│   │   ├── src/
│   │   │   ├── cli.ts
│   │   │   ├── ingest.ts       # 拉 follow-builders feed
│   │   │   ├── normalize.ts    # 统一到 Article
│   │   │   ├── translate.ts    # Claude API
│   │   │   ├── tokenize.ts     # 分句 + 分词
│   │   │   ├── ipa.ts          # CMU dict
│   │   │   ├── difficulty.ts   # CEFR 等级估算
│   │   │   └── emit.ts         # 写入 apps/web/content/
│   │   └── prompts/
│   │       ├── translate.md
│   │       └── extract-new-words.md
│   └── ui-tokens/              # 颜色 / 字体 / 间距（迁自 tokens.jsx）
│
├── .github/workflows/
│   └── daily-content.yml       # cron：每天拉 feed + 跑 pipeline + commit content/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 5. 数据模型（核心类型，放 `packages/types`）

> 所有字段来自对 `design/*.jsx` 的反向抽取 + SPEC 示例。

```ts
// 整个产品共享的"一条内容" — 播客/推文/博客的统一抽象
export type ArticleType = 'podcast' | 'tweet' | 'blog';
export type CEFR = 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Article {
  id: string;                    // e.g. "podcast-no-priors-ep118"
  type: ArticleType;
  date: string;                  // ISO date, e.g. "2026-04-09"
  source: {
    name: string;                // "No Priors" / "@karpathy" / "Anthropic · Engineering"
    handle?: string;             // twitter handle
    url: string;                 // 原文链接
    cover?: { gradient?: [string, string]; word?: string };
  };
  title: { en: string; zh: string };
  level: CEFR;
  stats: {
    readMin: number;             // 预估阅读分钟
    newWordsCount: number;       // 对"新手用户"的新词数（基于 COCA 高频表）
    duration?: string;           // 播客：'~52 min'
    likes?: number; rt?: number; replies?: number; // 推文
  };
  pullQuote?: { text: string; speakerId?: string };
  speakers?: Speaker[];          // 播客才有
  sentences: Sentence[];
}

export interface Speaker {
  id: string;                    // 'S1' / 'S2'
  label: string;                 // 'Speaker 1' / 'Jeremy Allaire'
  color: string;                 // hex，从固定 palette 轮换
}

export interface Sentence {
  id: string;                    // ArticleId 内唯一，e.g. "s-0042"
  speakerId?: string;            // 播客才有
  timestamp?: { startMs: number; endMs: number }; // 播客/视频才有
  en: Token[];                   // 分词后的英文
  zh: string;                    // 整句中文翻译（不分词）
}

export type Token =
  | { kind: 'text'; text: string }                  // 空格、标点、不参与学习的高频词
  | { kind: 'word'; surface: string; lemma: string; ipa?: string; pos?: string; isVocab?: boolean };
  // isVocab 只在"用户已加入生词本"时在运行时标记；JSON 里不存

// —— 单词学习卡片需要的数据 ——
export interface WordEntry {
  lemma: string;                 // "stablecoin"
  ipa: string;                   // "/ˈsteɪ.bəl.kɔɪn/"
  pos: string;                   // "n."
  translation: string;           // "稳定币"
  definitionZh: string;          // "一种价值与美元等法币挂钩的加密货币..."
  tags?: string[];
}

// —— 首页 Digest 聚合 ——
export interface Digest {
  date: string;
  counts: { podcasts: number; tweets: number; blogs: number };
  featuredPodcastId: string;     // 首页大卡
  articleIds: string[];          // 按展示顺序
}

// —— 用户本地状态（localStorage） ——
export interface UserVocab {
  lemma: string;
  addedAt: string;
  stage: 0 | 1 | 2 | 3 | 4 | 5;  // SM-2 简化
  seen: number;
  dueAt: string;                 // ISO date
  contexts: Array<{              // 一个词可能出现在多处
    articleId: string;
    sentenceId: string;
    quote: string;               // 冗余存储，脱机也能看
  }>;
}

export interface UserProgress {
  streak: number;                // 连续天数
  lastActiveDate: string;
  dailyMinutes: Record<string, number>; // '2026-04-22' -> 18
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'sepia';
  readerFontSize: number;        // 15..22
  readerLineHeight: number;      // 1.4..2.0
  ttsVoice: 'en-US' | 'en-GB';
  ttsRate: number;               // 0.8..1.5
  readerLayout: 'side' | 'stack' | 'eng';
}
```

> **反馈型字段**（`isVocab` / `due` 等）不是内容事实而是用户事实，运行时由 client store 计算注入，**不进 content JSON**。这避免了"用户加一个词就要重建全站"的陷阱。

---

## 6. 内容管线（`packages/pipeline`）

### 6.1 工作流

```
┌─ ingest.ts      从 follow-builders 拉三个 feed JSON（HTTP 或 git submodule）
├─ normalize.ts   把三种不同结构统一成 Article（最重要的步骤）
├─ translate.ts   对 title + 每个 sentence.en 调 Claude 翻译，Zod 校验结果
├─ tokenize.ts    compromise 分词 + 过滤高频词（COCA top 500 + stopwords）
├─ ipa.ts         对每个 token 查 CMU dict → ARPAbet → IPA
├─ difficulty.ts  CEFR 估算：按词频分位 + 平均句长
└─ emit.ts        写 apps/web/content/{articles,digest}/*.json
```

### 6.2 幂等 & 缓存

- 每个 Article 的**内容哈希**（source url + 原文 MD5）作为缓存 key
- `cache/translations/<hash>.json` 避免重复调 Claude（**成本关键**）
- `cache/ipa.json` 增量写，整个项目只会增长不会回退

### 6.3 自动化

`.github/workflows/daily-content.yml`：

```yaml
on:
  schedule: [{ cron: '0 22 * * *' }]  # 每天 UTC 22:00 ≈ 北京时间 06:00
  workflow_dispatch: {}

jobs:
  build-content:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - pnpm install
      - run: pnpm --filter pipeline cli
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          FOLLOW_BUILDERS_URL: ${{ vars.FOLLOW_BUILDERS_URL }}
      - commit & push content/ → 触发 Vercel 自动部署
```

这样**不需要一台服务器**，内容更新 = git commit。

### 6.4 成本估算

- Claude 翻译：一天 ≈ 3 万 tokens 英文 × 翻译 = 约 $0.5/天（Haiku）或 $2/天（Sonnet）
- 首选 Haiku 4.5，关键字段（术语一致性）补一次 Sonnet

---

## 7. 关键交互实现

### 7.1 点词查卡（最高频交互）

设计稿里 token 已是结构化 `{kind:'word', lemma, ipa}`，所以渲染就是：

```tsx
<Token token={t} onClick={() => openWordCard(t)} isVocab={vocab.has(t.lemma)} />
```

- `openWordCard` 弹出 `<WordCard/>`，内容来自：
  - 内嵌的 `ipa`、`pos`（构建期已有）
  - 译文/定义：**懒加载**。MVP 阶段 content JSON 里已带（翻译时让 Claude 顺便给了）；V2 再做按需查询
  - 出处：就是当前 `sentenceId` + 前后文拼出的 quote
- 存词：调 `useVocabStore().add(lemma, context)`，自动写 localStorage

### 7.2 朗读（MVP）

```ts
// lib/speech.ts
export function speak(text: string, opts: { rate: number; voice: string }) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.voice; u.rate = opts.rate;
  u.onboundary = (e) => progressStore.setOffset(e.charIndex);
  speechSynthesis.speak(u);
}
```

- 句级：绑定 `SpeechSynthesisUtterance.onboundary` 驱动 UI 高亮
- 单词级：直接 `speak(word)`
- 跟读模式：`speak` → `pause 2s` → 提示 UI 录音（浏览器 `MediaRecorder`，先不做评分，V2 接评分 API）

### 7.3 阅读器快捷键

在 `/read/:type/:id` 页面挂一个 `useHotkeys`（react-hotkeys-hook）：

| 键 | 行为 |
|---|---|
| `Space` | play/pause |
| `→` / `←` | 下一句 / 上一句 |
| `J` / `K` | 减速 / 加速（step 0.1） |
| `W` | 把最后激活的 word 加入生词本 |
| `1` / `2` / `3` | 切换 side/stack/eng 布局 |

### 7.4 间隔重复（SM-2 简化版）

```ts
function nextDue(stage: number, correct: boolean): { stage, days } {
  if (!correct) return { stage: Math.max(0, stage - 1), days: 1 };
  const intervals = [1, 2, 4, 7, 14, 30];   // stage 0..5
  const s = Math.min(5, stage + 1);
  return { stage: s, days: intervals[s] };
}
```

Review 页面按 `dueAt <= today` 排序拿 20 个，卡片展示"认识 / 模糊 / 不认识" 三按钮。

### 7.5 热力图

直接用 `UserProgress.dailyMinutes` 映射到 26×7 单元格，5 档阴影（0 分钟 → 30+ 分钟）。Profile 页的实现已基本等价于设计稿里的静态版本，替换 seed 数据为真实 store 数据即可。

---

## 8. API / 数据访问层

**MVP 没有后端 API**。数据访问只有两个方向：

1. **服务端（Next.js）** 读 `content/*.json`：

```ts
// lib/content.ts — 只在 Server Component / generateStaticParams 里调用
export async function getArticle(id: string): Promise<Article> { ... }
export async function getDigest(date: string): Promise<Digest> { ... }
export async function getLatestDigestDate(): Promise<string> { ... }
```

2. **客户端** 读写 `localStorage`：通过 Zustand stores，SSR 下以空对象 hydrate，`useEffect` 里再 hydrate from storage（避免水合不匹配）。

V2 引入 Supabase 时，上面两个函数加一个 `SupabaseClient` 分支即可，调用方无感。

---

## 9. 测试策略

| 层 | 工具 | 重点 |
|---|---|---|
| Pipeline 单元 | Vitest | normalize 的三种输入→同一 Article 形状；翻译结果 Zod 通过 |
| 组件 | Vitest + React Testing Library | WordCard 的 keyboard/pointer 行为、Sentence 高亮状态 |
| E2E | Playwright | 核心路径：打开首页 → 进阅读器 → 点词加入生词本 → 生词本页看到 |
| 视觉 | Playwright screenshot vs design/BuildSpeak.html | 防止迁移时走样 |

覆盖率门槛：pipeline 90%，组件 80%，E2E 只覆盖关键路径。

---

## 10. 部署

- **Vercel**：`apps/web` 作为主项目；`next.config.ts` 配置 `output: 'export'`（或保留 SSR 以便未来加 ISR）
- 域名：`buildspeak.app`（待注册）
- CI：GitHub Actions 里做 `pnpm -r build` + `pnpm -r test`，通过后 Vercel 自动部署
- 内容更新：daily cron workflow → commit `content/` → Vercel 触发 redeploy

---

## 11. 里程碑

| 里程碑 | 范围 | 验收标准 | 预估 |
|---|---|---|---|
| **M0 骨架** | monorepo 初始化、types 包、Next.js 15 空壳、Tailwind + 字体 | `pnpm dev` 可以跑起来空首页 | 0.5 天 |
| **M1 迁移设计** | 把 7 个 JSX 组件迁到 `apps/web/components/`，用**硬编码 mock 数据**跑通 4 个页面 | 视觉与 `design/BuildSpeak.html` 一致 | 1.5 天 |
| **M2 Pipeline v1** | ingest + normalize + translate；一天内容端到端流通；手动触发 | 首页显示真实当天内容 | 2 天 |
| **M3 交互** | 单词卡、朗读、键盘快捷键、Zustand vocab store + localStorage | 能加入生词本、能朗读句子 | 2 天 |
| **M4 Pipeline v2** | IPA、分词、难度、GitHub Actions cron | 每天自动更新内容 | 1 天 |
| **M5 生词本 + 复习** | Vocab 页真实数据、SM-2 review 队列、热力图绑定真实数据 | 一个完整的"读→存→复习"闭环 | 1.5 天 |
| **M6 打磨** | 暗色/护眼主题、设置页、导出 Anki、移动端适配 | 手机上能用 | 2 天 |
| **V2** | 预生成 TTS、Supabase 多端同步、跟读评分 | —— | 后续迭代 |

**MVP 能上线的最小范围是 M0→M5，约 8.5 天。**

---

## 12. 风险与决策记录

| 风险 | 影响 | 应对 |
|---|---|---|
| Claude 翻译成本随文章数增长 | 每日运行成本 | 走 Haiku + 翻译结果永久缓存；术语表人工维护 50 词兜底 |
| follow-builders feed 结构变更 | pipeline 失败 | normalize 层写 Zod schema，feed 不符合立刻在 CI 里 fail、发邮件 |
| 浏览器 TTS 音质差、不同平台口音不一 | 核心功能体验差 | 文案明确"机器朗读"；V2 ASAP 切预生成 |
| localStorage 容量 & 丢失 | 用户数据消失 | 生词本默认支持"导出 JSON/CSV"；大于 500 词时提示注册（为 V2 Supabase 铺路） |
| 生词高亮在点击后渲染卡顿 | 长文阅读体验 | Token 级组件用 `React.memo` + `lemma` 作为 key；`useVocabStore` 只传 `Set<string>` |
| SSG 内容体积膨胀 | 构建慢 | 每篇文章独立 JSON + 路由动态 import；不要在首页打包全文 |

---

## 13. 下一步行动

按顺序（每一步落地后再动下一步）：

1. **确认技术方案**（本文档）
2. **M0**：`pnpm create next-app`、monorepo 骨架、共享 types 包
3. **M1**：从 `design/BuildSpeak/home.jsx` 开始把组件迁到 `components/home/`；用 Tailwind 重写样式（移除 inline）；以 `design/BuildSpeak.html` 作为像素级对比基线
4. 之后按里程碑推进

建议在进入 M1 之前先做一件小事：**锁定 `packages/types` 的初版**，后面前后端两侧的开发就有共同合约了。
