// Reader — side-by-side EN/ZH with word card + top player bar

function BSReaderTopBar({ theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 32px', borderBottom: `1px solid ${theme.border}`,
      background: theme.panel, position: 'sticky', top: 0, zIndex: 4,
    }}>
      <button style={{
        background: 'transparent', border: `1px solid ${theme.border}`,
        padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
        fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted,
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>{BSIcons.arrow}</span>
        Today
      </button>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
          letterSpacing: 1, textTransform: 'uppercase',
        }}>No Priors · Apr 9, 2026 · 52 min</div>
        <div style={{
          fontFamily: BS_FONTS.serif, fontSize: 15, fontWeight: 600,
          color: theme.fg, letterSpacing: -0.2, marginTop: 1,
        }}>The Agentic Economy — with Jeremy Allaire</div>
      </div>
      <div style={{ flex: 1 }} />

      {/* Layout toggle */}
      <div style={{
        display: 'inline-flex', padding: 2, borderRadius: 7,
        background: theme.chipBg, border: `1px solid ${theme.border}`,
      }}>
        {[
          { id: 'side', label: 'Side-by-side', active: true },
          { id: 'stack', label: 'Interlinear' },
          { id: 'eng', label: 'English only' },
        ].map(x => (
          <button key={x.id} style={{
            padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
            background: x.active ? theme.panel : 'transparent',
            color: x.active ? theme.fg : theme.fgMuted,
            fontFamily: BS_FONTS.sans, fontSize: 11.5, fontWeight: x.active ? 600 : 500,
            boxShadow: x.active ? theme.shadow : 'none',
          }}>{x.label}</button>
        ))}
      </div>

      <button style={bsGhostBtn(theme)}>{BSIcons.book} ToC</button>
      <button style={bsGhostBtn(theme)}>{BSIcons.bolt} 18 new</button>
    </div>
  );
}

function BSPlayerBar({ theme }) {
  const pct = 0.21;
  return (
    <div style={{
      position: 'sticky', top: 76, zIndex: 3,
      background: theme.panel,
      borderBottom: `1px solid ${theme.border}`,
      padding: '10px 32px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={bsRoundBtn(theme)}>{BSIcons.prev}</button>
        <button style={{...bsRoundBtn(theme), background: theme.fg, color: theme.bg, border: 'none'}}>
          {BSIcons.pause}
        </button>
        <button style={bsRoundBtn(theme)}>{BSIcons.next}</button>
      </div>

      <div style={{ fontFamily: BS_FONTS.mono, fontSize: 11, color: theme.fgMuted, minWidth: 88 }}>
        02:34 <span style={{ opacity: 0.5 }}>/ 12:08</span>
      </div>

      <div style={{
        flex: 1, height: 4, borderRadius: 999,
        background: theme.chipBg, position: 'relative',
      }}>
        <div style={{
          width: `${pct*100}%`, height: '100%', background: theme.accent,
          borderRadius: 999,
        }} />
        <div style={{
          position: 'absolute', left: `${pct*100}%`, top: '50%',
          width: 11, height: 11, borderRadius: '50%', background: theme.accent,
          transform: 'translate(-50%,-50%)',
          boxShadow: `0 0 0 3px ${theme.accentFaint}`,
        }} />
      </div>

      <div style={{
        display: 'inline-flex', padding: 2, borderRadius: 6,
        background: theme.chipBg, border: `1px solid ${theme.border}`,
        fontFamily: BS_FONTS.mono, fontSize: 11,
      }}>
        {['0.8×','1.0×','1.25×','1.5×'].map((s,i) => (
          <button key={s} style={{
            padding: '3px 7px', borderRadius: 4, border: 'none', cursor: 'pointer',
            background: i === 1 ? theme.panel : 'transparent',
            color: i === 1 ? theme.fg : theme.fgMuted,
            fontWeight: i === 1 ? 600 : 400, fontFamily: BS_FONTS.mono,
          }}>{s}</button>
        ))}
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 6,
        background: theme.accentFaint, color: theme.accent,
        border: `1px solid ${theme.accentSoft}`,
        fontFamily: BS_FONTS.sans, fontSize: 11.5, fontWeight: 600,
      }}>
        {BSIcons.mic} Shadowing mode
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: BS_FONTS.sans, fontSize: 11, color: theme.fgMuted,
      }}>
        <BSKbd theme={theme}>Space</BSKbd>
        <BSKbd theme={theme}>J</BSKbd>
        <BSKbd theme={theme}>K</BSKbd>
      </div>
    </div>
  );
}

function bsRoundBtn(theme) {
  return {
    width: 30, height: 30, borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', color: theme.fg, cursor: 'pointer',
    border: `1px solid ${theme.border}`,
  };
}

