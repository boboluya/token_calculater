'use client';

import { useState, useEffect } from 'react';
import type { DailyEntry } from '@/lib/data';
import { SummaryCards } from './SummaryCards';
import { TokenCharts } from './TokenCharts';
import { UsageDataSource } from './UsageDataSource';

interface Props {
  initialData: DailyEntry[] | null;
}

const getDailyData = async (): Promise<DailyEntry[]> => {
  const response = await fetch('/api/daily', { cache: 'no-store' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
};

export function Dashboard({ initialData }: Props) {
  const [data, setData] = useState<DailyEntry[]>(initialData ?? []);
  const [loading, setLoading] = useState(initialData === null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData !== null) return;

    getDailyData()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [initialData]);

  const refreshData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      setData(await getDailyData());
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        数据加载失败：{error}
      </div>
    );
  }

  return (
    <>
      <UsageDataSource
        configured={initialData !== null}
        days={data.length}
        refreshing={refreshing}
        onRefresh={refreshData}
      />
      <SummaryCards data={data} />
      <TokenCharts data={data} />
    </>
  );
}