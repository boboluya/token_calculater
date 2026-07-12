'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { DailyEntry } from '@/lib/data';
import {
  CheckCircle2Icon,
  FileJsonIcon,
  FolderOpenIcon,
  PencilLineIcon,
} from 'lucide-react';
import { useUsageData } from '../../components/UsageDataProvider';
import { CostCalculator } from '../../components/CostCalculator';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';

type TokenField = 'input' | 'output' | 'cache';

interface Totals {
  input: number;
  output: number;
  cache: number;
}

const TOKEN_LABELS: Record<TokenField, { label: string; hint: string }> = {
  cache: { label: '缓存命中', hint: 'cache_read_tokens' },
  input: { label: '输入', hint: 'input_tokens' },
  output: { label: '输出', hint: 'output_tokens' },
};

function sumDailyEntries(entries: DailyEntry[]) {
  return entries.reduce(
    (acc, d) => ({
      input: acc.input + d.input_tokens,
      output: acc.output + d.output_tokens,
      cache: acc.cache + d.cache_read_tokens,
    }),
    { input: 0, output: 0, cache: 0 },
  );
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const { data, loading, error, directoryName, assistantId, selectDirectory } = useUsageData();

  const [isManual, setIsManual] = useState(false);
  const [manualTokens, setManualTokens] = useState<Totals>({ input: 0, output: 0, cache: 0 });

  const filtered = useMemo(
    () => (dateParam ? data.filter((d) => d.date === dateParam) : data),
    [data, dateParam],
  );

  const autoTotals = useMemo(() => sumDailyEntries(filtered), [filtered]);

  const scope = useMemo(() => {
    if (isManual) {
      return {
        title: '成本估算',
        label: '手动输入',
        detail: '手动输入 Token 用量进行估算',
        days: 0,
      };
    }

    if (dateParam) {
      return {
        title: `成本估算 — ${dateParam}`,
        label: dateParam,
        detail: filtered.length ? '单日 Token 用量' : '未找到这一天的数据',
        days: filtered.length,
      };
    }

    if (!filtered.length) {
      return {
        title: '成本估算',
        label: '暂无数据',
        detail: '还没有可用于估算的 Token 用量',
        days: 0,
      };
    }

    const start = filtered[0].date;
    const end = filtered[filtered.length - 1].date;

    return {
      title: '成本估算',
      label: `${filtered.length} 天汇总`,
      detail: `${start} – ${end}`,
      days: filtered.length,
    };
  }, [dateParam, filtered, isManual]);

  const totals = isManual ? manualTokens : autoTotals;

  const updateManualToken = (field: TokenField, value: number) => {
    setManualTokens((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center text-sm">加载中...</div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 text-red-600">
        <CardContent>数据加载失败：{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {scope.title}
        </h1>
        <p className="text-sm text-gray-400">
          用模型单价套算实际 Token 消耗，快速判断成本构成。
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div>
            <CardTitle className="text-base">Token 数据来源</CardTitle>
            <CardDescription>
              选择本次成本估算使用的用量数据。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              aria-pressed={!isManual}
              onClick={() => setIsManual(false)}
              className={`rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                !isManual
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-950/15'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${!isManual ? 'bg-white/15' : 'bg-slate-100 text-slate-700'}`}>
                  <FileJsonIcon className="size-4" />
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold">
                    自动汇总本地记录
                    {!isManual && <CheckCircle2Icon className="size-4" />}
                  </span>
                  <span className={`mt-1 block text-sm ${!isManual ? 'text-slate-300' : 'text-slate-500'}`}>
                    使用已选择目录的用量记录，按日期合并全部 Token 用量。
                  </span>
                </span>
              </div>
            </button>

            <button
              type="button"
              aria-pressed={isManual}
              onClick={() => setIsManual(true)}
              className={`rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isManual
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-950/15'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${isManual ? 'bg-white/15' : 'bg-slate-100 text-slate-700'}`}>
                  <PencilLineIcon className="size-4" />
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold">
                    手动填写 Token
                    {isManual && <CheckCircle2Icon className="size-4" />}
                  </span>
                  <span className={`mt-1 block text-sm ${isManual ? 'text-slate-300' : 'text-slate-500'}`}>
                    输入任意 Token 数量，用于预估单次任务或尚未写入本地记录的用量。
                  </span>
                </span>
              </div>
            </button>
          </div>

          {!isManual && (
            <div className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
              {directoryName ? (
                <>
                  数据来源：<code className="font-mono text-xs text-slate-800">{directoryName}/...（{assistantId}）</code>
                </>
              ) : (
                <button
                  type="button"
                  onClick={selectDirectory}
                  className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
                >
                  <FolderOpenIcon className="size-3.5" />
                  选择本地目录
                </button>
              )}
            </div>
          )}

          {isManual && (
            <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
              {(Object.keys(TOKEN_LABELS) as TokenField[]).map((field) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {TOKEN_LABELS[field].label}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={manualTokens[field] || ''}
                    placeholder={TOKEN_LABELS[field].hint}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateManualToken(field, v === '' ? 0 : parseInt(v, 10));
                    }}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CostCalculator totals={totals} scope={scope} />
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 py-10 text-center text-sm">Loading...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}