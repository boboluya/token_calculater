import type { DailyEntry } from '@/lib/data';
import { querySqliteFile, type SqliteRow } from './sqlite';

export function matchOpenCodeFile(relativePath: string): boolean {
  return relativePath.split('/').at(-1)?.toLowerCase() === 'opencode.db';
}

function numberValue(row: SqliteRow, key: string): number {
  const value = row[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function parseOpenCodeFile(file: File): Promise<DailyEntry[]> {
  try {
    const rows = await querySqliteFile(
      file,
      `
        SELECT
          date(time_created / 1000, 'unixepoch', 'localtime') AS date,
          COUNT(*) AS sessions,
          SUM(tokens_input) AS input_tokens,
          SUM(tokens_output) AS output_tokens,
          SUM(tokens_cache_read) AS cache_read_tokens
        FROM session
        GROUP BY date
        ORDER BY date
      `,
    );

    return rows.flatMap((row) => {
      if (typeof row.date !== 'string' || !row.date) return [];

      const input = numberValue(row, 'input_tokens');
      const output = numberValue(row, 'output_tokens');
      const cacheRead = numberValue(row, 'cache_read_tokens');
      const sessions = numberValue(row, 'sessions');

      return [{
        date: row.date,
        provider_calls: sessions,
        turns_total: sessions,
        input_tokens: input,
        output_tokens: output,
        cache_read_tokens: cacheRead,
        total_tokens: input + output + cacheRead,
      }];
    });
  } catch (reason) {
    const detail = reason instanceof Error ? reason.message : String(reason);
    throw new Error(`无法解析 OpenCode 数据库，请确认选择的是有效的 opencode.db：${detail}`);
  }
}