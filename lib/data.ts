export interface DailyEntry {
  date: string;
  provider_calls: number;
  turns_total: number;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  total_tokens: number;
}

const EMPTY_ENTRY = (date: string): DailyEntry => ({
  date,
  provider_calls: 0,
  turns_total: 0,
  input_tokens: 0,
  output_tokens: 0,
  cache_read_tokens: 0,
  total_tokens: 0,
});

const KEYS = [
  'provider_calls',
  'turns_total',
  'input_tokens',
  'output_tokens',
  'cache_read_tokens',
  'total_tokens',
] as const;

/**
 * 通用桶聚合：keyFn 决定条目落入哪个桶，桶内对 KEYS 求和。
 * 桶键同时作为输出条目的 date，因此输出类型与输入一致。
 */
function bucketBy(
  entries: DailyEntry[],
  keyFn: (date: string) => string | null,
): DailyEntry[] {
  const buckets: Record<string, DailyEntry> = {};

  for (const entry of entries) {
    if (typeof entry.date !== 'string' || !entry.date) continue;

    const key = keyFn(entry.date);
    if (!key) continue;

    buckets[key] ??= EMPTY_ENTRY(key);
    for (const field of KEYS) {
      const value = entry[field];
      if (typeof value === 'number' && Number.isFinite(value)) {
        buckets[key][field] += value;
      }
    }
  }

  return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
}

/** 将多个 agent 的日数据合并后重新按日期聚合 */
export function aggregateDailyEntries(allEntries: DailyEntry[][]): DailyEntry[] {
  return gatherDailyTotals(allEntries.flat());
}

export function gatherDailyTotals(entries: DailyEntry[]): DailyEntry[] {
  return bucketBy(entries, (date) => date);
}

/* ------------------------------------------------------------------ */
/*  时间粒度重采样                                                     */
/* ------------------------------------------------------------------ */

export type Granularity = 'day' | 'week' | 'month';

/** 天数超过阈值时自动降密度，保证图表点数始终可读 */
const GRANULARITY_THRESHOLDS: ReadonlyArray<[max: number, granularity: Granularity]> = [
  [30, 'day'],
  [183, 'week'],
];

export function pickGranularity(dayCount: number): Granularity {
  return GRANULARITY_THRESHOLDS.find(([max]) => dayCount <= max)?.[1] ?? 'month';
}

/** ISO 日期 → 所在 ISO 周的周一（同为 ISO 日期字符串） */
function weekStart(date: string): string | null {
  const ts = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(ts)) return null;

  const d = new Date(ts);
  const offset = (d.getUTCDay() + 6) % 7; // 周一 = 0
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

const BUCKET_KEY: Record<Granularity, (date: string) => string | null> = {
  day: (date) => date,
  week: weekStart,
  month: (date) => (date.length >= 7 ? `${date.slice(0, 7)}-01` : null),
};

/**
 * 按粒度重采样日数据。输出仍是 DailyEntry[]，
 * 下游图表 / 汇总卡片无需感知粒度差异。
 */
export function resampleEntries(
  entries: DailyEntry[],
  granularity: Granularity,
): DailyEntry[] {
  if (granularity === 'day') return entries;
  return bucketBy(entries, BUCKET_KEY[granularity]);
}
