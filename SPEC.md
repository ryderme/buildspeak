# BuildSpeak —— 产品与交互说明（v0.1）

> 跟 AI 建造者学英语。每日精选 AI 一线人物的播客、推文和博客原文，中英对照，点词查音标，一键朗读。

---

## 一、产品定位

**一句话定位：** 把每天发生在 AI 圈的真实英文表达变成你的学习素材。

**差异化：**
- 素材是 Karpathy、Sam Altman、Guillermo Rauch 等一线 AI 人物的**真实原声/原文**，不是教材里的塑料英语
- 内容本身就是你感兴趣的（AI 进展、产品思考），学习动机天然成立
- 对标 Readwise Reader + Duolingo 的杂交——"有用的内容 + 顺便学英语"

**目标用户：**
- 中国的技术从业者 / AI 爱好者
- 英语水平 CET-4 以上，能读懂但不够流利
- 日更 10–20 分钟的学习意愿
- 关心 AI 行业动态

---

## 二、数据源（已有）

项目已有三个日更 JSON feed：

| Feed | 内容 | 结构特点 |
|---|---|---|
| `feed-podcasts.json` | 6 档 AI 播客的最新集转录 | 按 `Speaker N \| 00:05 - 00:19` 切好的对话 |
| `feed-x.json` | 25 个 AI 建造者的最新推文 | 短文本（推文）+ 作者 + 点赞数 |
| `feed-blogs.json` | Anthropic / Claude 官方博客 | 长文（几千词） |

---

## 三、核心功能（MVP）

### 1. 每日 Digest 主页
呈现今天（或用户选择的某一天）的全部内容，三个 Tab 切换：

- **Podcasts**：播客卡片列表，显示 cover、标题、时长估算、speaker 数、核心金句
- **X Posts**：推文卡片（Twitter 风格），按人分组
- **Blogs**：博客文章卡片，显示封面词、预估阅读时间、难度标签（A2/B1/B2/C1）

每张卡片右上角显示 **"⚡ 12 新词"** 提示（基于用户生词本反向计算）。

### 2. 双语阅读器（核心功能）

这是用户花时间最多的页面，需要做到像样。

#### 布局模式（顶部 toggle 切换）
- **并排模式**（桌面默认）：左英文、右中文
- **上下模式**（移动默认）：英文句 → 下面灰色小字中文
- **纯英文模式**：只显示英文，中文默认隐藏，hover/tap 句子才浮现

#### 交互细节

**单词级：**
- 点击任意英文单词 → 浮出气泡卡片：
  ```
  ┌─────────────────────────────────┐
  │ agentic       /eɪˈdʒɛntɪk/   🔊 │
  │ adj. 能动的；自主决策的          │
  │ ─────────────────────────────── │
  │ In the agentic economy...       │
  │ 在自主代理经济中...              │
  │                                 │
  │ [⭐ 加入生词本]  [🎧 只读这个词]  │
  └─────────────────────────────────┘
  ```
- 生词（用户已加入生词本的词）在正文里**黄色底高亮**
- 高频词（the/a/is 等 500 词）永不可点，避免干扰

**句子级：**
- 鼠标悬停英文句 → 右侧浮出 🔊 图标
- 点击 🔊 → 单句朗读，该句用 **柔和蓝色下划线** 高亮伴随朗读进度
- 支持键盘快捷键：`Space` 暂停/播放、`→` 下一句、`←` 上一句、`J/K` 调速

**段落级：**
- 阅读器顶部有固定的**播放条**：
  ```
  ▶ 2:34 / 12:08   ━━━━●━━━━━━━━━━━    1.0×  [ 连播 ] [ 跟读模式 ]
  ```
- "跟读模式"：播放一句 → 暂停 2 秒 → 提示用户跟读 → 继续下一句

**特殊内容处理：**
- **播客**：显示 `Speaker 1` / `Speaker 2` 气泡气色区分，时间戳可点击跳转原视频
- **推文**：Twitter 风格卡片，保留头像、handle、点赞数，引用推文嵌套展示
- **博客**：支持折叠章节、目录侧栏、阅读进度条

### 3. 生词本

- 按"今日新增 / 本周 / 全部"分组
- 每个词卡片展示：单词、音标、释义、**出处原句 + 来源链接**（这是差异化——不是孤立背词，是带上下文背词）
- 支持导出 Anki / CSV
- 简单的间隔重复：今日复习队列（SM-2 算法）

### 4. 个人中心 / 打卡

- 日历热力图（像 GitHub contribution）显示每日学习分钟数
- 总词汇量、总阅读量、连续打卡天数
- 设置：朗读语速、朗读口音（US/UK）、字号、主题

---

## 四、页面路由结构

```
/                    今日 Digest 主页（Tab：Podcasts | X | Blogs）
/archive             历史归档（日期选择器 + 卡片墙）
/read/:type/:id      阅读器详情页（type = podcast/x/blog）
/vocab               生词本
/vocab/review        今日复习
/me                  个人中心
/settings            设置
```

---

## 五、视觉风格

**整体气质：** 克制、安静、可长时间阅读。像 Readwise Reader 或 Matter，不像 Duolingo。

**配色：**
- 背景：`#FAFAF7`（米白，护眼）
- 正文：`#1A1A1A`
- 次要文字：`#6B6B6B`
- 强调色：`#2F6FEB`（柔和蓝，用于朗读进度、链接、按钮）
- 高亮色：`#FFF3B0`（生词底色）
- 暗色主题：`#15151A` 背景 + `#E8E8E6` 正文

