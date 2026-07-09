'use client';

import { useState, useEffect } from 'react';
import type { DailyEntry } from '@/lib/data';
import { SummaryCards } from './SummaryCards';
import { TokenCharts } from './TokenCharts';

interface Props {
  initialData: DailyEntry[];
}

export function Dashboard({ initialData }: Props) {
  const [data, setData] = useState<DailyEntry[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData.length > 0) return;

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
  }, [initialData]);

  if (loading) {
    return (
      <div className="text-gray-400 py-10 text-center text-sm">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 border border-red-200 bg-red-50 p-4 rounded-xl text-sm">
        数据加载失败：{error}
      </div>
    );
  }

  return (
    <>
      <SummaryCards data={data} />
      <TokenCharts data={data} />
    </>
  );
}