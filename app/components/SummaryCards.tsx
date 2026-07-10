"use client";

import type { DailyEntry } from "@/lib/data";
import { Card, CardContent } from "./ui/card";

export function fmt(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export function fmtFull(num: number): string {
  return num.toLocaleString("en-US");
}

interface Props {
  data: DailyEntry[];
}

export function SummaryCards({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-red-200 bg-red-50 text-red-600">
      <CardContent>暂无每日数据。</CardContent>
    </Card>
    );
  }

  const total = data.reduce(
    (acc, d) => ({
      input: acc.input + d.input_tokens,
      output: acc.output + d.output_tokens,
      cache: acc.cache + d.cache_read_tokens,
      totalTokens: acc.totalTokens + d.total_tokens,
      calls: acc.calls + d.provider_calls,
      turns: acc.turns + d.turns_total,
    }),
    { input: 0, output: 0, cache: 0, totalTokens: 0, calls: 0, turns: 0 },
  );

  const days = data.length;
  const avg = total.totalTokens / days;

  const stats = [
    {
      label: "天数",
      value: days.toString(),
      sub: `${data[0].date} – ${data[data.length - 1].date}`,
    },
    {
      label: "Token 总量",
      value: fmt(total.totalTokens),
      sub: `${fmtFull(total.totalTokens)} tokens`,
    },
    {
      label: "日均",
      value: fmt(avg),
      sub: "tokens / 天",
    },
    {
      label: "输入",
      value: fmt(total.input),
      sub: `占比 ${((total.input / total.totalTokens) * 100).toFixed(0)}%`,
    },
    {
      label: "输出",
      value: fmt(total.output),
      sub: `占比 ${((total.output / total.totalTokens) * 100).toFixed(0)}%`,
    },
    {
      label: "缓存命中",
      value: fmt(total.cache),
      sub: `占比 ${((total.cache / total.totalTokens) * 100).toFixed(0)}%`,
    },
    {
      label: "调用次数",
      value: fmtFull(total.calls),
      sub: "次调用",
    },
    {
      label: "轮次",
      value: fmtFull(total.turns),
      sub: "总轮次",
    },
  ];

  return (
    <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
      {stats.map((s) => (
        <Card key={s.label} className="gap-0 px-4 py-3.5 shadow-none">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {s.label}
          </div>
          <div className="text-xl font-bold text-foreground mt-1">
            {s.value}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
        </Card>
      ))}
    </div>
  );
}