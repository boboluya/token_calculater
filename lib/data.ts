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

/** 将多个 agent 的日数据合并后重新按日期聚合 */
export function aggregateDailyEntries(allEntries: DailyEntry[][]): DailyEntry[] {
  return gatherDailyTotals(allEntries.flat());
}

export function gatherDailyTotals(entries: DailyEntry[]): DailyEntry[] {
  const daily: Record<string, DailyEntry> = {};

  for (const entry of entries) {
    if (typeof entry.date !== 'string' || !entry.date) continue;

    daily[entry.date] ??= EMPTY_ENTRY(entry.date);
    for (const key of KEYS) {
      const value = entry[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        daily[entry.date][key] += value;
      }
    }
  }

  return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));
}