// ─── Word card popover ───
function BSWordCard({ theme }) {
  return (
    <div style={{
      width: 340, background: theme.panel,
      border: `1px solid ${theme.borderStrong}`, borderRadius: 12,
      padding: 16, boxShadow: theme.shadowStrong,
      fontFamily: BS_FONTS.sans, position: 'relative',
    }}>
      {/* notch */}
      <div style={{
        position: 'absolute', left: 42, top: -7,
        width: 12, height: 12, background: theme.panel,
        borderTop: `1px solid ${theme.borderStrong}`,
        borderLeft: `1px solid ${theme.borderStrong}`,
        transform: 'rotate(45deg)',
      }} />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{
          fontFamily: BS_FONTS.serif, fontSize: 24, fontWeight: 500, color: theme.fg,
          letterSpacing: -0.4,
        }}>stablecoin</div>
        <div style={{
          fontFamily: BS_FONTS.mono, fontSize: 13, color: theme.fgMuted,
        }}>/ˈsteɪ.bəl.kɔɪn/</div>
        <div style={{ flex: 1 }} />
        <button style={{
          width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
          background: theme.accentFaint, color: theme.accent,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{BSIcons.speaker}</button>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'baseline' }}>
        <span style={{
          fontFamily: BS_FONTS.serif, fontSize: 11.5, fontStyle: 'italic',
          color: theme.fgMuted,
        }}>n.</span>
        <span style={{ fontFamily: BS_FONTS.cjk, fontSize: 14, color: theme.fg }}>稳定币</span>
      </div>
      <div style={{
        marginTop: 4, fontFamily: BS_FONTS.cjk, fontSize: 12.5,
        color: theme.fgMuted, lineHeight: 1.55,
      }}>一种价值与美元等法币挂钩的加密货币，常用于链上支付与结算。</div>

      <div style={{ height: 1, background: theme.border, margin: '14px 0' }} />

      <div style={{
        fontFamily: BS_FONTS.mono, fontSize: 10, color: theme.fgMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          width: 14, height: 14, borderRadius: 3, background: theme.accent, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700,
        }}>J</span>
        In this passage
      </div>
      <div style={{
        fontFamily: BS_FONTS.serif, fontSize: 14, lineHeight: 1.55, color: theme.fg,
        fontStyle: 'italic',
      }}>
        “<mark style={{ background: theme.highlightStrong, padding: '0 2px' }}>Stablecoins</mark> are the native money layer of the internet.”
      </div>
      <div style={{
        fontFamily: BS_FONTS.sans, fontSize: 11.5, color: theme.fgMuted, marginTop: 4,
      }}>— Jeremy Allaire, No Priors</div>

      <div style={{ height: 1, background: theme.border, margin: '14px 0' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
          background: theme.fg, color: theme.bg,
          fontFamily: BS_FONTS.sans, fontSize: 12, fontWeight: 600,
        }}>{BSIcons.star} Save to vocab</button>
        <button style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
          background: 'transparent', color: theme.fg,
          border: `1px solid ${theme.border}`,
          fontFamily: BS_FONTS.sans, fontSize: 12, fontWeight: 500,
        }}>{BSIcons.link}</button>
      </div>
    </div>
  );
}

// Render one word — possibly highlighted, possibly clickable
function BSWord({ w, theme, state, underline }) {
  if (state === 'vocab') {
    return <span style={{
      background: theme.highlight, borderRadius: 3, padding: '0 1.5px',
      cursor: 'pointer',
    }}>{w}</span>;
  }
  if (state === 'active') {
    return <span style={{
      background: theme.highlightStrong, borderRadius: 3, padding: '0 1.5px',
      cursor: 'pointer', outline: `1.5px dashed ${theme.accent}`, outlineOffset: 1,
    }}>{w}</span>;
  }
  return <span>{w}</span>;
}

// Render sentence with mixed plain + vocab spans
function BSSentence({ segs, theme, active, speakerColor }) {
  return (
    <span style={{
      borderBottom: active ? `2px solid ${speakerColor || theme.underline}` : 'none',
      paddingBottom: active ? 1 : 0,
    }}>
      {segs.map((s, i) => typeof s === 'string'
        ? <span key={i}>{s}</span>
        : <BSWord key={i} w={s.w} state={s.s} theme={theme} />
      )}
    </span>
  );
}

function BSSpeakerLabel({ n, time, color, theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
      textTransform: 'uppercase', letterSpacing: 1,
      marginBottom: 6,
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '2px 8px', borderRadius: 999,
        background: `${color}22`, color, fontWeight: 700,
      }}>Speaker {n}</span>
      <span style={{ color: theme.fgFaint }}>·</span>
      <span>{time}</span>
      <span style={{ flex: 1 }} />
      <button style={{
        width: 22, height: 22, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'transparent', color: theme.fgMuted,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{BSIcons.speaker}</button>
    </div>
  );
}

