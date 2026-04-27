export function formatDateZh(iso: string): string {
  // 2026-04-22 → 4 月 22 日
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const month = Number(m[2]);
  const day = Number(m[3]);
  return `${month} 月 ${day} 日`;
}

export function formatDateFull(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[1]} 年 ${Number(m[2])} 月 ${Number(m[3])} 日`;
}

export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
