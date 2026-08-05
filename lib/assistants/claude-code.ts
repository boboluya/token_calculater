import type { DailyEntry } from '@/lib/data';

export function matchClaudeCodeFile(relativePath: string): boolean {
  const lowerPath = relativePath.toLowerCase();
  return lowerPath.endsWith('.jsonl') && !lowerPath.endsWith('.meta.json');
}

function tokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * 一条 assistant 消息的每个 content block 都会单独写入一行 JSONL，
 * 且每行重复携带完整且相同的 message.usage。按行累加会把同一次 API
 * 调用的用量放大到 block 数量倍，因此需要按调用去重。
 *
 * 去重键取 message.id + requestId：同一次调用两者恒定，恢复/派生会话
 * 复制的历史记录也会带着原调用的 id，因此跨文件同样能收敛到一次。
 */
function usageKey(messageId: string, requestId: string, uuid: string): string {
  // 两者都缺失时无法判定重复，退回 uuid 以保留该条记录。
  return messageId || requestId ? `${messageId}|${requestId}` : `uuid:${uuid}`;
}

/**
 * @param seen 跨文件共享的去重集合。省略时仅在当前文件内去重。
 */
export function parseClaudeCodeContent(
  content: string,
  seen: Set<string> = new Set(),
): DailyEntry[] {
  const entries: DailyEntry[] = [];

  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;

    try {
      const record = JSON.parse(line) as {
        timestamp?: unknown;
        requestId?: unknown;
        uuid?: unknown;
        message?: {
          id?: unknown;
          usage?: Record<string, unknown>;
        };
      };
      const timestamp = record.timestamp;
      const usage = record.message?.usage;

      if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(timestamp) || !usage) {
        continue;
      }

      const key = usageKey(
        stringValue(record.message?.id),
        stringValue(record.requestId),
        stringValue(record.uuid),
      );
      if (seen.has(key)) continue;
      seen.add(key);

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
