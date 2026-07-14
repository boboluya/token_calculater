'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { DailyEntry } from '@/lib/data';
import { FolderOpenIcon } from 'lucide-react';
import { useUsageData } from '../../components/UsageDataProvider';
import { CostCalculator } from '../../components/CostCalculator';
import { Input } from '../../components/ui/input';
import { ToggleGroup } from '../../components/ui/toggle-group';

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
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        数据加载失败：{error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {scope.title}
          </h1>
          <p className="text-sm text-gray-400">
            用模型单价套算实际 Token 消耗，快速判断成本构成。
          </p>
        </div>

        <ToggleGroup
          options={[
            { value: 'auto', label: '自动汇总' },
            { value: 'manual', label: '手动填写' },
          ]}
          value={isManual ? 'manual' : 'auto'}
          onChange={(v) => setIsManual(v === 'manual')}
        />
      </div>

      {!isManual && (
        <div className="text-sm text-gray-500">
          {directoryName ? (
            <span>
              数据来源{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-700">
                {directoryName}/...（{assistantId}）
              </code>
            </span>
          ) : (
            <button
              type="button"
              onClick={selectDirectory}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <FolderOpenIcon className="size-3.5" />
              选择本地目录
            </button>
          )}
        </div>
      )}

      {isManual && (
        <div className="flex flex-wrap items-end gap-3">
          {(Object.keys(TOKEN_LABELS) as TokenField[]).map((field) => (
            <label key={field} className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                {TOKEN_LABELS[field].label}
              </span>
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
                className="w-40 font-mono"
              />
            </label>
          ))}
        </div>
      )}

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