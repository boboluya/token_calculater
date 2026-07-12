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

interface Props {
  directoryName: string | null;
  days: number;
  fileCount: number;
  loading: boolean;
  error: string | null;
  savedAt: number;
  onSelect: () => void;
}

const FLOW_STEPS = [
  '选择包含 history/ 的本地目录',
  '读取 history/usage.json* 文件',
  '聚合结果自动写入浏览器缓存',
];

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
  onSelect,
}: Props) {
  const hasCache = savedAt > 0;
  const status = loading
    ? { label: '正在读取', icon: LoaderCircleIcon, className: 'bg-blue-50 text-blue-700 ring-blue-600/15' }
    : error
      ? { label: '读取失败', icon: TriangleAlertIcon, className: 'bg-rose-50 text-rose-700 ring-rose-600/15' }
      : hasCache
        ? { label: days ? '已缓存' : '暂无数据', icon: days ? CheckCircle2Icon : FilesIcon, className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' }
        : { label: '等待选择', icon: FolderOpenIcon, className: 'bg-amber-50 text-amber-700 ring-amber-600/15' };
  const StatusIcon = status.icon;

  return (
    <Card className="mb-7 gap-0 border-slate-200 bg-white shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
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
                {error ?? (hasCache
                  ? `已从 ${directoryName}/history/ 的 ${fileCount} 个文件汇总 ${days} 天数据。`
                  : '请选择本地目录，解析后的数据将写入浏览器长期缓存，刷新页面或切换标签页后自动恢复。')}
              </p>
              {hasCache && !error && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <ClockIcon className="size-3" />
                  缓存于 {formatSavedAt(savedAt)}
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelect}
            disabled={loading}
            className="self-start border-slate-200 text-slate-700 hover:bg-slate-50 lg:self-auto"
          >
            <FolderOpenIcon className="size-3.5" />
            {hasCache ? '重新选择目录' : '选择目录'}
          </Button>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            {FLOW_STEPS.map((step, index) => (
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