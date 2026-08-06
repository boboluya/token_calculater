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
