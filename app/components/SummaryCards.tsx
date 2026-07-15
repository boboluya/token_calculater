"use client";

import type { DailyEntry } from "@/lib/data";
import type { AssistantCapabilities } from "@/lib/assistants";
import { Card } from "./ui/card";

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
  capabilities: AssistantCapabilities;
}

const percent = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

export function SummaryCards({ data, capabilities }: Props) {
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
  const averagePerDay = days > 0 ? total.totalTokens / days : 0;
  const averagePerCall = total.calls > 0 ? total.totalTokens / total.calls : null;
  const dateRange = days > 0
    ? `${data[0].date} ~ ${data[data.length - 1].date}`
    : "暂无数据";
  const compositionTotal = total.input + total.cache + total.output;
  const composition = [
    {
      label: "网络输入",
      qualifier: "Uncached",
      value: total.input,
      share: percent(total.input, compositionTotal),
      color: "bg-sky-500",
    },
    {
      label: "缓存命中",
      qualifier: "免计费",
      value: total.cache,
      share: percent(total.cache, compositionTotal),
      color: "bg-emerald-500",
    },
    {
      label: "输出",
      qualifier: "模型生成",
      value: total.output,
      share: percent(total.output, compositionTotal),
      color: "bg-amber-500",
    },
  ];
  const cacheHitRate = percent(total.cache, compositionTotal);
  const behaviorStats = [
    ...(capabilities.calls
      ? [{
          label: capabilities.callsLabel,
          value: fmtFull(total.calls),
          unit: capabilities.callsLabel === "会话数" ? "个会话" : "次调用",
        }]
      : []),
    ...(capabilities.turns
      ? [{ label: "对话轮次", value: fmtFull(total.turns), unit: "轮" }]
      : []),
    ...(capabilities.calls
      ? [{
          label: "单次调用平均",
          value: averagePerCall === null ? "—" : fmt(averagePerCall),
          unit: "tokens",
        }]
      : []),
  ];

  return (
    <div className="mb-6 space-y-4">
      <Card className="gap-0 rounded-lg p-0 shadow-none">
        <div className={`grid ${capabilities.tokenBreakdown ? "lg:grid-cols-2" : "grid-cols-1"}`}>
          <section className="min-w-0 px-5 py-5 sm:px-7 sm:py-6">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Token 总消耗量
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
              {fmt(total.totalTokens)}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span>
                日均 <strong className="font-semibold text-foreground">{fmt(averagePerDay)}</strong> / 天
              </span>
              <span>
                统计 <strong className="font-semibold text-foreground">{days}</strong> 天
              </span>
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">{dateRange}</div>
          </section>

          {capabilities.tokenBreakdown && (
            <section className="border-t border-border bg-emerald-50/60 px-5 py-5 sm:px-7 sm:py-6 lg:border-l lg:border-t-0">
              <div className="text-xs font-semibold uppercase text-emerald-700">
                缓存命中率
              </div>
              <div className="mt-2 text-4xl font-bold tabular-nums text-emerald-700 sm:text-5xl">
                {cacheHitRate.toFixed(1)}%
              </div>
              <div className="mt-4 text-sm text-emerald-800/75">
                已省 Token
                <strong className="ml-2 font-semibold tabular-nums text-emerald-800">
                  {fmt(total.cache)}
                </strong>
              </div>
            </section>
          )}
        </div>
      </Card>

      {capabilities.tokenBreakdown && (
        <Card className="gap-0 rounded-lg px-5 py-5 shadow-none sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Token 构成</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                网络输入、缓存读取与模型输出的分布
              </p>
            </div>
            <div className="hidden text-xs tabular-nums text-muted-foreground sm:block">
              合计 {fmt(compositionTotal)}
            </div>
          </div>

          <div className="mt-5 grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {composition.map((item, index) => (
              <div
                key={item.label}
                className={`min-w-0 py-4 sm:py-0 ${index === 0 ? "sm:pr-5" : "sm:px-5"}`}
              >
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className={`size-2 shrink-0 rounded-sm ${item.color}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  <span className="text-muted-foreground/70">({item.qualifier})</span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {fmt(item.value)}
                  </span>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {item.share.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-5 flex h-2.5 w-full overflow-hidden rounded-sm bg-muted"
            role="img"
            aria-label={composition
              .map((item) => `${item.label} ${item.share.toFixed(1)}%`)
              .join("，")}
          >
            {composition.map((item) => (
              <div
                key={item.label}
                className={`${item.color} min-w-px first:rounded-l-sm last:rounded-r-sm`}
                style={{ width: `${item.share}%` }}
              />
            ))}
          </div>
        </Card>
      )}

      {behaviorStats.length > 0 && (
        <section aria-labelledby="behavior-metrics-title">
          <h2 id="behavior-metrics-title" className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            行为频次
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {behaviorStats.map((item) => (
              <Card key={item.label} className="gap-0 rounded-lg px-4 py-3.5 shadow-none">
                <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xl font-bold tabular-nums text-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground">{item.unit}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}