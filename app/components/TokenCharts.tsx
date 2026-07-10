'use client';

import type { DailyEntry } from '@/lib/data';
import ReactECharts from 'echarts-for-react';
import { fmt, fmtFull } from './SummaryCards';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from './ui/card';

interface Props {
  data: DailyEntry[];
}

/* ------------------------------------------------------------------ */
/*  light-theme palette                                                */
/* ------------------------------------------------------------------ */

const COLORS = {
  total:  '#2b2b2b',   // slate-800 — 最深，最突出
  input:  '#424242',   // slate-700 — 暗青灰
  calls:  '#525252',   // slate-900 — 近黑，调用次数专用
  output: '#626262',   // slate-600 — 中青灰
  turns:  '#727272',   // slate-500 — 轮次专用
  cache:  '#828282',   // slate-400 — 最浅，缓存自然退后
  grid:   '#e2e8f0',   // slate-200
  text:   '#64748b',   // slate-500
  axis:   '#cbd5e1',   // slate-300
} as const;

/* ------------------------------------------------------------------ */
/*  shared helpers                                                     */
/* ------------------------------------------------------------------ */

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className='border border-gray-200'>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const GRID = { left: 50, right: 20, top: 10, bottom: 30 };

function yAxis() {
  return {
    type: 'value' as const,
    axisLabel: {
      color: COLORS.text,
      fontSize: 11,
      formatter: (v: string | number) => fmt(Number(v)),
    },
    splitLine: { lineStyle: { color: COLORS.grid, type: 'dashed' as const } },
  };
}

function xAxis(labels: string[]) {
  return {
    type: 'category' as const,
    data: labels,
    axisLabel: { color: COLORS.text, fontSize: 11 },
    axisLine: { lineStyle: { color: COLORS.axis } },
    axisTick: { show: false },
  };
}

function barItem(color: string) {
  return {
    color,
    borderRadius: [4, 4, 0, 0],
  };
}

function stackedBarItem(color: string) {
  return {
    color: color,
    borderRadius: 0,
  };
}

function tooltip() {
  return {
    trigger: 'axis' as const,
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    textStyle: { color: '#374151', fontSize: 12 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter(params: any) {
      const items: any[] = Array.isArray(params) ? params : [params];
      const date = items[0]?.axisValue || '';
      return (
        `<div class="font-medium text-gray-900 mb-1">${date}</div>` +
        items
          .map((p) => `${p.marker} ${p.seriesName}: <strong>${fmtFull(p.value)}</strong>`)
          .join('<br/>')
      );
    },
  };
}

function legend() {
  return {
    top: 0,
    textStyle: { color: COLORS.text, fontSize: 12 },
    icon: 'roundRect' as const,
  };
}

/* ------------------------------------------------------------------ */
/*  chart options factory                                              */
/* ------------------------------------------------------------------ */

type EChartsOption = object;

function makeTotalChart(labels: string[], data: DailyEntry[]): EChartsOption {
  return {
    tooltip: tooltip(),
    grid: GRID,
    xAxis: xAxis(labels),
    yAxis: yAxis(),
    series: [
      {
        type: 'bar',
        name: '总量',
        data: data.map((d) => d.total_tokens),
        itemStyle: barItem(COLORS.total),
      },
    ],
  };
}

function makeBreakdownChart(labels: string[], data: DailyEntry[]): EChartsOption {
  return {
    tooltip: tooltip(),
    legend: legend(),
    grid: { ...GRID, top: 30 },
    xAxis: xAxis(labels),
    yAxis: yAxis(),
    series: [
      {
        type: 'bar',
        name: '缓存命中',
        stack: 'total',
        data: data.map((d) => d.cache_read_tokens),
        itemStyle: stackedBarItem(COLORS.cache),
      },
      {
        type: 'bar',
        name: '输入',
        stack: 'total',
        data: data.map((d) => d.input_tokens),
        itemStyle: stackedBarItem(COLORS.input),
      },
      {
        type: 'bar',
        name: '输出',
        stack: 'total',
        data: data.map((d) => d.output_tokens),
        itemStyle: stackedBarItem(COLORS.output),
      },
    ],
  };
}

function makeHitRateChart(labels: string[], data: DailyEntry[]): EChartsOption {
  return {
    tooltip: {
      ...tooltip(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter(params: any) {
        const p = Array.isArray(params) ? params[0] : params;
        return `${p.axisValue}<br/>${p.marker} 命中率: <strong>${(p.value as number).toFixed(1)}%</strong>`;
      },
    },
    grid: GRID,
    xAxis: xAxis(labels),
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      axisLabel: {
        color: COLORS.text,
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: { lineStyle: { color: COLORS.grid, type: 'dashed' as const } },
    },
    series: [
      {
        type: 'line',
        name: '缓存命中率',
        data: data.map((d) => {
          const denom = d.input_tokens + d.cache_read_tokens;
          return denom > 0 ? +((d.cache_read_tokens / denom) * 100).toFixed(1) : 0;
        }),
        smooth: true,
        lineStyle: { color: COLORS.cache, width: 2 },
        itemStyle: { color: COLORS.cache },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(148, 163, 184, 0.25)' },
              { offset: 1, color: 'rgba(148, 163, 184, 0.02)' },
            ],
          },
        },
      },
    ],
  };
}

function makeInputOutputChart(labels: string[], data: DailyEntry[]): EChartsOption {
  return {
    tooltip: tooltip(),
    legend: legend(),
    grid: { ...GRID, top: 30 },
    xAxis: xAxis(labels),
    yAxis: yAxis(),
    series: [
      {
        type: 'bar',
        name: '输入',
        data: data.map((d) => d.input_tokens),
        itemStyle: barItem(COLORS.input),
      },
      {
        type: 'bar',
        name: '输出',
        data: data.map((d) => d.output_tokens),
        itemStyle: barItem(COLORS.output),
      },
    ],
  };
}

function makeCallsTurnsChart(labels: string[], data: DailyEntry[]): EChartsOption {
  return {
    tooltip: tooltip(),
    legend: legend(),
    grid: { left: 50, right: 50, top: 30, bottom: 30 },
    xAxis: xAxis(labels),
    yAxis: [
      yAxis(),
      {
        type: 'value' as const,
        axisLabel: {
          color: COLORS.text,
          fontSize: 11,
          formatter: (v: string | number) => fmt(Number(v)),
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: 'bar',
        name: '调用次数',
        data: data.map((d) => d.provider_calls),
        itemStyle: barItem(COLORS.calls),
      },
      {
        type: 'bar',
        name: '轮次',
        yAxisIndex: 1,
        data: data.map((d) => d.turns_total),
        itemStyle: barItem(COLORS.turns),
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  component                                                          */
/* ------------------------------------------------------------------ */

export function TokenCharts({ data }: Props) {
  if (!data.length) return null;

  const labels = data.map((d) => d.date.slice(5)); // MM-DD

  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))' }}
    >
      <ChartCard title="每日 Token 总量">
        <ReactECharts option={makeTotalChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="Token 构成（输入 + 输出 + 缓存命中）">
        <ReactECharts option={makeBreakdownChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="缓存命中率（%）">
        <ReactECharts option={makeHitRateChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="输入 vs 输出 Token">
        <ReactECharts option={makeInputOutputChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="调用次数与轮次">
        <ReactECharts option={makeCallsTurnsChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>
    </div>
  );
}
