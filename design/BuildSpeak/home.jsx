// Home — daily digest: 3 tabs (Podcasts / X / Blogs)

function BSAppHeader({ theme, active = 'home', onNav }) {
  const tabs = [
    { id: 'home', label: 'Today', icon: BSIcons.dot },
    { id: 'reader', label: 'Reader', icon: BSIcons.book },
    { id: 'vocab', label: 'Vocabulary', icon: BSIcons.bolt },
    { id: 'profile', label: 'Profile', icon: BSIcons.cal },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      padding: '14px 40px', gap: 28,
      borderBottom: `1px solid ${theme.border}`,
      background: theme.bg, position: 'sticky', top: 0, zIndex: 5,
    }}>
      {/* wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: theme.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BS_FONTS.serif, fontSize: 14, fontWeight: 600, fontStyle: 'italic',
        }}>B</div>
        <div style={{
          fontFamily: BS_FONTS.serif, fontSize: 18, fontWeight: 600,
          color: theme.fg, letterSpacing: -0.2,
        }}>BuildSpeak</div>
      </div>

      <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNav && onNav(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 11px', borderRadius: 8,
            fontFamily: BS_FONTS.sans, fontSize: 13,
            color: active === t.id ? theme.fg : theme.fgMuted,
            fontWeight: active === t.id ? 600 : 500,
            background: active === t.id ? theme.chipBg : 'transparent',
          }}>
            <span style={{ opacity: 0.8 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: 240, height: 32, padding: '0 12px',
        background: theme.panel, border: `1px solid ${theme.border}`,
        borderRadius: 8, color: theme.fgMuted,
        fontFamily: BS_FONTS.sans, fontSize: 12,
      }}>
        {BSIcons.search}
        <span style={{ flex: 1 }}>Search across today's digest</span>
        <BSKbd theme={theme}>⌘K</BSKbd>
      </div>

      {/* streak */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: 8,
        background: theme.panel, border: `1px solid ${theme.border}`,
        fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fg,
      }}>
        <span style={{ color: '#E26B3C' }}>{BSIcons.flame}</span>
        <span style={{ fontWeight: 600 }}>{BS_DATA.streak}</span>
        <span style={{ color: theme.fgMuted }}>day streak</span>
      </div>
    </header>
  );
}

