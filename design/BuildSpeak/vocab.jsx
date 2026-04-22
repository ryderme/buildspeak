// Vocab — notebook with today/week/all groups + review queue

function BSVocabStatTile({ theme, label, value, sub, accent }) {
  return (
    <div style={{
      flex: 1, padding: '16px 18px',
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 12,
    }}>
      <div style={{
        fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
        textTransform: 'uppercase', letterSpacing: 1,
      }}>{label}</div>
      <div style={{
        fontFamily: BS_FONTS.serif, fontSize: 32, fontWeight: 500,
        color: accent || theme.fg, letterSpacing: -0.8, lineHeight: 1.1,
        marginTop: 4,
      }}>{value}</div>
      <div style={{
        fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted, marginTop: 2,
      }}>{sub}</div>
    </div>
  );
}

function BSVocabEntry({ theme, w }) {
  const dueColors = {
    today: { bg: theme.highlight, fg: theme.fg },
    tomorrow: { bg: theme.accentFaint, fg: theme.accent },
    later: { bg: theme.chipBg, fg: theme.fgMuted },
    learned: { bg: 'rgba(14,138,95,0.10)', fg: theme.good },
  };
  const dc = dueColors[w.due] || dueColors.later;

  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 160px',
      alignItems: 'start', gap: 24,
      padding: '20px 24px',
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 12,
    }}>
      {/* Headword */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{
            fontFamily: BS_FONTS.serif, fontSize: 24, fontWeight: 500,
            color: theme.fg, letterSpacing: -0.4,
          }}>{w.word}</div>
          <button style={{
            width: 22, height: 22, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'transparent', color: theme.fgMuted,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{BSIcons.speaker}</button>
        </div>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 12, color: theme.fgMuted, marginTop: 2,
        }}>{w.ipa}</div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6,
        }}>
          <span style={{
            fontFamily: BS_FONTS.serif, fontSize: 11.5, fontStyle: 'italic',
            color: theme.fgMuted,
          }}>{w.pos}</span>
          <span style={{ fontFamily: BS_FONTS.cjk, fontSize: 13.5, color: theme.fg }}>{w.zh}</span>
        </div>
        <div style={{
          marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          {w.tags && w.tags.map(t => (
            <span key={t} style={{
              fontFamily: BS_FONTS.mono, fontSize: 10, padding: '2px 6px',
              borderRadius: 4, background: theme.chipBg, color: theme.fgMuted,
              letterSpacing: 0.3,
            }}>#{t}</span>
          ))}
        </div>
      </div>

      {/* Context */}
      <div style={{ borderLeft: `1px solid ${theme.border}`, paddingLeft: 24 }}>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 10, color: theme.fgMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {w.srcIcon} <span>From · {w.src}</span>
        </div>
        <blockquote style={{
          margin: 0, fontFamily: BS_FONTS.serif, fontSize: 14.5, lineHeight: 1.55,
          color: theme.fg, fontStyle: 'italic',
        }}>
          “{w.quote.map((seg, i) =>
            typeof seg === 'string'
              ? seg
              : <mark key={i} style={{ background: theme.highlightStrong, padding: '0 2px' }}>{seg.w}</mark>
          )}”
        </blockquote>
        <div style={{
          fontFamily: BS_FONTS.sans, fontSize: 11.5, color: theme.fgMuted, marginTop: 4,
        }}>— {w.speaker}</div>
        <div style={{
          marginTop: 8, fontFamily: BS_FONTS.cjk, fontSize: 12.5, color: theme.fgMuted, lineHeight: 1.55,
        }}>{w.quoteZh}</div>
      </div>

      {/* Review meta */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 8px', borderRadius: 999,
          background: dc.bg, color: dc.fg,
          fontFamily: BS_FONTS.sans, fontSize: 11, fontWeight: 600,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: dc.fg,
          }} />
          Next: {w.nextLabel}
        </div>

        {/* SR progress dots */}
        <div style={{ display: 'flex', gap: 3 }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} style={{
              width: 8, height: 8, borderRadius: 2,
              background: i < w.stage ? theme.accent : theme.chipBg,
              border: `1px solid ${theme.border}`,
            }} />
          ))}
        </div>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgFaint, letterSpacing: 0.5,
        }}>Seen {w.seen}× · Added {w.added}</div>

        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button style={{
            width: 26, height: 26, borderRadius: 6, border: `1px solid ${theme.border}`,
            background: 'transparent', color: theme.fgMuted, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{BSIcons.starFill}</button>
          <button style={{
            width: 26, height: 26, borderRadius: 6, border: `1px solid ${theme.border}`,
            background: 'transparent', color: theme.fgMuted, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{BSIcons.link}</button>
        </div>
      </div>
    </article>
  );
}

function BSVocabScreen({ theme }) {
  const entries = [
    {
      word: 'agentic', ipa: '/eɪˈdʒɛntɪk/', pos: 'adj.',
      zh: '能动的；自主决策的',
      src: 'No Priors · Apr 9', srcIcon: BSIcons.mic,
      speaker: 'Jeremy Allaire',
      quote: ['In the ', {w:'agentic'}, ' economy, AI agents move capital at the speed of thought.'],
      quoteZh: '在代理经济中，AI 代理以思考的速度转移资本。',
      due: 'tomorrow', nextLabel: 'tomorrow', stage: 1, seen: 1, added: 'today', tags: ['ai', 'econ'],
    },
    {
      word: 'stablecoin', ipa: '/ˈsteɪ.bəl.kɔɪn/', pos: 'n.',
      zh: '稳定币',
      src: 'No Priors · Apr 9', srcIcon: BSIcons.mic,
      speaker: 'Jeremy Allaire',
      quote: [{w:'Stablecoins'}, ' are the native money layer of the internet.'],
      quoteZh: '稳定币是互联网原生的货币层。',
      due: 'later', nextLabel: 'in 3 days', stage: 2, seen: 3, added: 'today', tags: ['crypto'],
    },
    {
      word: 'asymptote', ipa: '/ˈæsɪmptoʊt/', pos: 'n.',
      zh: '渐近线；极限趋向',
      src: '@karpathy · Apr 19', srcIcon: BSIcons.twitter,
      speaker: 'Andrej Karpathy',
      quote: ['the ', {w:'asymptote'}, ' of software engineering is a person typing english into a keyboard.'],
      quoteZh: '软件工程的渐近线是一个人把英文敲进键盘。',
      due: 'today', nextLabel: 'today', stage: 0, seen: 0, added: 'today', tags: ['math'],
    },
    {
      word: 'retrofit', ipa: '/ˈrɛtroʊfɪt/', pos: 'v.',
      zh: '改装；后加装',
      src: '@sama · Apr 18', srcIcon: BSIcons.twitter,
      speaker: 'Sam Altman',
      quote: ['we will ', {w:'retrofit'}, ' most of our internal tools with agents this year.'],
      quoteZh: '我们今年会给大部分内部工具装上代理。',
      due: 'tomorrow', nextLabel: 'tomorrow', stage: 1, seen: 1, added: 'yesterday', tags: ['work'],
    },
    {
      word: 'interpretability', ipa: '/ɪnˌtɜːprətəˈbɪləti/', pos: 'n.',
      zh: '可解释性',
      src: '@darioamodei · Apr 17', srcIcon: BSIcons.twitter,
      speaker: 'Dario Amodei',
      quote: ['mechanistic ', {w:'interpretability'}, ' has gone from a side quest to a load-bearing pillar of alignment.'],
      quoteZh: '机制可解释性从支线任务变成了对齐的承重柱。',
      due: 'later', nextLabel: 'in 6 days', stage: 3, seen: 4, added: '3 days ago', tags: ['safety'],
    },
    {
      word: 'plateau', ipa: '/plæˈtoʊ/', pos: 'v.',
      zh: '停滞；进入高原期',
      src: '@miramurati · Apr 18', srcIcon: BSIcons.twitter,
      speaker: 'Mira Murati',
      quote: ['models do not ', {w:'plateau'}, ' — benchmarks do.'],
      quoteZh: '模型不会停滞——停滞的是基准。',
      due: 'learned', nextLabel: 'learned ✓', stage: 5, seen: 6, added: '2 weeks ago', tags: ['ml'],
    },
  ];

  return (
    <div style={{ minHeight: '100%', background: theme.bg, color: theme.fg }}>
      <BSAppHeader theme={theme} active="vocab" />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 40px 60px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: BS_FONTS.mono, fontSize: 11, color: theme.fgMuted,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
            }}>Notebook</div>
            <h1 style={{
              margin: 0, fontFamily: BS_FONTS.serif, fontSize: 40, fontWeight: 500,
              color: theme.fg, letterSpacing: -0.7, lineHeight: 1.1,
            }}>Your vocabulary, <span style={{ fontStyle: 'italic', color: theme.accent }}>in context</span>.</h1>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
            background: theme.accent, color: '#fff', border: 'none',
            fontFamily: BS_FONTS.sans, fontSize: 13, fontWeight: 600,
            boxShadow: theme.shadow,
          }}>
            {BSIcons.bolt} Review 9 due today {BSIcons.arrow}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          <BSVocabStatTile theme={theme} label="Total saved" value="842" sub="across 93 reading sessions" />
          <BSVocabStatTile theme={theme} label="Added this week" value="31" sub="+7 today" />
          <BSVocabStatTile theme={theme} label="Due for review" value="9" sub="3 overdue · 6 today" accent={theme.accent} />
          <BSVocabStatTile theme={theme} label="Retention" value="86%" sub="last 30 days" accent={theme.good} />
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        }}>
          <div style={{
            display: 'inline-flex', padding: 3, borderRadius: 8,
            background: theme.chipBg, border: `1px solid ${theme.border}`,
          }}>
            {[
              {id:'today', label:'Today', n:7, active:true},
              {id:'week', label:'This week', n:31},
              {id:'all', label:'All', n:842},
              {id:'learned', label:'Learned', n:201},
            ].map(x => (
              <button key={x.id} style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: x.active ? theme.panel : 'transparent',
                color: x.active ? theme.fg : theme.fgMuted,
                fontFamily: BS_FONTS.sans, fontSize: 12, fontWeight: x.active ? 600 : 500,
                boxShadow: x.active ? theme.shadow : 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {x.label}
                <span style={{
                  fontFamily: BS_FONTS.mono, fontSize: 10,
                  color: x.active ? theme.fgMuted : theme.fgFaint,
                }}>{x.n}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button style={bsGhostBtn(theme)}>{BSIcons.filter} All sources</button>
          <button style={bsGhostBtn(theme)}>Sort · Recently added</button>
          <button style={bsGhostBtn(theme)}>{BSIcons.link} Export CSV / Anki</button>
        </div>

        {/* Section heading */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 10,
          marginTop: 22, marginBottom: 12,
        }}>
          <h2 style={{
            margin: 0, fontFamily: BS_FONTS.serif, fontSize: 20, fontWeight: 500,
            color: theme.fg, letterSpacing: -0.3,
          }}>Added today</h2>
          <span style={{
            fontFamily: BS_FONTS.mono, fontSize: 11, color: theme.fgMuted,
          }}>7 words · 3 sources</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map((w, i) => <BSVocabEntry key={i} theme={theme} w={w} />)}
        </div>

        {/* Empty-ish older section cue */}
        <div style={{
          marginTop: 28, padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: 14,
          background: theme.panel, border: `1px dashed ${theme.border}`,
          borderRadius: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: theme.chipBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.fgMuted,
          }}>{BSIcons.cal}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: BS_FONTS.sans, fontSize: 13, fontWeight: 600, color: theme.fg }}>
              Earlier this week · 24 more words
            </div>
            <div style={{ fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted }}>
              From 4 podcasts and 1 blog post. Expand to keep browsing.
            </div>
          </div>
          <button style={bsGhostBtn(theme)}>Expand {BSIcons.arrow}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BSVocabScreen });
