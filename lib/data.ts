import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

export function gatherDailyTotals(dataDir: string): DailyEntry[] {
  const daily: Record<string, DailyEntry> = {};

  try {
    const files = readdirSync(dataDir).filter((f) =>
      f.startsWith('usage.json')
    );
    for (const file of files.sort()) {
      try {
        const content = readFileSync(join(dataDir, file), 'utf-8');
        const data = JSON.parse(content);
        const entries: Array<Record<string, unknown>> = data.daily || [];
        for (const entry of entries) {
          const date = entry.date as string;
          if (!daily[date]) {
            daily[date] = EMPTY_ENTRY(date);
          }
          for (const k of KEYS) {
            daily[date][k] += (entry[k] as number) || 0;
          }
        }
      } catch {
        // Skip malformed or unreadable files
      }
    }
  } catch {
    // Directory doesn't exist or can't be read — return empty
  }

  return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));
}