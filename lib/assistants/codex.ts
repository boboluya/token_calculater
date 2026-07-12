import type { AssistantAdapter } from './types';
import type { DailyEntry } from '@/lib/data';

/*
 * TODO: 实现 OpenAI Codex CLI 的文件匹配与解析。
 *
 * Codex CLI（OpenAI）的数据存储位置（待确认）：
 *   ~/.codex/  或项目根目录下的 .codex/
 *
 * 可能的目录结构（待确认）：
 *   .codex/
 *     sessions/
 *       <session-id>.json     ← 含 token 用量信息
 *
 * 需要实现：
 *   1. matchFile: 根据实际目录结构匹配对应的用量文件
 *   2. parseContent: 从 Codex 的 JSON 结构中提取 DailyEntry
 */

const matchFile = (_relativePath: string): boolean => {
  return false;
};

const parseContent = (_content: string, _fileName: string): DailyEntry[] => {
  return [];
};

export const codexAdapter: AssistantAdapter = {
  id: 'codex',
  name: 'Codex',
  description: 'OpenAI Codex CLI 用量数据（待接入）',
  filePattern: '（待确认）',
  ready: false,
  matchFile,
  parseContent,
};