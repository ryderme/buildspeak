import { SiteHeader, SiteFooter } from "@/components/site-header";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page prose">
        <h1>关于 BuildSpeak</h1>
        <p className="zh">每天来自 builders 自己手里的 AI 资讯。</p>
        <p>
          BuildSpeak 是一份每日的 AI builder 文摘，从一份精选名单中抓取 ~25 个 X
          账号、~6 档 YouTube 播客、~2 个 AI 公司官方博客的内容，整理、翻译、排版成一份当天的 issue。
        </p>

        <h2>来源</h2>
        <p>
          内容源由
          <a
            href="https://github.com/zarazhangrui/follow-builders"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            follow-builders{" "}
          </a>
          每日在 GitHub 上公开发布。我们每天读它们，所以你可以选择不读。
        </p>

        <h2>翻译</h2>
        <p>
          每篇文章在 build 阶段段落级翻译成中文（保留人名 / 技术术语 / URL 不译），
          缓存按英文 hash 复用，相同段落永远只翻译一次。
        </p>

        <h2>隐私</h2>
        <p>
          没有登录，没有用户后端。生词本与阅读偏好都只存在你浏览器的 localStorage
          里。我们不知道你是谁。
        </p>

        <h2>设计</h2>
        <p>
          排版灵感来自 Stratechery、Stripe Press 与 Linear changelog。 Source Serif
          4 / Inter / JetBrains Mono / Noto Sans SC。
        </p>

        <h2>源码</h2>
        <p>
          <a
            href="https://github.com/ryderme/buildspeak"
            target="_blank"
            rel="noreferrer"
          >
            github.com/ryderme/buildspeak
          </a>
          ， MIT。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
