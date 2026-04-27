[English](README.md) | **中文**

# BuildSpeak

> 每天来自 builders 自己手里的 AI 资讯 — 双语对照，点击单词即查。

[**buildspeak.ryderlab.work**](https://buildspeak.ryderlab.work) — 在线访问

BuildSpeak 是一个每日 AI builder 内容阅读站。每天 06:00 UTC，GitHub Actions
定时任务从精选名单（~25 位 X builder + ~6 个播客 + ~2 个官方博客，源自
[follow-builders](https://github.com/zarazhangrui/follow-builders)）抓取最新
内容，在 build 阶段调 LLM 把每段英文翻成中文，输出为静态 Next.js 站点。

主要受众是中文母语、英文为第二语言的科技从业者 —— 你本来就想读这些 builder
说什么。双语对照、句子级 TTS、点单词查词只是顺手的英文学习增益，不是核心卖点。

---

## 站点能力

- **今日刊** — 当天 1 个播客、0–1 个博客、10–17 位 builder 的新动态，按来源分组。
- **双语阅读器** — 段落级英中并排，可切"仅英文 / 仅中文 / 双语"。
- **句子级 TTS** — Web Speech API 朗读，播放时高亮当前句子。空格播放/暂停，← → 切句。
- **点击任意单词** — 浮卡显示 IPA、中文释义、上下文句子、朗读按钮、加入生词本按钮。
- **生词本** — 你保存的所有单词，附原文链接回跳。仅 localStorage，无账号。
- **历史归档** — 月历视图，每个有内容的日期可点进当日全部刊物。
- **Builder 主页** — `/b/<handle>` 聚合该 builder 全部历史推文，按日倒序，支持整站 TTS。

---

## 工作流

```
┌────────────────────────────────────────────────────────────────────┐
│  follow-builders（上游）                                            │
│  每日抓 X / YouTube 转录 / 博客 → 3 个公开 JSON feed                 │
│  github.com/zarazhangrui/follow-builders/main                      │
└──────────────────────────────────┬─────────────────────────────────┘
                                   │ raw.githubusercontent.com
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│  GitHub Actions cron — 每天 06:00 UTC                              │
│   1. pnpm fetch-feed → 合成 digest-YYYYMMDD.json                   │
│   2. pnpm pipeline → 5 步走：                                       │
│        parse → translate → tokenize → enrich → emit                │
│        （新段落调 LLM 翻译；缓存复用历史段落）                          │
│   3. git commit content/* + push                                   │
└──────────────────────────────────┬─────────────────────────────────┘
                                   │ push
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│  Vercel — Next.js 16 静态构建                                       │
│    读 apps/web/content/*.json，预渲染 ~60 页，                       │
│    边缘 CDN 全球分发                                                 │
└────────────────────────────────────────────────────────────────────┘
```

每段翻译按内容 hash 缓存。第二天的运行只翻译"今日新增"的段落（通常几十段），
首次跑通后**每日 LLM 成本约几美分**。

---

## 技术栈

- **Monorepo** — pnpm workspaces + Turborepo
- **Web 端**（`apps/web`）— Next.js 16（App Router、SSG）、React 19、纯 CSS
  设计系统（无 Tailwind），客户端状态用 Zustand + localStorage。
- **Pipeline**（`packages/pipeline`）— TypeScript CLI（`tsx` 直跑）。任意
  OpenAI 兼容的 Chat Completions endpoint 都行（设 `OPENAI_API_BASE_URL`）。
  IPA 来自 CMU Pronouncing Dictionary，中文释义来自同一个 LLM。
- **共享类型**（`packages/types`）— `Article` / `Paragraph` / `Sentence` /
  `Token` / `WordEntry` / `VocabEntry` 单一来源。
- **Analytics** — PostHog 服务端（`posthog-node`）+ 浏览器端（`posthog-js`）。
  采集 pageview、单词点击、加入生词本、TTS 播放、语言切换。
- **CI** — GitHub Actions 跑每日 cron；Vercel 部署。

---

## 自己跑一份

两种方式。

### 只想看？直接访问 demo。

[buildspeak.ryderlab.work](https://buildspeak.ryderlab.work) — 已上线，免费、无需登录。
生词本和阅读状态都只在你自己的浏览器里。

### 部署自己的副本。

```bash
git clone https://github.com/ryderme/buildspeak.git
cd buildspeak
pnpm install
cp .env.example .env
# 填入 OPENAI_API_BASE_URL / OPENAI_API_KEY / OPENAI_MODEL
# 可选：POSTHOG_API_KEY / POSTHOG_HOST + NEXT_PUBLIC_POSTHOG_KEY / HOST

# 拉今日 feed 并处理
pnpm daily          # = pnpm fetch-feed && pnpm pipeline

# 本地预览
pnpm dev            # http://localhost:3000

# 静态构建
pnpm build
```

上线步骤：

1. push 到你自己的 GitHub。
2. 在 [Vercel](https://vercel.com) 导入 — Root Directory 设为 `apps/web`。
3. 填同一组环境变量到 Vercel（`OPENAI_*` 不需要在 Vercel 上，因为 pipeline 在
   Actions 里跑；`NEXT_PUBLIC_POSTHOG_*` 才需要在 Vercel 上）。
4. 把 `OPENAI_*` 和 `POSTHOG_*` 加为 **GitHub repository secrets**，启用
   daily-digest workflow。它每次跑完会 commit 到 `main`，触发 Vercel 自动部署。

---

## 项目结构

```
.
├── apps/web/                 # Next.js 站点
│   ├── app/                  # App Router 路由
│   ├── components/           # 阅读器、浮卡、卡片、布局
│   ├── content/              # pipeline 产物（已 commit）
│   │   ├── articles/*.json   # 每篇文章一份
│   │   ├── digest/*.json     # 每天一份（manifest）
│   │   └── words.json        # 全局词索引（IPA + 中文）
│   ├── lib/                  # content / analytics / vocab
│   └── public/
├── packages/
│   ├── pipeline/             # 每日内容 pipeline
│   │   └── src/
│   │       ├── index.ts      # 编排器
│   │       ├── parse.ts      # 把 raw digest 拆成 Article 雏形
│   │       ├── translate.ts  # 段落级 EN→ZH（LLM）
│   │       ├── tokenize.ts   # 句 / 词分词
│   │       ├── enrich.ts     # IPA + 中文释义
│   │       ├── arpa-to-ipa.ts
│   │       ├── cache.ts      # 翻译/释义缓存
│   │       ├── fetch-feed.ts # 拉 follow-builders 公开 feed
│   │       ├── openai.ts     # Chat Completions client（带重试）
│   │       └── posthog.ts    # 服务端 analytics
│   └── types/                # 共享 TS 类型
├── .github/workflows/
│   └── daily-digest.yml      # cron + commit
├── docs/
│   └── DESIGN_BRIEF.md       # 设计系统说明
└── digest-YYYYMMDD.json      # 原始输入快照（已 commit）
```

---

## Pipeline 配置

`pnpm pipeline` 默认**只跑最新一天**（按文件名排序）。回填或改了 prompt 想重跑：

```bash
pnpm pipeline -- --all   # 全量重处理
```

翻译缓存在 `packages/pipeline/.cache/`，按段落英文的 SHA-256 hash 索引，重跑
完全幂等。仓库不 commit 缓存；CI 用 `actions/cache` 跨次运行复用。

---

## 自定义翻译 prompt

System prompt 在 `packages/pipeline/src/translate.ts`。默认行为：人名 / 公司名
/ 代码 / URL 保留英文，技术术语第一次出现时可加中文括注。改完后 `pnpm daily`
即可看到效果。

换模型只需改 `OPENAI_MODEL`（任何兼容 chat completions 的模型都行）。生产现在
跑在一个 OpenAI 兼容代理 `api.ryderlab.work` 上，但官方 `api.openai.com/v1`
完全等价。

---

## 内容来源致谢

站点内容来自 [@zarazhangrui](https://github.com/zarazhangrui) 维护的
[**follow-builders**](https://github.com/zarazhangrui/follow-builders)。他们
负责 X / YouTube / 博客的抓取，每天发布三个公开 JSON feed 供我们读取。**没有
follow-builders 就没有 BuildSpeak。**

如果你想增删某个 builder / 播客 / 博客，请去上游提，不要在这里改。

---

## 协议

MIT。
