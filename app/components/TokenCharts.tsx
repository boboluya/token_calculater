'use client';

import type { DailyEntry } from '@/lib/data';
import type { AssistantCapabilities } from '@/lib/assistants';
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
  capabilities: AssistantCapabilities;
}

/* ------------------------------------------------------------------ */
/*  chart palette: Material 3 inspired Morandi tones                  */
/* ------------------------------------------------------------------ */

const COLORS = {
  total: '#667D8A',   // 雾蓝：核心总量
  input: '#718C84',   // 灰青：流入
  output: '#A48770',  // 陶土灰：流出
  cache: '#82788F',   // 灰紫：缓存
  calls: '#9A747A',   // 豆沙：调用
  turns: '#73869B',   // 蓝灰：轮次
  grid: '#E6E2E5',
  text: '#6E6A70',
  axis: '#CBC7CC',
  surface: '#FFFBFE',
  surfaceMuted: '#F3EFF2',
  tooltipText: '#49454F',
  totalSoft: 'rgba(102, 125, 138, 0.16)',
  totalArea: 'rgba(102, 125, 138, 0.2)',
  cacheAreaStrong: 'rgba(130, 120, 143, 0.3)',
  cacheAreaSoft: 'rgba(130, 120, 143, 0.03)',
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

const GRID = { left: 50, right: 20, top: 10, bottom: 55 };

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

interface TooltipItem {
  axisValue?: string;
  marker?: string;
  seriesName?: string;
  value: number;
}

function tooltip() {
  return {
    trigger: 'axis' as const,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.axis,
    textStyle: { color: COLORS.tooltipText, fontSize: 12 },
    formatter(params: TooltipItem | TooltipItem[]) {
      const items = Array.isArray(params) ? params : [params];
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

/* dataZoom：inside（滚轮/拖拽） + slider（底部滑块条） */
function dataZoomConfig() {
  return [
    {
      type: 'inside' as const,
      start: 0,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
    },
    {
      type: 'slider' as const,
      bottom: 0,
      height: 24,
      start: 0,
      end: 100,
      borderColor: COLORS.grid,
      fillerColor: COLORS.totalSoft,
      dataBackground: {
        lineStyle: { color: COLORS.axis },
        areaStyle: { color: COLORS.surfaceMuted },
      },
      selectedDataBackground: {
        lineStyle: { color: COLORS.total },
        areaStyle: { color: COLORS.totalArea },
      },
      handleStyle: {
        color: COLORS.surface,
        borderColor: COLORS.total,
        borderWidth: 1,
      },
      moveHandleStyle: { color: COLORS.total, opacity: 0.45 },
      emphasis: {
        handleStyle: { color: COLORS.total, borderColor: COLORS.total },
        moveHandleStyle: { color: COLORS.total, opacity: 0.7 },
      },
      textStyle: { color: COLORS.text, fontSize: 10 },
    },
  ];
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
    dataZoom: dataZoomConfig(),
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
    dataZoom: dataZoomConfig(),
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
    dataZoom: dataZoomConfig(),
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
              { offset: 0, color: COLORS.cacheAreaStrong },
              { offset: 1, color: COLORS.cacheAreaSoft },
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
    dataZoom: dataZoomConfig(),
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

function makeActivityChart(
  labels: string[],
  data: DailyEntry[],
  capabilities: AssistantCapabilities,
): EChartsOption {
  const series = [
    ...(capabilities.calls
      ? [{
          type: 'bar' as const,
          name: capabilities.callsLabel,
          data: data.map((d) => d.provider_calls),
          itemStyle: barItem(COLORS.calls),
        }]
      : []),
    ...(capabilities.turns
      ? [{
          type: 'bar' as const,
          name: '轮次',
          yAxisIndex: capabilities.calls ? 1 : 0,
          data: data.map((d) => d.turns_total),
          itemStyle: barItem(COLORS.turns),
        }]
      : []),
  ];

  return {
    tooltip: tooltip(),
    legend: legend(),
    grid: { left: 50, right: capabilities.turns && capabilities.calls ? 50 : 20, top: 30, bottom: 55 },
    xAxis: xAxis(labels),
    dataZoom: dataZoomConfig(),
    yAxis: capabilities.turns && capabilities.calls
      ? [
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
        ]
      : yAxis(),
    series,
  };
}

/* ------------------------------------------------------------------ */
/*  component                                                          */
/* ------------------------------------------------------------------ */

export function TokenCharts({ data, capabilities }: Props) {
  const labels = data.map((d) => d.date.slice(5)); // MM-DD
  const activityTitle = capabilities.turns
    ? `${capabilities.callsLabel}与轮次`
    : capabilities.callsLabel;

  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))' }}
    >
      <ChartCard title="每日 Token 总量">
        <ReactECharts option={makeTotalChart(labels, data)} style={{ height: 300 }} />
      </ChartCard>

      {capabilities.tokenBreakdown && (
        <>
          <ChartCard title="Token 构成（输入 + 输出 + 缓存命中）">
            <ReactECharts option={makeBreakdownChart(labels, data)} style={{ height: 300 }} />
          </ChartCard>

          <ChartCard title="缓存命中率（%）">
            <ReactECharts option={makeHitRateChart(labels, data)} style={{ height: 300 }} />
          </ChartCard>

          <ChartCard title="输入 vs 输出 Token">
            <ReactECharts option={makeInputOutputChart(labels, data)} style={{ height: 300 }} />
          </ChartCard>
        </>
      )}

      {(capabilities.calls || capabilities.turns) && (
        <ChartCard title={activityTitle}>
          <ReactECharts
            option={makeActivityChart(labels, data, capabilities)}
            style={{ height: 300 }}
          />
        </ChartCard>
      )}
    </div>
  );
}
