"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DailyEntry } from "@/lib/data";
import { fmt, fmtFull } from "../../components/SummaryCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Column {
  key: string;
  label: string;
  className?: string;
  fmt: (d: DailyEntry) => string;
}

const EMPTY_TOTALS: DailyEntry = {
  date: "",
  provider_calls: 0,
  turns_total: 0,
  input_tokens: 0,
  output_tokens: 0,
  cache_read_tokens: 0,
  total_tokens: 0,
};

function hitRateFmt(
  d: Pick<DailyEntry, "input_tokens" | "cache_read_tokens">,
): string {
  const denom = d.input_tokens + d.cache_read_tokens;
  if (denom === 0) return "-";

  return `${((d.cache_read_tokens / denom) * 100).toFixed(1)}%`;
}

function sumEntries(entries: DailyEntry[]): DailyEntry {
  return entries.reduce(
    (acc, d) => ({
      date: acc.date,
      provider_calls: acc.provider_calls + d.provider_calls,
      turns_total: acc.turns_total + d.turns_total,
      input_tokens: acc.input_tokens + d.input_tokens,
      output_tokens: acc.output_tokens + d.output_tokens,
      cache_read_tokens: acc.cache_read_tokens + d.cache_read_tokens,
      total_tokens: acc.total_tokens + d.total_tokens,
    }),
    EMPTY_TOTALS,
  );
}

function formatDateLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${month}.${day}`;
}

const COLUMNS: Column[] = [
  {
    key: "provider_calls",
    label: "调用",
    className: "text-right",
    fmt: (d) => fmtFull(d.provider_calls),
  },
  {
    key: "turns_total",
    label: "轮次",
    className: "text-right",
    fmt: (d) => fmtFull(d.turns_total),
  },
  {
    key: "input_tokens",
    label: "输入",
    className: "text-right",
    fmt: (d) => fmt(d.input_tokens),
  },
  {
    key: "output_tokens",
    label: "输出",
    className: "text-right",
    fmt: (d) => fmt(d.output_tokens),
  },
  {
    key: "cache_read_tokens",
    label: "缓存",
    className: "text-right",
    fmt: (d) => fmt(d.cache_read_tokens),
  },
  {
    key: "hit_rate",
    label: "命中率",
    className: "text-right",
    fmt: hitRateFmt,
  },
  {
    key: "total_tokens",
    label: "总量",
    className: "text-right font-semibold text-gray-900",
    fmt: (d) => fmt(d.total_tokens),
  },
];

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="gap-0 px-4 py-3.5">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xl font-bold text-foreground mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </Card>
  );
}

function EmptyState({ selectedMonth }: { selectedMonth: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>没有可展示的数据</CardTitle>
        <CardDescription>
          {selectedMonth
            ? `当前数据集中没有 ${selectedMonth} 的记录。`
            : "当前数据源没有返回每日用量。"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function TablePage() {
  const [data, setData] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/daily")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json() as Promise<DailyEntry[]>;
      })
      .then((d) => {
        if (!active) return;
        setData(d);
      })
      .catch((e: Error) => {
        if (!active) return;
        setError(e.message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const months = useMemo(() => {
    const s = new Set(data.map((d) => d.date.substring(0, 7)));
    return Array.from(s).sort().reverse();
  }, [data]);

  useEffect(() => {
    if (months.length && !selectedMonth) {
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      setSelectedMonth(months.includes(ym) ? ym : months[0]);
    }
  }, [months, selectedMonth]);

  const monthEntries = useMemo(
    () =>
      selectedMonth
        ? data.filter((d) => d.date.startsWith(`${selectedMonth}-`))
        : [],
    [data, selectedMonth],
  );

  const displayEntries = useMemo(
    () => [...monthEntries].reverse(),
    [monthEntries],
  );
  const totals = useMemo(() => sumEntries(monthEntries), [monthEntries]);
  const avgDailyTokens = monthEntries.length
    ? totals.total_tokens / monthEntries.length
    : 0;
  const peakDay = monthEntries.reduce<DailyEntry | null>(
    (peak, entry) =>
      !peak || entry.total_tokens > peak.total_tokens ? entry : peak,
    null,
  );
  const periodLabel = monthEntries.length
    ? `${monthEntries[0].date} – ${monthEntries[monthEntries.length - 1].date}`
    : selectedMonth || "暂无月份";

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            用量明细
          </h1>
          <p className="text-sm text-gray-400">
            按月份查看每日 Token 用量，点击估算可跳转计算当日花费。
          </p>
        </div>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {monthEntries.length === 0 ? (
        <EmptyState selectedMonth={selectedMonth} />
      ) : (
        <>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            <SummaryCard
              label="月度总量"
              value={fmt(totals.total_tokens)}
              sub={`${fmtFull(totals.total_tokens)} tokens`}
            />
            <SummaryCard
              label="天数"
              value={monthEntries.length.toString()}
              sub={periodLabel}
            />
            <SummaryCard
              label="日均"
              value={fmt(avgDailyTokens)}
              sub="tokens / 天"
            />
            <SummaryCard
              label="缓存命中"
              value={hitRateFmt(totals)}
              sub={`${fmt(totals.cache_read_tokens)} cache tokens`}
            />
            <SummaryCard
              label="峰值日期"
              value={peakDay ? formatDateLabel(peakDay.date) : "-"}
              sub={peakDay ? `${fmt(peakDay.total_tokens)} tokens` : "暂无峰值"}
            />
          </div>

          <Card className="overflow-hidden p-0">
            <CardHeader className="border-b border-gray-100 px-4 py-3">
              <CardTitle className="text-sm">每日明细</CardTitle>
              <CardDescription>
                最新日期在上方，底部保留当前月份合计。
              </CardDescription>
            </CardHeader>

            <Table className="min-w-[880px]">
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>日期</TableHead>
                  {COLUMNS.map((col) => (
                    <TableHead key={col.key} className={col.className ?? ""}>
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayEntries.map((entry) => (
                  <TableRow key={entry.date}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {formatDateLabel(entry.date)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {entry.date}
                      </div>
                    </TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`tabular-nums ${col.className ?? ""}`}
                      >
                        {col.fmt(entry)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Link
                        href={`/calculator?date=${entry.date}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        估算花费
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="border-t-2 border-blue-100 bg-blue-50/50 font-semibold">
                  <TableCell className="text-foreground">月度合计</TableCell>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col.key}
                      className={`tabular-nums ${col.className ?? ""}`}
                    >
                      {col.fmt(totals)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {monthEntries.length} 天
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
