import type { DailyEntry } from '@/lib/data';
import { querySqliteFile, type SqliteRow } from './sqlite';

export function matchCodexFile(relativePath: string): boolean {
  return relativePath.split('/').at(-1)?.toLowerCase() === 'state_5.sqlite';
}

function numberValue(row: SqliteRow, key: string): number {
  const value = row[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function parseCodexFile(file: File): Promise<DailyEntry[]> {
  try {
    const rows = await querySqliteFile(
      file,
      `
        SELECT
          date(created_at, 'unixepoch', 'localtime') AS date,
          COUNT(*) AS sessions,
          SUM(tokens_used) AS total_tokens
        FROM threads
        GROUP BY date
        ORDER BY date
      `,
    );

    return rows.flatMap((row) => {
      if (typeof row.date !== 'string' || !row.date) return [];

      const sessions = numberValue(row, 'sessions');
      return [{
        date: row.date,
        provider_calls: sessions,
        turns_total: sessions,
        input_tokens: 0,
        output_tokens: 0,
        cache_read_tokens: 0,
        total_tokens: numberValue(row, 'total_tokens'),
      }];
    });
  } catch (reason) {
    const detail = reason instanceof Error ? reason.message : String(reason);
    throw new Error(`无法解析 Codex 数据库，请确认选择的是有效的 state_5.sqlite：${detail}`);
  }
}