function BSReaderScreen({ theme, fontSize = 18, lineHeight = 1.75 }) {
  const spkA = theme.accent;
  const spkB = '#E26B3C';

  const turns = [
    {
      n: 1, time: '01:03', color: spkA,
      en: [
        [
          'So take us back to the origins of Circle. You were thinking about a ',
          { w: 'protocol', s: 'vocab' },
          ' for the dollar when most people were still writing Bitcoin off.',
        ],
      ],
      zh: ['带我们回到 Circle 的起点。在大多数人还在质疑比特币的时候，你当时就在思考一种美元的"协议"。'],
    },
    {
      n: 2, time: '01:16', color: spkB, active: true,
      en: [
        [
          'The other idea that we were really excited about back then was creating a ',
          { w: 'protocol', s: 'vocab' },
          ' for dollars on the internet.',
        ],
        [
          { w: 'Stablecoins', s: 'active' },
          ' are the native money layer of the internet — not a wrapper, not a ',
          { w: 'bridge', s: 'vocab' },
          ', but the thing itself.',
        ],
        [
          'Once you accept that premise, the ',
          { w: 'agentic', s: 'vocab' },
          ' economy becomes inevitable. Agents need to move value at the speed of thought.',
        ],
      ],
      zh: [
        '那时候我们还有一个非常兴奋的想法，就是在互联网上创建一种美元协议。',
        '稳定币是互联网原生的货币层——不是一层包装，也不是一个桥，而是东西本身。',
        '一旦接受这个前提，代理经济就是必然的。代理需要以思考的速度转移价值。',
      ],
    },
    {
      n: 1, time: '02:01', color: spkA,
      en: [
        [
          'And the regulators — how have they evolved on this? A decade ago, any conversation about ',
          { w: 'programmable', s: 'vocab' },
          ' money would have stalled immediately.',
        ],
      ],
      zh: ['那监管方呢——他们的态度是怎么变化的？十年前，任何关于可编程货币的讨论都会立刻卡住。'],
    },
  ];

  return (
    <div style={{ minHeight: '100%', background: theme.bg, color: theme.fg }}>
      <BSReaderTopBar theme={theme} />
      <BSPlayerBar theme={theme} />

      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '28px 32px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, rowGap: 28,
        position: 'relative',
      }}>
        {/* Passage heading — spans full width */}
        <div style={{ gridColumn: 'span 2', marginBottom: 8 }}>
          <div style={{
            fontFamily: BS_FONTS.mono, fontSize: 10.5, color: theme.fgMuted,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
          }}>Chapter 1 · The origin of the dollar protocol</div>
          <h1 style={{
            margin: 0, fontFamily: BS_FONTS.serif, fontSize: 34, fontWeight: 500,
            color: theme.fg, letterSpacing: -0.6, lineHeight: 1.15,
          }}>The Agentic Economy</h1>
          <div style={{
            fontFamily: BS_FONTS.cjk, fontSize: 16, color: theme.fgMuted, marginTop: 4,
          }}>代理经济：AI 代理如何重塑金融系统</div>
        </div>

        {turns.map((t, i) => (
          <React.Fragment key={i}>
            {/* EN */}
            <div>
              <BSSpeakerLabel n={t.n} time={t.time} color={t.color} theme={theme} />
              <div style={{
                fontFamily: BS_FONTS.serif, fontSize, lineHeight,
                color: theme.fg, letterSpacing: 0,
              }}>
                {t.en.map((segs, j) => (
                  <p key={j} style={{ margin: '0 0 0.9em' }}>
                    <BSSentence segs={segs} theme={theme}
                      active={t.active && j === 1}
                      speakerColor={t.color} />
                  </p>
                ))}
              </div>
            </div>
            {/* ZH */}
            <div>
              <div style={{ height: 22 }} />
              <div style={{
                fontFamily: BS_FONTS.cjk, fontSize: fontSize - 3, lineHeight: lineHeight - 0.1,
                color: theme.fgMuted,
              }}>
                {t.zh.map((p, j) => (
                  <p key={j} style={{ margin: '0 0 0.9em' }}>{p}</p>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* inline micro vocab hint */}
        <div style={{
          gridColumn: 'span 2', marginTop: 6,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 8,
          background: theme.accentFaint, border: `1px dashed ${theme.accentSoft}`,
          fontFamily: BS_FONTS.sans, fontSize: 12, color: theme.fgMuted,
        }}>
          <span style={{ color: theme.accent }}>{BSIcons.bolt}</span>
          <span><b style={{ color: theme.fg, fontWeight: 600 }}>4 of 18</b> new words in this chapter ·
          click any yellow word for the full card · press <BSKbd theme={theme}>W</BSKbd> to save the last-read word</span>
        </div>

        {/* Floating word card anchored in the reading flow */}
        <div style={{
          position: 'absolute', top: 352, left: '50%',
          transform: 'translateX(-52%)',
        }}>
          <BSWordCard theme={theme} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BSReaderScreen, BSWordCard });
