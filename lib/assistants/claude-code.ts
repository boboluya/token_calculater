import type { AssistantAdapter } from './types';
import type { DailyEntry } from '@/lib/data';

/*
 * TODO: 实现 Claude Code 的文件匹配与解析。
 *
 * Claude Code（Anthropic CLI）的数据存储位置：
 *   ~/.claude/projects/<project-name>/
 *
 * 可能的目录结构（待确认）：
 *   project-name/
 *     sessions/
 *       <session-id>.jsonl     ← 每行一个 JSON 消息，含 usage/token 数据
 *
 * 需要实现：
 *   1. matchFile: 根据实际目录结构匹配对应的用量文件
 *   2. parseContent: 从 Claude Code 的 JSON 结构中提取 DailyEntry
 */

const matchFile = (_relativePath: string): boolean => {
  return false;
};

const parseContent = (_content: string, _fileName: string): DailyEntry[] => {
  return [];
};

export const claudeCodeAdapter: AssistantAdapter = {
  id: 'claude-code',
  name: 'Claude Code',
  description: 'Anthropic Claude Code CLI 用量数据（待接入）',
  filePattern: '（待确认）',
  ready: false,
  matchFile,
  parseContent,
};