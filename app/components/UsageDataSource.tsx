'use client';

import {
  CheckCircle2Icon,
  ClockIcon,
  FilesIcon,
  FolderOpenIcon,
  FolderSearch2Icon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ALL_ADAPTERS, getAdapter } from '@/lib/assistants';

/** 每个适配器的品牌图标，按 adapter.id 匹配 public/provider_icon/ 下的文件名 */
const ADAPTER_ICON_URL: Record<string, string> = {
  cursor: '/provider_icon/cursor.png',
  'claude-code': '/provider_icon/claudecode.png',
  codex: '/provider_icon/openai.svg',
  opencode: '/provider_icon/opencode.ico',
};

interface Props {
  directoryName: string | null;
  days: number;
  fileCount: number;
  loading: boolean;
  error: string | null;
  savedAt: number;
  assistantId: string;
  onAssistantChange: (id: string) => void;
  onSelect: () => void;
}

function formatSavedAt(ms: number) {
  if (!ms) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function UsageDataSource({
  directoryName,
  days,
  fileCount,
  loading,
  error,
  savedAt,
  assistantId,
  onAssistantChange,
  onSelect,
}: Props) {
  const adapter = getAdapter(assistantId);

  const hasCache = savedAt > 0;
  const status = loading
    ? { label: '正在读取', icon: LoaderCircleIcon, className: 'bg-blue-50 text-blue-700 ring-blue-600/15' }
    : error
      ? { label: '读取失败', icon: TriangleAlertIcon, className: 'bg-rose-50 text-rose-700 ring-rose-600/15' }
      : hasCache
        ? { label: days ? '已缓存' : '暂无数据', icon: days ? CheckCircle2Icon : FilesIcon, className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' }
        : { label: '等待选择', icon: FolderOpenIcon, className: 'bg-amber-50 text-amber-700 ring-amber-600/15' };
  const StatusIcon = status.icon;

  const adapterName = adapter?.name ?? '未知';

  const flowSteps = [
    `选择 ${adapterName} 的本地数据目录`,
    `按 ${adapter?.filePattern ?? '...'} 匹配用量文件`,
    '聚合结果自动写入浏览器缓存',
  ];

  const statusText = error ?? (hasCache
    ? `已从 ${directoryName}/ 的 ${fileCount} 个文件汇总 ${days} 天数据（${adapterName}）。`
    : `请选择 ${adapterName} 的本地目录，解析后的数据将写入浏览器长期缓存。`);

  return (
    <Card className="mb-7 gap-0 border-slate-200 bg-white shadow-none">
      <CardContent className="p-0">

        {/* ── 助手图标选择行 ── */}
        <div className="px-5 py-4 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            数据来源
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_ADAPTERS.map((a) => {
              const iconUrl = ADAPTER_ICON_URL[a.id];
              const selected = a.id === assistantId;
              const isReady = a.ready;

              if (!isReady) {
                // 未实现的适配器：灰显、不可点击
                return (
                  <span
                    key={a.id}
                    title={a.description}
                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-slate-150 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-350"
                  >
                    {iconUrl && (
                      <img src={iconUrl} alt={a.name} className="size-4 opacity-40" />
                    )}
                    {a.name}
                    <span className="ml-0.5 rounded bg-slate-200 px-1 py-px text-[10px] text-slate-500">
                      待实现
                    </span>
                  </span>
                );
              }

              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onAssistantChange(a.id)}
                  title={a.description}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/15'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {iconUrl && (
                    <img src={iconUrl} alt={a.name} className="size-4" />
                  )}
                  {a.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-slate-400">
            当前仅 <strong className="text-slate-500">Cursor 助手</strong>（~/.cursor-local-assistant-v2）已完成接入，其余待实现。
          </p>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── 状态信息 + 目录按钮 ── */}
        <div className="flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
              <FolderSearch2Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-950">本地用量数据</h2>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${status.className}`}>
                  <StatusIcon className={`size-3 ${loading ? 'animate-spin' : ''}`} />
                  {status.label}
                </span>
              </div>
              <p className={`mt-1 text-sm ${error ? 'text-rose-600' : 'text-slate-500'}`}>
                {statusText}
              </p>
              {hasCache && !error && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <ClockIcon className="size-3" />
                  缓存于 {formatSavedAt(savedAt)}
                </p>
              )}
            </div>
          </div>

          <div className="self-start lg:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelect}
              disabled={loading}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <FolderOpenIcon className="size-3.5" />
              {hasCache ? '重新选择目录' : '选择目录'}
            </Button>
          </div>
        </div>

        {/* ── 流程步骤 ── */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            {flowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}