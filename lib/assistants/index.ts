export type { AssistantAdapter } from './types';

import type { AssistantAdapter } from './types';
import { cursorAdapter } from './cursor';
import { claudeCodeAdapter } from './claude-code';
import { codexAdapter } from './codex';
import { opencodeAdapter } from './opencode';

/** 全部已注册的适配器，按名称排序 */
export const ALL_ADAPTERS: AssistantAdapter[] = [
  cursorAdapter,
  claudeCodeAdapter,
  codexAdapter,
  opencodeAdapter,
];

const adapterMap = new Map(ALL_ADAPTERS.map((a) => [a.id, a]));

/** 根据 id 获取适配器，未找到返回 undefined */
export function getAdapter(id: string): AssistantAdapter | undefined {
  return adapterMap.get(id);
}

/** 默认适配器 id */
export const DEFAULT_ADAPTER_ID = 'cursor';