**字体：**
- 英文正文：`Source Serif Pro` 或 `New York`（衬线，长文阅读友好）
- 英文 UI：`Inter`
- 中文：`思源黑体` / `PingFang SC`
- 音标：`IPA Sans` 或 `Charis SIL`（专门的 IPA 字体）

**排版：**
- 正文宽度：最大 `680px`，阅读舒适
- 行高：`1.75`
- 段落间距：`1.5em`
- 英文字号：`18px`，中文注释字号：`15px`（略小、灰色）

**组件风格参考：** shadcn/ui + 少量自定义（和 Claude Design 的输出天然契合）

---

## 六、关键页面的内容示例（给 Design 渲染用）

### 首页卡片示例（Podcast）

```
┌────────────────────────────────────────────────┐
│ 🎙 No Priors  ·  Apr 9, 2026  ·  ~52 min       │
│                                                │
│ The Agentic Economy: How AI Agents Will        │
│ Transform the Financial System                 │
│ 代理经济：AI 代理如何重塑金融系统              │
│                                                │
│ with Jeremy Allaire (Circle CEO)              │
│                                                │
│ 💬 "Stablecoins are the native money layer    │
│     of the internet."                          │
│                                                │
│ ⚡ 18 新词   📖 预估阅读 22 min   Lv. B2       │
│                                                │
│         [ 开始阅读 →  ]                        │
└────────────────────────────────────────────────┘
```

### 阅读器句子示例（并排模式）

```
Speaker 2 · 01:16                                          🔊

The other idea that we were really          我们当时还有一个非常兴奋的
excited about back then was creating        想法，就是在互联网上创建一种
a protocol for dollars on the internet.     美元协议。

⚡ protocol     /ˈproʊtəkɒl/   协议
```

（"protocol" 有生词高亮底色，鼠标悬停出单词卡）

### 单词卡示例

```
┌────────────────────────────────────────────┐
│  stablecoin          /ˈsteɪ.bəl.kɔɪn/   🔊 │
│  ────────────────────────────────────────  │
│  n. 稳定币                                  │
│  一种价值与美元等法币挂钩的加密货币          │
│                                            │
│  📌 出现在：                                │
│  "Stablecoins are the native money layer   │
│   of the internet."                        │
│  — Jeremy Allaire, No Priors               │
│                                            │
│  [⭐ 加入生词本]  [🎧 朗读]  [🔗 去原文]     │
└────────────────────────────────────────────┘
```

### X 推文阅读卡示例

```
┌──────────────────────────────────────────┐
│ 👤 Swyx  @swyx  ·  Apr 20                │
│                                          │
│ the Codex x @skybysoftware acquisition   │
│ may have been one of the best @openai    │
│ deals made in the last year.             │
│                                          │
│ Codex 收购 Sky 可能是 OpenAI 去年做的    │
│ 最好的交易之一。                          │
│                                          │
│ I've been waiting for "real" computer    │
│ use since...                             │
│                                          │
│ ❤ 93   🔁 4   💬 17                      │
│                                          │
│   [ 🔊 整条朗读 ]  [ ⭐ 学完 ]            │
└──────────────────────────────────────────┘
```

### 生词本列表

```
今日新增 (7)

┌─────────────────────────────────────────────┐
│ ⚡ agentic      /eɪˈdʒɛntɪk/           🔊   │
│    adj. 能动的；自主决策的                   │
│    来自 · No Priors · Apr 9                  │
│    "In the agentic economy, AI agents..."   │
│                        [下一次复习：明天]    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⚡ stablecoin   /ˈsteɪbəlkɔɪn/         🔊   │
│    n. 稳定币                                 │
│    来自 · No Priors · Apr 9                  │
│    "Stablecoins are the native money..."    │
│                        [下一次复习：3 天后]  │
└─────────────────────────────────────────────┘
```

---

## 七、技术选型（仅作参考，不强制）

- **框架：** Next.js 15 App Router（静态导出到 Vercel / GitHub Pages）
- **UI：** Tailwind + shadcn/ui
- **数据：** 直接消费 `follow-builders` 仓库产出的三个 feed JSON（build-time fetch）
- **音标：** CMU Pronouncing Dict（本地化，~13 万词），生僻词走 Wiktionary API 兜底
- **翻译：** 构建时调用 Claude API（`prompts/translate.md` 已有）生成中文，缓存到 JSON
- **朗读：**
  - MVP：浏览器 Web Speech API（零成本、即时）
  - V2：ElevenLabs / Azure TTS 预生成音频（音质好）
- **用户数据：** 生词本、打卡记录存 localStorage（MVP 不做登录）→ V2 再接 Supabase

---

## 八、MVP 范围（交给 Claude Design 的重点）

请先渲染以下 **4 个页面**：

1. **首页** — 三 Tab 卡片墙（播客 / X / 博客），带日期切换
2. **阅读器** — 并排中英 + 单词卡悬浮 + 顶部播放条（**最核心**）
3. **生词本** — 卡片列表，带音标、原句上下文
4. **个人中心** — 日历热力图 + 统计数字

暂不渲染：设置页、历史归档页、登录页。

---

## 九、命名与语气

- 产品名：**BuildSpeak**
- Slogan 候选：
  - "Learn English from the people building AI."
  - "跟着 AI 建造者，学真英语。"
  - "Real voices. Real words. Real progress."

- 语气：专业、克制、略带极客感。**拒绝**"学英语好简单！"式的兴奋语气。
