import type { DailyEntry } from '@/lib/data';

/**
 * 每个 AI 编程助手的适配器。
 * 定义如何从该助手的本地目录中识别文件、解析内容，
 * 并归一化为统一的 DailyEntry 数组。
 */
export interface AssistantAdapter {
  /** 唯一标识，用于 URL / 存储 / 缓存 key */
  id: string;
  /** 下拉选择器中显示的名称 */
  name: string;
  /** 简短描述，用于 hover 提示 */
  description: string;

  /**
   * 给定文件的 webkitRelativePath（如 "my-project/history/usage.json"），
   * 返回该文件是否属于此助手的用量文件。
   */
  matchFile: (relativePath: string) => boolean;

  /**
   * 解析单个文件的文本内容，返回 DailyEntry[]。
   * 如果文件不含有效数据，返回空数组。
   */
  parseContent: (content: string, fileName: string) => DailyEntry[];

  /** 人类可读的文件匹配模式描述，如 "history/usage.json" */
  filePattern: string;

  /** 该适配器是否已完成接入，true 表示可用，false 表示占位待实现 */
  ready: boolean;
}