function BSDigestHero({ theme }) {
  const pct = Math.min(1, BS_DATA.todayMins / BS_DATA.todayGoal);
  return (
    <section style={{ padding: '36px 40px 12px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: BS_FONTS.mono, fontSize: 11, letterSpacing: 1.5,
            color: theme.fgMuted, textTransform: 'uppercase', marginBottom: 8,
          }}>Daily digest · {BS_DATA.today}</div>
          <h1 style={{
            margin: 0, fontFamily: BS_FONTS.serif, fontWeight: 500,
            fontSize: 44, lineHeight: 1.1, color: theme.fg, letterSpacing: -0.8,
          }}>
            Twelve new things the AI builders{' '}
            <span style={{ fontStyle: 'italic', color: theme.accent }}>said out loud</span>{' '}
            today.
          </h1>
          <div style={{
            marginTop: 12, fontFamily: BS_FONTS.cjk, fontSize: 15,
            color: theme.fgMuted, lineHeight: 1.6,
          }}>
            今天 AI 建造者们亲口说出的十二件事 · 4 podcasts, 25 tweets, 2 blog posts
          </div>
        </div>
        <div style={{
          width: 240, padding: 16,
          background: theme.panel, border: `1px solid ${theme.border}`,
          borderRadius: 12, boxShadow: theme.shadow,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: BS_FONTS.sans, fontSize: 11, color: theme.fgMuted,
            textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
          }}>
            <span>Today's reading</span>
            <span>{BS_DATA.todayMins}/{BS_DATA.todayGoal}m</span>
          </div>
          <div style={{
            height: 6, background: theme.chipBg, borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{ width: `${pct*100}%`, height: '100%', background: theme.accent }} />
          </div>
          <div style={{
            display: 'flex', gap: 14, marginTop: 14,
            fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fg,
          }}>
            <div><b style={{ fontFamily: BS_FONTS.serif, fontSize: 20 }}>{BS_DATA.wordsToday}</b>
              <div style={{ fontSize: 10.5, color: theme.fgMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>new words</div>
            </div>
            <div><b style={{ fontFamily: BS_FONTS.serif, fontSize: 20 }}>{BS_DATA.readToday}</b>
              <div style={{ fontSize: 10.5, color: theme.fgMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>read</div>
            </div>
            <div><b style={{ fontFamily: BS_FONTS.serif, fontSize: 20 }}>{BS_DATA.reviewQueue}</b>
              <div style={{ fontSize: 10.5, color: theme.fgMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>to review</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BSTabsBar({ theme, active = 'podcasts', onChange }) {
  const tabs = [
    { id: 'podcasts', label: 'Podcasts', count: 4, icon: BSIcons.mic },
    { id: 'x', label: 'X Posts', count: 25, icon: BSIcons.twitter },
    { id: 'blogs', label: 'Blogs', count: 2, icon: BSIcons.book },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      padding: '20px 40px 16px',
      maxWidth: 1120, margin: '0 auto', width: '100%',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px 14px', marginBottom: -17,
            borderBottom: isActive ? `2px solid ${theme.fg}` : '2px solid transparent',
            color: isActive ? theme.fg : theme.fgMuted,
            fontFamily: BS_FONTS.sans, fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1,
          }}>
            <span style={{ opacity: 0.75 }}>{t.icon}</span>
            {t.label}
            <span style={{
              fontFamily: BS_FONTS.mono, fontSize: 11, fontWeight: 400,
              color: isActive ? theme.fgMuted : theme.fgFaint,
            }}>{t.count}</span>
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 8, color: theme.fgMuted }}>
        <button style={bsGhostBtn(theme)}>{BSIcons.filter} All levels</button>
        <button style={bsGhostBtn(theme)}>Unread first</button>
      </div>
    </div>
  );
}

function bsGhostBtn(theme) {
  return {
    background: 'transparent', border: `1px solid ${theme.border}`,
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
    fontFamily: BS_FONTS.sans, fontSize: 11.5, color: theme.fgMuted,
  };
}

// ─── Cards ───
function BSPodcastCard({ theme, data, featured }) {
  return (
    <article style={{
      gridColumn: featured ? 'span 2' : 'span 1',
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: featured ? 22 : 18,
      display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: theme.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: featured ? 64 : 44, height: featured ? 64 : 44, borderRadius: 8,
          background: `linear-gradient(135deg, ${data.coverA}, ${data.coverB})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BS_FONTS.serif, fontSize: featured ? 24 : 16, color: '#fff',
          fontWeight: 700, letterSpacing: -0.5,
        }}>{data.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ opacity: 0.7 }}>{BSIcons.mic}</span>
            <b style={{ color: theme.fg, fontWeight: 600 }}>{data.show}</b>
            <span>·</span><span>{data.when}</span>
          </div>
          <div style={{
            fontFamily: BS_FONTS.sans, fontSize: 11, color: theme.fgFaint, marginTop: 2,
          }}>{data.duration} · {data.speakers} speakers</div>
        </div>
      </div>

      <div>
        <h3 style={{
          margin: 0, fontFamily: BS_FONTS.serif, fontSize: featured ? 24 : 18,
          lineHeight: 1.25, color: theme.fg, fontWeight: 500, letterSpacing: -0.3,
        }}>{data.title}</h3>
        <div style={{
          marginTop: 4, fontFamily: BS_FONTS.cjk, fontSize: featured ? 14 : 13,
          color: theme.fgMuted, lineHeight: 1.5,
        }}>{data.titleZh}</div>
      </div>

      <div style={{
        fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted,
      }}>with <b style={{ color: theme.fg, fontWeight: 500 }}>{data.guest}</b></div>

      <blockquote style={{
        margin: 0, padding: '12px 14px', background: theme.panelAlt,
        borderRadius: 8, borderLeft: `2px solid ${theme.accent}`,
        fontFamily: BS_FONTS.serif, fontSize: featured ? 16 : 14, lineHeight: 1.5,
        color: theme.fg, fontStyle: 'italic',
      }}>
        “{data.pull}”
      </blockquote>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
        <BSChip theme={theme} tone="warn" icon={BSIcons.bolt}>{data.newWords} new words</BSChip>
        <BSChip theme={theme}>{BSIcons.book} {data.readMin} min read</BSChip>
        <BSChip theme={theme} tone="accent">Lv. {data.level}</BSChip>
        <div style={{ flex: 1 }} />
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
          background: theme.fg, color: theme.bg, border: 'none',
          fontFamily: BS_FONTS.sans, fontSize: 12, fontWeight: 600,
        }}>Start reading {BSIcons.arrow}</button>
      </div>
    </article>
  );
}

function BSTweetCard({ theme, data }) {
  return (
    <article style={{
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 12, padding: 16,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `linear-gradient(135deg, ${data.avA}, ${data.avB})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BS_FONTS.sans, fontSize: 13, color: '#fff', fontWeight: 700,
        }}>{data.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: BS_FONTS.sans, fontSize: 13, fontWeight: 600, color: theme.fg }}>{data.name}</div>
          <div style={{ fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted }}>@{data.handle} · {data.when}</div>
        </div>
        <span style={{ color: theme.fgFaint }}>{BSIcons.twitter}</span>
      </div>
      <div style={{
        fontFamily: BS_FONTS.serif, fontSize: 15.5, lineHeight: 1.5, color: theme.fg,
      }}>
        {data.text.map((seg, i) =>
          seg.w ? <span key={i} style={{
            background: theme.highlight, borderRadius: 3, padding: '0 2px',
          }}>{seg.w}</span> : <span key={i}>{seg}</span>
        )}
      </div>
      <div style={{
        fontFamily: BS_FONTS.cjk, fontSize: 13.5, lineHeight: 1.55, color: theme.fgMuted,
      }}>{data.zh}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: BS_FONTS.sans, fontSize: 11.5, color: theme.fgMuted,
        paddingTop: 8, borderTop: `1px solid ${theme.border}`,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{BSIcons.reply} {data.replies}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{BSIcons.repeat} {data.rt}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{BSIcons.heart} {data.likes}</span>
        <div style={{ flex: 1 }} />
        <BSChip theme={theme} tone="warn">{data.newWords} new</BSChip>
      </div>
    </article>
  );
}

function BSBlogStrip({ theme, data }) {
  return (
    <article style={{
      gridColumn: 'span 3',
      display: 'grid', gridTemplateColumns: '260px 1fr',
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 14, overflow: 'hidden', boxShadow: theme.shadow,
    }}>
      {/* cover */}
      <div style={{
        background: data.cover, position: 'relative',
        display: 'flex', alignItems: 'flex-end', padding: 20, minHeight: 180,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.06) 10px 11px)`,
        }} />
        <div style={{
          position: 'relative',
          fontFamily: BS_FONTS.serif, fontStyle: 'italic', fontSize: 56,
          color: 'rgba(255,255,255,0.92)', lineHeight: 0.95, fontWeight: 500,
          letterSpacing: -2,
        }}>{data.coverWord}</div>
      </div>

      {/* body */}
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          fontFamily: BS_FONTS.sans, fontSize: 11, color: theme.fgMuted,
          textTransform: 'uppercase', letterSpacing: 1, display: 'flex', gap: 8,
        }}>
          {BSIcons.book}<b style={{ color: theme.fg, fontWeight: 600, letterSpacing: 1 }}>{data.source}</b>
          <span>·</span><span>{data.when}</span>
        </div>
        <h3 style={{
          margin: 0, fontFamily: BS_FONTS.serif, fontSize: 26,
          lineHeight: 1.2, color: theme.fg, fontWeight: 500, letterSpacing: -0.4,
        }}>{data.title}</h3>
        <div style={{
          fontFamily: BS_FONTS.cjk, fontSize: 14, color: theme.fgMuted, lineHeight: 1.55,
        }}>{data.titleZh}</div>
        <p style={{
          margin: '4px 0 0', fontFamily: BS_FONTS.serif, fontSize: 14.5,
          lineHeight: 1.55, color: theme.fgMuted,
        }}>{data.excerpt}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <BSChip theme={theme} tone="warn" icon={BSIcons.bolt}>{data.newWords} new words</BSChip>
          <BSChip theme={theme}>{BSIcons.book} {data.readMin} min read</BSChip>
          <BSChip theme={theme} tone="accent">Lv. {data.level}</BSChip>
          <div style={{ flex: 1 }} />
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
            background: 'transparent', color: theme.fg,
            border: `1px solid ${theme.borderStrong}`,
            fontFamily: BS_FONTS.sans, fontSize: 12, fontWeight: 500,
          }}>Read {BSIcons.arrow}</button>
        </div>
      </div>
    </article>
  );
}

// ─── Home composition ───
function BSHomeScreen({ theme }) {
  const podcasts = [
    {
      show: 'No Priors', when: 'Apr 9', duration: '~52 min', speakers: 3,
      initials: 'NP', coverA: '#2F6FEB', coverB: '#7A3CE0',
      title: 'The Agentic Economy: How AI Agents Will Transform the Financial System',
      titleZh: '代理经济：AI 代理如何重塑金融系统',
      guest: 'Jeremy Allaire (Circle CEO)',
      pull: 'Stablecoins are the native money layer of the internet.',
      newWords: 18, readMin: 22, level: 'B2',
    },
    {
      show: 'Latent Space', when: 'Apr 8', duration: '~1h 14m', speakers: 2,
      initials: 'LS', coverA: '#E26B3C', coverB: '#D93A75',
      title: 'Shipping Codex: what it takes to ship real computer use',
      titleZh: '把 Codex 做出来：实现真正"计算机使用"需要什么',
      guest: 'Alex Chen (OpenAI)',
      pull: 'The hard part isn\'t the model. It\'s the long tail of clicks.',
      newWords: 12, readMin: 28, level: 'C1',
    },
    {
      show: 'Dwarkesh Podcast', when: 'Apr 8', duration: '~2h 08m', speakers: 2,
      initials: 'DW', coverA: '#111', coverB: '#444',
      title: 'Andrej Karpathy on the next decade of LLMs',
      titleZh: 'Karpathy 谈大模型的下一个十年',
      guest: 'Andrej Karpathy',
      pull: 'Most of the intelligence gap left is in context, not parameters.',
      newWords: 24, readMin: 52, level: 'C1',
    },
    {
      show: 'Lenny\'s Podcast', when: 'Apr 7', duration: '~58 min', speakers: 2,
      initials: 'LP', coverA: '#0E8A5F', coverB: '#146E7A',
      title: 'Guillermo Rauch on building Vercel for the agent era',
      titleZh: 'Guillermo Rauch 谈在"代理时代"打造 Vercel',
      guest: 'Guillermo Rauch (Vercel CEO)',
      pull: 'We stopped building for humans clicking and started building for agents looping.',
      newWords: 9, readMin: 18, level: 'B2',
    },
  ];

  const tweets = [
    {
      name: 'swyx', handle: 'swyx', when: 'Apr 20', initials: 'S',
      avA: '#2F6FEB', avB: '#D93A75',
      text: ['the Codex × ', {w:'acquisition'}, ' of @skybysoftware may have been one of the best @openai deals of the last year.'],
      zh: 'Codex 对 Sky 的收购可能是 OpenAI 去年做的最好的交易之一。',
      replies: 17, rt: 4, likes: 93, newWords: 2,
    },
    {
      name: 'Guillermo Rauch', handle: 'rauchg', when: 'Apr 20', initials: 'G',
      avA: '#111', avB: '#555',
      text: ['we are ', {w:'doubling down'}, ' on AI SDK v5 — streaming tool calls is now a first-class citizen, not a hack.'],
      zh: '我们正加倍投入 AI SDK v5——流式工具调用现在是头等公民，不再是 hack。',
      replies: 42, rt: 78, likes: 612, newWords: 3,
    },
    {
      name: 'Andrej Karpathy', handle: 'karpathy', when: 'Apr 19', initials: 'K',
      avA: '#E26B3C', avB: '#D93A75',
      text: ['the ', {w:'asymptote'}, ' of software engineering is a person typing english into a keyboard. we are converging fast.'],
      zh: '软件工程的渐近线是一个人把英文敲进键盘。我们正在快速逼近。',
      replies: 203, rt: 1100, likes: 8400, newWords: 1,
    },
    {
      name: 'Sam Altman', handle: 'sama', when: 'Apr 18', initials: 'SA',
      avA: '#0E8A5F', avB: '#2F6FEB',
      text: ['we will ', {w:'retrofit'}, ' most of our internal tools with agents this year. productivity gains are real.'],
      zh: '我们今年会给大部分内部工具装上代理。生产力提升是真实可见的。',
      replies: 340, rt: 450, likes: 4200, newWords: 1,
    },
    {
      name: 'Mira Murati', handle: 'miramurati', when: 'Apr 18', initials: 'MM',
      avA: '#7A3CE0', avB: '#2F6FEB',
      text: ['models do not ', {w:'plateau'}, ' — ', {w:'benchmarks'}, ' do. keep your eyes on tasks, not scores.'],
      zh: '模型不会停滞——停滞的是基准。盯着任务，别盯着分数。',
      replies: 96, rt: 240, likes: 1800, newWords: 2,
    },
    {
      name: 'Dario Amodei', handle: 'darioamodei', when: 'Apr 17', initials: 'DA',
      avA: '#D93A75', avB: '#E26B3C',
      text: ['mechanistic ', {w:'interpretability'}, ' has gone from a side quest to a load-bearing pillar of alignment.'],
      zh: '机制可解释性从一个支线任务变成了对齐工作的承重柱。',
      replies: 58, rt: 180, likes: 1240, newWords: 1,
    },
  ];

  const blog = {
    source: 'Anthropic · Engineering',
    when: 'Apr 8, 2026',
    coverWord: 'alignment',
    cover: 'linear-gradient(135deg, #2F6FEB 0%, #7A3CE0 60%, #D93A75 100%)',
    title: 'A field guide to pre-deployment evaluation, six months in',
    titleZh: '部署前评估的实战手册：半年总结',
    excerpt: 'Six months after we began running pre-deployment evaluations at scale, what works, what doesn\'t, and where the scaffolding bends under its own weight...',
    newWords: 34, readMin: 14, level: 'C1',
  };

  return (
    <div style={{
      minHeight: '100%', background: theme.bg, color: theme.fg,
      fontFamily: BS_FONTS.sans,
    }}>
      <BSAppHeader theme={theme} active="home" />
      <BSDigestHero theme={theme} />
      <BSTabsBar theme={theme} active="podcasts" />

      {/* Podcasts grid */}
      <section style={{ padding: '24px 40px 48px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }}>
          <BSPodcastCard theme={theme} data={podcasts[0]} featured />
          <BSPodcastCard theme={theme} data={podcasts[1]} />
          <BSPodcastCard theme={theme} data={podcasts[2]} />
          <BSPodcastCard theme={theme} data={podcasts[3]} />
          <BSBlogStrip theme={theme} data={blog} />
        </div>

        {/* X posts preview strip */}
        <div style={{
          marginTop: 40, paddingTop: 28, borderTop: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
            <h2 style={{
              margin: 0, fontFamily: BS_FONTS.serif, fontSize: 22, fontWeight: 500,
              color: theme.fg, letterSpacing: -0.3,
            }}>Today on X</h2>
            <span style={{ fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted }}>
              25 posts from 17 builders · short, punchy, 3–5 new words each
            </span>
            <div style={{ flex: 1 }} />
            <button style={bsGhostBtn(theme)}>View all {BSIcons.arrow}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {tweets.map((t, i) => <BSTweetCard key={i} theme={theme} data={t} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { BSHomeScreen, BSAppHeader });
