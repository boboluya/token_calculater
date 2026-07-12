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

export function gatherDailyTotals(contents: string[]): DailyEntry[] {
  const daily: Record<string, DailyEntry> = {};

  for (const content of contents) {
    try {
      const data: unknown = JSON.parse(content);
      const entries =
        typeof data === 'object' && data !== null && Array.isArray((data as { daily?: unknown }).daily)
          ? (data as { daily: Array<Record<string, unknown>> }).daily
          : [];

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
    } catch {
      // A malformed file must not prevent other history files from loading.
    }
  }

  return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));
}
