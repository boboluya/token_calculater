import type { AssistantAdapter } from './types';
import type { DailyEntry } from '@/lib/data';

const matchFile = (relativePath: string): boolean => {
  const parts = relativePath.split('/');
  return (
    parts.length >= 3 &&
    parts[1] === 'history' &&
    parts.slice(2, -1).length === 0 &&
    (parts.at(-1)?.startsWith('usage.json') ?? false)
  );
};

const parseContent = (content: string, _fileName: string): DailyEntry[] => {
  try {
    const data = JSON.parse(content);
    const entries = Array.isArray((data as { daily?: unknown }).daily)
      ? (data as { daily: Array<Record<string, unknown>> }).daily
      : [];

    return entries
      .filter((e) => typeof e.date === 'string' && e.date)
      .map((e) => ({
        date: e.date as string,
        provider_calls: Number.isFinite(e.provider_calls) ? (e.provider_calls as number) : 0,
        turns_total: Number.isFinite(e.turns_total) ? (e.turns_total as number) : 0,
        input_tokens: Number.isFinite(e.input_tokens) ? (e.input_tokens as number) : 0,
        output_tokens: Number.isFinite(e.output_tokens) ? (e.output_tokens as number) : 0,
        cache_read_tokens: Number.isFinite(e.cache_read_tokens) ? (e.cache_read_tokens as number) : 0,
        total_tokens: Number.isFinite(e.total_tokens) ? (e.total_tokens as number) : 0,
      }));
  } catch {
    return [];
  }
};

export const cursorAdapter: AssistantAdapter = {
  id: 'cursor',
  name: 'Cursor 助手',
  description: 'Cursor 本地助手插件（~/.cursor-local-assistant-v2）的 usage.json 用量记录',
  filePattern: 'history/usage.json',
  ready: true,
  matchFile,
  parseContent,
};