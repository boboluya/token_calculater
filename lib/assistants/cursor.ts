import type { DailyEntry } from '@/lib/data';

export function matchCursorFile(relativePath: string): boolean {
  const parts = relativePath.split('/');
  return (
    parts.length >= 3 &&
    parts[1] === 'history' &&
    parts.slice(2, -1).length === 0 &&
    (parts.at(-1)?.startsWith('usage.json') ?? false)
  );
}

export function parseCursorContent(content: string): DailyEntry[] {
  try {
    const data = JSON.parse(content);
    const entries = Array.isArray((data as { daily?: unknown }).daily)
      ? (data as { daily: Array<Record<string, unknown>> }).daily
      : [];

    return entries
      .filter((entry) => typeof entry.date === 'string' && entry.date)
      .map((entry) => ({
        date: entry.date as string,
        provider_calls: Number.isFinite(entry.provider_calls) ? (entry.provider_calls as number) : 0,
        turns_total: Number.isFinite(entry.turns_total) ? (entry.turns_total as number) : 0,
        input_tokens: Number.isFinite(entry.input_tokens) ? (entry.input_tokens as number) : 0,
        output_tokens: Number.isFinite(entry.output_tokens) ? (entry.output_tokens as number) : 0,
        cache_read_tokens: Number.isFinite(entry.cache_read_tokens) ? (entry.cache_read_tokens as number) : 0,
        total_tokens: Number.isFinite(entry.total_tokens) ? (entry.total_tokens as number) : 0,
      }));
  } catch {
    return [];
  }
}
