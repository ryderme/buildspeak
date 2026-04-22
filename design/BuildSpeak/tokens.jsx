// BuildSpeak shared tokens — themes, data, small UI atoms

// ─────────── Themes ───────────
const BS_THEMES = {
  light: {
    bg: '#FAFAF7',
    panel: '#FFFFFF',
    panelAlt: '#F3F2EC',
    border: 'rgba(26,26,26,0.08)',
    borderStrong: 'rgba(26,26,26,0.14)',
    fg: '#1A1A1A',
    fgMuted: '#6B6B6B',
    fgFaint: '#A3A29C',
    accent: '#2F6FEB',
    accentSoft: 'rgba(47,111,235,0.10)',
    accentFaint: 'rgba(47,111,235,0.06)',
    highlight: '#FFF3B0',
    highlightStrong: '#FDE68A',
    good: '#0E8A5F',
    tabBarBg: '#F3F2EC',
    chipBg: '#F3F2EC',
    underline: 'rgba(47,111,235,0.55)',
    shadow: '0 1px 2px rgba(26,26,26,0.04), 0 2px 8px rgba(26,26,26,0.04)',
    shadowStrong: '0 8px 28px rgba(26,26,26,0.10), 0 2px 8px rgba(26,26,26,0.06)',
    name: 'Light',
  },
  dark: {
    bg: '#15151A',
    panel: '#1B1B22',
    panelAlt: '#23232C',
    border: 'rgba(232,232,230,0.08)',
    borderStrong: 'rgba(232,232,230,0.16)',
    fg: '#E8E8E6',
    fgMuted: '#9A9A98',
    fgFaint: '#5F5F5C',
    accent: '#6C9BF5',
    accentSoft: 'rgba(108,155,245,0.14)',
    accentFaint: 'rgba(108,155,245,0.08)',
    highlight: 'rgba(255, 224, 130, 0.18)',
    highlightStrong: 'rgba(255, 224, 130, 0.32)',
    good: '#4CB58A',
    tabBarBg: '#1B1B22',
    chipBg: '#23232C',
    underline: 'rgba(108,155,245,0.70)',
    shadow: '0 1px 2px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)',
    shadowStrong: '0 10px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.35)',
    name: 'Dark',
  },
  sepia: {
    bg: '#F4ECD8',
    panel: '#FBF5E4',
    panelAlt: '#EEE3C4',
    border: 'rgba(79,62,39,0.14)',
    borderStrong: 'rgba(79,62,39,0.24)',
    fg: '#4F3E27',
    fgMuted: '#8A7651',
    fgFaint: '#B0A079',
    accent: '#2F6FEB',
    accentSoft: 'rgba(47,111,235,0.12)',
    accentFaint: 'rgba(47,111,235,0.06)',
    highlight: '#F5D77A',
    highlightStrong: '#ECC24A',
    good: '#146A4A',
    tabBarBg: '#EEE3C4',
    chipBg: '#EEE3C4',
    underline: 'rgba(47,111,235,0.55)',
    shadow: '0 1px 2px rgba(79,62,39,0.06), 0 2px 8px rgba(79,62,39,0.06)',
    shadowStrong: '0 8px 28px rgba(79,62,39,0.14), 0 2px 8px rgba(79,62,39,0.08)',
    name: 'Sepia',
  },
};

// Fonts
const BS_FONTS = {
  serif: `'Source Serif 4', 'Source Serif Pro', 'Iowan Old Style', 'Apple Garamond', Georgia, serif`,
  sans: `'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif`,
  cjk: `'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif`,
  mono: `'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace`,
};

