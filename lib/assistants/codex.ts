import type { DailyEntry } from '@/lib/data';

const CODEX_SESSION_PATH = /(?:^|\/)sessions\/\d{4}\/\d{2}\/\d{2}\/rollout-[^/]+\.jsonl$/i;

export function matchCodexFile(relativePath: string): boolean {
  return CODEX_SESSION_PATH.test(relativePath.replaceAll('\\', '/'));
}

function tokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

function localDate(timestamp: unknown): string | null {
  if (typeof timestamp !== 'string') return null;

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function parseCodexFile(file: File): Promise<DailyEntry[]> {
  return parseCodexContent(await file.text());
}

export function parseCodexContent(content: string): DailyEntry[] {
  const entries: DailyEntry[] = [];

  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;

    try {
      const record = JSON.parse(line) as {
        timestamp?: unknown;
        type?: unknown;
        payload?: {
          type?: unknown;
          info?: {
            last_token_usage?: Record<string, unknown>;
          };
        };
      };
      const usage = record.payload?.info?.last_token_usage;
      const date = localDate(record.timestamp);

      if (
        record.type !== 'event_msg' ||
        record.payload?.type !== 'token_count' ||
        !usage ||
        !date
      ) {
        continue;
      }

      const input = tokenCount(usage.input_tokens);
      const output = tokenCount(usage.output_tokens);
      if (input === 0 && output === 0) continue;

      const cacheRead = Math.min(input, tokenCount(usage.cached_input_tokens));

      entries.push({
        date,
        provider_calls: 1,
        turns_total: 0,
        input_tokens: input - cacheRead,
        output_tokens: output,
        cache_read_tokens: cacheRead,
        total_tokens: tokenCount(usage.total_tokens),
      });
    } catch {
      // 单行损坏不影响同一会话文件中的其他用量记录。
    }
  }

  return entries;
}
