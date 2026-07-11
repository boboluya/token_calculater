'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { DailyEntry } from '@/lib/data';
import { CostCalculator } from '../../components/CostCalculator';

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

  const [data, setData] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/daily')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => (dateParam ? data.filter((d) => d.date === dateParam) : data),
    [data, dateParam],
  );

  const scope = useMemo(() => {
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
  }, [dateParam, filtered]);

  const totals = useMemo(() => sumDailyEntries(filtered), [filtered]);

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