// ─────────── Icons (tiny, stroke-only) ───────────
const BSIcon = ({ path, size = 16, stroke = 'currentColor', fill = 'none', sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {path}
  </svg>
);

const BSIcons = {
  play: <BSIcon path={<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />} />,
  pause: <BSIcon path={<><line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/></>} />,
  prev: <BSIcon path={<><polygon points="19 4 9 12 19 20 19 4" fill="currentColor" stroke="none"/><line x1="6" y1="4" x2="6" y2="20"/></>} />,
  next: <BSIcon path={<><polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><line x1="18" y1="4" x2="18" y2="20"/></>} />,
  speaker: <BSIcon path={<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>} />,
  star: <BSIcon path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />,
  starFill: <BSIcon fill="currentColor" path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />,
  bolt: <BSIcon fill="currentColor" path={<polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2" stroke="none"/>} />,
  book: <BSIcon path={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>} />,
  mic: <BSIcon path={<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="22"/></>} />,
  twitter: <BSIcon path={<path d="M18 3h3l-7.5 8.57L22 21h-6.8l-5.33-6.97L3.6 21H.6l8.02-9.17L.6 3H7.5l4.81 6.36L18 3Z" fill="currentColor" stroke="none"/>} />,
  cal: <BSIcon path={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />,
  search: <BSIcon path={<><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
  flame: <BSIcon path={<path d="M12 2s1 3 3 5 4 4 4 8a7 7 0 0 1-14 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3 1-5 2-9Z"/>} />,
  arrow: <BSIcon path={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />,
  link: <BSIcon path={<><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07l1.5-1.5"/></>} />,
  dot: <BSIcon path={<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>} />,
  check: <BSIcon path={<polyline points="20 6 9 17 4 12"/>} />,
  gauge: <BSIcon path={<><path d="M12 14l4-4"/><circle cx="12" cy="14" r="8"/><path d="M5 8A10 10 0 0 1 19 8"/></>} />,
  filter: <BSIcon path={<path d="M3 4h18l-7 9v7l-4-2v-5L3 4Z"/>} />,
  x: <BSIcon path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
  plus: <BSIcon path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
  heart: <BSIcon path={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>} />,
  repeat: <BSIcon path={<><polyline points="17 2 22 7 17 12"/><path d="M2 11v-1a4 4 0 0 1 4-4h16"/><polyline points="7 22 2 17 7 12"/><path d="M22 13v1a4 4 0 0 1-4 4H2"/></>} />,
  reply: <BSIcon path={<path d="M3 11.5a8 8 0 0 1 8-8v-3l5 5-5 5v-3a5 5 0 0 0-5 5v8"/>} />,
  volume: <BSIcon path={<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>} />,
  sun: <BSIcon path={<><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></>} />,
  moon: <BSIcon path={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>} />,
  leaf: <BSIcon path={<><path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 0 14"/><path d="M4 4l13 13"/></>} />,
};

// ─────────── Tiny reusable atoms ───────────
function BSChip({ children, theme, tone = 'neutral', icon }) {
  const tones = {
    neutral: { bg: theme.chipBg, fg: theme.fgMuted },
    accent:  { bg: theme.accentSoft, fg: theme.accent },
    good:    { bg: 'rgba(14,138,95,0.10)', fg: theme.good },
    warn:    { bg: theme.highlight, fg: theme.fg },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg,
      fontFamily: BS_FONTS.sans, fontSize: 11, fontWeight: 500,
      letterSpacing: 0.1,
    }}>
      {icon}{children}
    </span>
  );
}

function BSKbd({ children, theme }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, height: 18, padding: '0 5px',
      borderRadius: 4, background: theme.chipBg,
      border: `1px solid ${theme.border}`,
      fontFamily: BS_FONTS.mono, fontSize: 10, color: theme.fgMuted,
    }}>{children}</span>
  );
}

function BSDivider({ theme, margin = '16px 0' }) {
  return <div style={{ height: 1, background: theme.border, margin }} />;
}

// ─────────── Sample data ───────────
const BS_DATA = {
  today: 'Thu, Apr 9, 2026',
  streak: 28,
  todayMins: 14,
  todayGoal: 20,
  wordsTotal: 842,
  wordsToday: 7,
  readToday: 3,
  reviewQueue: 9,
};

// Expose
Object.assign(window, { BS_THEMES, BS_FONTS, BSIcon, BSIcons, BSChip, BSKbd, BSDivider, BS_DATA });
