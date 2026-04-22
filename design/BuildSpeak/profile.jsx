// Profile — heatmap + stats + recent activity

function BSHeatmap({ theme }) {
  // 26 weeks (~6 months) x 7 days
  const weeks = 26, days = 7;
  // Deterministic pseudo-data
  const levels = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < days; d++) {
      const seed = (w * 7 + d);
      // Streak of recent activity: last 28 days mostly filled
      const totalIdx = w * 7 + d;
      const recent = totalIdx > (weeks * days - 32);
      let v;
      if (recent) {
        v = ((seed * 37) % 5);
        if (v === 0) v = 1;
      } else {
        const r = (seed * 17 + 3) % 10;
        v = r < 3 ? 0 : r < 6 ? 1 : r < 8 ? 2 : 3;
      }
      // mini break in the streak
      if (totalIdx === weeks * days - 19) v = 0;
      col.push(v);
    }
    levels.push(col);
  }

  const shades = [
    theme.chipBg,
    'rgba(47,111,235,0.18)',
    'rgba(47,111,235,0.38)',
    'rgba(47,111,235,0.62)',
    theme.accent,
  ];

  const cell = 13, gap = 3;
  return (
    <div style={{
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <div style={{
            fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
            textTransform: 'uppercase', letterSpacing: 1.2,
          }}>Practice heatmap</div>
          <div style={{
            fontFamily: BS_FONTS.serif, fontSize: 22, fontWeight: 500,
            color: theme.fg, letterSpacing: -0.3, marginTop: 2,
          }}>182 days · <span style={{ color: theme.fgMuted }}>1,842 minutes read</span></div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'inline-flex', padding: 2, borderRadius: 6,
          background: theme.chipBg, border: `1px solid ${theme.border}`,
        }}>
          {['6M','1Y','All'].map((x,i) => (
            <button key={x} style={{
              padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === 0 ? theme.panel : 'transparent',
              color: i === 0 ? theme.fg : theme.fgMuted,
              fontFamily: BS_FONTS.sans, fontSize: 11.5, fontWeight: i === 0 ? 600 : 500,
              boxShadow: i === 0 ? theme.shadow : 'none',
            }}>{x}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* day labels */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap, paddingTop: 22,
          fontFamily: BS_FONTS.mono, fontSize: 9.5, color: theme.fgFaint,
        }}>
          {['M','','W','','F','',''].map((d, i) => (
            <div key={i} style={{ height: cell, lineHeight: `${cell}px` }}>{d}</div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {/* month labels */}
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${weeks}, ${cell}px)`,
            columnGap: gap, marginBottom: 6,
            fontFamily: BS_FONTS.mono, fontSize: 9.5, color: theme.fgFaint,
          }}>
            {Array.from({length: weeks}).map((_, w) => (
              <div key={w} style={{
                textAlign: 'left', whiteSpace: 'nowrap', overflow: 'visible',
              }}>
                {[0,4,8,13,17,21].includes(w)
                  ? ['Nov','Dec','Jan','Feb','Mar','Apr'][[0,4,8,13,17,21].indexOf(w)]
                  : ''}
              </div>
            ))}
          </div>

          {/* grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${weeks}, ${cell}px)`,
            columnGap: gap, rowGap: gap,
          }}>
            {Array.from({length: weeks}).map((_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap }}>
                {levels[w].map((v, d) => (
                  <div key={d} style={{
                    width: cell, height: cell, borderRadius: 3,
                    background: shades[v],
                    border: `1px solid ${v === 0 ? theme.border : 'transparent'}`,
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* legend */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 14, justifyContent: 'flex-end',
            fontFamily: BS_FONTS.mono, fontSize: 10, color: theme.fgMuted,
          }}>
            <span>Less</span>
            {shades.map((s, i) => (
              <div key={i} style={{
                width: 11, height: 11, borderRadius: 2, background: s,
                border: `1px solid ${i === 0 ? theme.border : 'transparent'}`,
              }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BSBigStat({ theme, label, value, unit, sub, icon, iconBg }) {
  return (
    <div style={{
      flex: 1, padding: 20,
      background: theme.panel, border: `1px solid ${theme.border}`,
      borderRadius: 14, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconBg || theme.chipBg, color: theme.accent,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
          textTransform: 'uppercase', letterSpacing: 1.1,
        }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{
          fontFamily: BS_FONTS.serif, fontSize: 40, fontWeight: 500,
          color: theme.fg, letterSpacing: -1, lineHeight: 1,
        }}>{value}</div>
        {unit && <div style={{ fontFamily: BS_FONTS.sans, fontSize: 13, color: theme.fgMuted }}>{unit}</div>}
      </div>
      <div style={{ marginTop: 6, fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted }}>
        {sub}
      </div>
    </div>
  );
}

function BSBarRow({ theme, label, n, max, color }) {
  const pct = n / max;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 48px', gap: 12, alignItems: 'center' }}>
      <div style={{ fontFamily: BS_FONTS.sans, fontSize: 12.5, color: theme.fg }}>{label}</div>
      <div style={{
        height: 8, borderRadius: 999, background: theme.chipBg, overflow: 'hidden',
      }}>
        <div style={{ width: `${pct*100}%`, height: '100%', background: color || theme.accent, borderRadius: 999 }} />
      </div>
      <div style={{
        textAlign: 'right', fontFamily: BS_FONTS.mono, fontSize: 12, color: theme.fgMuted,
      }}>{n}</div>
    </div>
  );
}

function BSActivityRow({ theme, a }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: a.iconBg, color: a.iconFg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{a.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: BS_FONTS.serif, fontSize: 14, color: theme.fg,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{a.title}</div>
        <div style={{
          fontFamily: BS_FONTS.sans, fontSize: 11.5, color: theme.fgMuted, marginTop: 1,
        }}>{a.meta}</div>
      </div>
      <div style={{
        fontFamily: BS_FONTS.mono, fontSize: 11, color: theme.fgFaint, whiteSpace: 'nowrap',
      }}>{a.when}</div>
    </div>
  );
}

function BSProfileScreen({ theme }) {
  const sources = [
    { label: 'No Priors', n: 128, c: theme.accent },
    { label: 'Latent Space', n: 94, c: '#E26B3C' },
    { label: 'Dwarkesh', n: 81, c: '#7A3CE0' },
    { label: 'Anthropic', n: 44, c: '#0E8A5F' },
    { label: 'X builders', n: 31, c: '#D93A75' },
  ];
  const activity = [
    { icon: BSIcons.bolt, iconBg: theme.highlight, iconFg: '#8A6D00',
      title: 'Saved "asymptote" from @karpathy',
      meta: '/ˈæsɪmptoʊt/ · n. · added to vocab', when: '12 min ago' },
    { icon: BSIcons.mic, iconBg: 'rgba(47,111,235,0.10)', iconFg: theme.accent,
      title: 'Finished No Priors · Ep 118 — The Agentic Economy',
      meta: '52 min · 18 new words · 2 bookmarks', when: '1h ago' },
    { icon: BSIcons.check, iconBg: 'rgba(14,138,95,0.10)', iconFg: theme.good,
      title: 'Reviewed 9 words · 8 correct',
      meta: '"plateau" moved to learned ✓', when: '3h ago' },
    { icon: BSIcons.twitter, iconBg: 'rgba(120,120,120,0.10)', iconFg: theme.fg,
      title: 'Read 12 posts from 7 builders',
      meta: 'swyx, Rauch, Karpathy, Murati, Altman, Amodei, Friedman', when: 'yesterday' },
    { icon: BSIcons.book, iconBg: 'rgba(122,60,224,0.10)', iconFg: '#7A3CE0',
      title: 'Anthropic · A field guide to pre-deployment evaluation',
      meta: '14 min read · 34 new words · highlighted 6 sentences', when: 'yesterday' },
  ];

  return (
    <div style={{ minHeight: '100%', background: theme.bg, color: theme.fg }}>
      <BSAppHeader theme={theme} active="profile" />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 40px 60px' }}>
        {/* Title */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            background: `linear-gradient(135deg, ${theme.accent}, #7A3CE0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: BS_FONTS.serif, fontSize: 36, color: '#fff', fontWeight: 500,
            letterSpacing: -1, fontStyle: 'italic',
          }}>Y</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: BS_FONTS.mono, fontSize: 11, color: theme.fgMuted,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4,
            }}>Profile · joined Oct 2025</div>
            <h1 style={{
              margin: 0, fontFamily: BS_FONTS.serif, fontSize: 40, fontWeight: 500,
              color: theme.fg, letterSpacing: -0.8, lineHeight: 1.05,
            }}>You've been listening for <span style={{ fontStyle: 'italic', color: theme.accent }}>28 days in a row</span>.</h1>
            <div style={{
              marginTop: 8, fontFamily: BS_FONTS.cjk, fontSize: 15, color: theme.fgMuted,
            }}>你已经连续学习 28 天。B2 · 平均每天 14 分钟 · 离下一个里程碑还有 2 天。</div>
          </div>
          <button style={bsGhostBtn(theme)}>Settings</button>
        </div>

        {/* Four big stats */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
          <BSBigStat theme={theme} label="Current streak" value="28" unit="days"
            sub="Longest ever: 41 days" icon={BSIcons.flame}
            iconBg="rgba(226,107,60,0.12)" />
          <BSBigStat theme={theme} label="Vocabulary" value="842" unit="words"
            sub="+31 this week" icon={BSIcons.bolt}
            iconBg={theme.highlight} />
          <BSBigStat theme={theme} label="Listened" value="30.7" unit="hours"
            sub="across 6 months" icon={BSIcons.mic}
            iconBg="rgba(47,111,235,0.10)" />
          <BSBigStat theme={theme} label="Level est." value="B2" unit="→ C1"
            sub="Based on 6 unseen-word tests" icon={BSIcons.gauge}
            iconBg="rgba(14,138,95,0.12)" />
        </div>

        {/* Heatmap */}
        <div style={{ marginBottom: 22 }}>
          <BSHeatmap theme={theme} />
        </div>

        {/* Two-column: sources + recent activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
          <div style={{
            padding: 22, background: theme.panel,
            border: `1px solid ${theme.border}`, borderRadius: 14,
          }}>
            <div style={{
              fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
              textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4,
            }}>Words by source</div>
            <div style={{
              fontFamily: BS_FONTS.serif, fontSize: 20, fontWeight: 500,
              color: theme.fg, marginBottom: 18, letterSpacing: -0.3,
            }}>Where your English comes from</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sources.map((s,i) => <BSBarRow key={i} theme={theme} label={s.label} n={s.n} max={128} color={s.c} />)}
            </div>
            <BSDivider theme={theme} margin="18px 0" />
            <div style={{
              fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted, lineHeight: 1.6,
            }}>
              Most-heard voice this month: <b style={{ color: theme.fg, fontWeight: 600 }}>Jeremy Allaire</b>.
              Most-saved word topic: <b style={{ color: theme.fg, fontWeight: 600 }}>agentic + finance</b>.
            </div>
          </div>

          <div style={{
            padding: 22, background: theme.panel,
            border: `1px solid ${theme.border}`, borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 10 }}>
              <div>
                <div style={{
                  fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
                  textTransform: 'uppercase', letterSpacing: 1.2,
                }}>Recent activity</div>
                <div style={{
                  fontFamily: BS_FONTS.serif, fontSize: 20, fontWeight: 500,
                  color: theme.fg, letterSpacing: -0.3,
                }}>Today & yesterday</div>
              </div>
              <div style={{ flex: 1 }} />
              <button style={bsGhostBtn(theme)}>Full timeline {BSIcons.arrow}</button>
            </div>
            {activity.map((a,i) => <BSActivityRow key={i} theme={theme} a={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BSProfileScreen });
