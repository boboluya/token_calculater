'use client';

import {
  CheckCircle2Icon,
  FilesIcon,
  FolderSearch2Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  configured: boolean;
  days: number;
  refreshing: boolean;
  onRefresh: () => void;
}

const FLOW_STEPS = [
  '扫描 USAGE_DATA_DIR 指向的目录',
  '匹配 usage.json 与 usage.json* 文件',
  '按日期合并后生成图表与汇总',
];

export function UsageDataSource({ configured, days, refreshing, onRefresh }: Props) {
  const hasData = days > 0;
  const status = configured
    ? hasData
      ? { label: '已同步', icon: CheckCircle2Icon, className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' }
      : { label: '等待数据', icon: FilesIcon, className: 'bg-amber-50 text-amber-700 ring-amber-600/15' }
    : { label: '需要配置', icon: TriangleAlertIcon, className: 'bg-rose-50 text-rose-700 ring-rose-600/15' };
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
                  <StatusIcon className="size-3" />
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {configured
                  ? hasData
                    ? `已从本地 usage.json 文件汇总 ${days} 天数据。`
                    : '已连接数据目录，但尚未找到可汇总的 usage.json 文件。'
                  : '尚未配置数据目录，因此当前没有可展示的用量记录。'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="self-start border-slate-200 text-slate-700 hover:bg-slate-50 lg:self-auto"
          >
            <RefreshCwIcon className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '正在刷新' : '重新扫描'}
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
          {!configured && (
            <p className="mt-3 border-t border-slate-200 pt-3 font-mono text-xs text-slate-500">
              在运行环境中设置 USAGE_DATA_DIR 后刷新页面。
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}