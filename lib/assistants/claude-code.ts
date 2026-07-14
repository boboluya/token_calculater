import type { DailyEntry } from '@/lib/data';

export function matchClaudeCodeFile(relativePath: string): boolean {
  const lowerPath = relativePath.toLowerCase();
  return lowerPath.endsWith('.jsonl') && !lowerPath.endsWith('.meta.json');
}

function tokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

export function parseClaudeCodeContent(content: string): DailyEntry[] {
  const entries: DailyEntry[] = [];

  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;

    try {
      const record = JSON.parse(line) as {
        timestamp?: unknown;
        message?: {
          usage?: Record<string, unknown>;
        };
      };
      const timestamp = record.timestamp;
      const usage = record.message?.usage;

      if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(timestamp) || !usage) {
        continue;
      }

      const input = tokenCount(usage.input_tokens);
      const cacheRead = tokenCount(usage.cache_read_input_tokens);
      const output = tokenCount(usage.output_tokens);

      entries.push({
        date: timestamp.slice(0, 10),
        provider_calls: 1,
        turns_total: 1,
        input_tokens: input,
        output_tokens: output,
        cache_read_tokens: cacheRead,
        total_tokens: input + cacheRead + output,
      });
    } catch {
      // 单行损坏不影响同一会话文件中的其他用量记录。
    }
  }

  return entries;
}
