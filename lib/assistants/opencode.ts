import type { AssistantAdapter } from './types';
import type { DailyEntry } from '@/lib/data';

/*
 * TODO: 实现 OpenCode 的文件匹配与解析。
 *
 * OpenCode 的数据存储位置和目录结构（待确认）。
 *
 * 需要实现：
 *   1. matchFile: 根据实际目录结构匹配对应的用量文件
 *   2. parseContent: 从 OpenCode 的数据结构中提取 DailyEntry
 */

const matchFile = (_relativePath: string): boolean => {
  return false;
};

const parseContent = (_content: string, _fileName: string): DailyEntry[] => {
  return [];
};

export const opencodeAdapter: AssistantAdapter = {
  id: 'opencode',
  name: 'OpenCode',
  description: 'OpenCode 用量数据（待接入）',
  filePattern: '（待确认）',
  ready: false,
  matchFile,
  parseContent,
};