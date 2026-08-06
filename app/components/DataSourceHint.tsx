'use client';

import Link from 'next/link';
import { FolderOpenIcon } from 'lucide-react';
import { getAssistantSource } from '@/lib/assistants';
import { useUsageData } from './UsageDataProvider';

/**
 * 当前展示数据的来源提示。汇总模式下列出真正参与合并的数据源，
 * 避免页面上是多来源汇总的数字、文案却指向单个 agent。
 */
export function DataSourceHint({ className = '' }: { className?: string }) {
  const {
    directoryName,
    assistantId,
    selectDirectory,
    aggregationMode,
    aggregationSources,
  } = useUsageData();

  const wrapperClass = `text-sm text-gray-500 ${className}`.trim();

  if (aggregationMode) {
    if (aggregationSources.length === 0) {
      return (
        <div className={wrapperClass}>
          汇总模式下还没有可用的缓存数据，请先到{' '}
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
            看板页
          </Link>{' '}
          分别导入各数据源目录。
        </div>
      );
    }

    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 ${wrapperClass}`}>
        <span>数据来源 · 汇总 {aggregationSources.length} 个来源</span>
        {aggregationSources.map((source) => (
          <code
            key={source.id}
            title={`${source.directoryName}/...（${source.days} 天）`}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-700"
          >
            {source.name}
          </code>
        ))}
      </div>
    );
  }

  const assistantName = getAssistantSource(assistantId)?.name ?? assistantId;

  return (
    <div className={wrapperClass}>
      {directoryName ? (
        <span>
          数据来源{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-700">
            {directoryName}/...（{assistantName}）
          </code>
        </span>
      ) : (
        <button
          type="button"
          onClick={selectDirectory}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
        >
          <FolderOpenIcon className="size-3.5" />
          选择本地目录
        </button>
      )}
    </div>
  );
}
