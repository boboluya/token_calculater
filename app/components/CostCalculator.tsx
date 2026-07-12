'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PRICE_PRESET_ID, FALLBACK_PRICE_PRESETS } from '@/lib/pricing/fallback';
import type {
  PricePreset,
  PricingResponse,
  UnitPrices,
  UsageKind,
} from '@/lib/pricing/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { Input } from './ui/input';

type Currency = 'USD' | 'CNY';

interface Totals {
  input: number;
  output: number;
  cache: number;
}

interface Scope {
  label: string;
  detail: string;
  days: number;
}

interface CostRow {
  key: UsageKind;
  label: string;
  hint: string;
  color: string;
  tokens: number;
  tokensM: number;
  unitPrice: number;
  cost: number;
  ratio: number;
}

interface Props {
  totals: Totals;
  scope: Scope;
}

interface PricingStatus {
  status: 'loading' | 'ready' | 'fallback';
  source: 'postgres' | 'fallback';
  updatedAt?: string;
  stale?: boolean;
  error?: string;
}

const DEFAULT_RATE = 6.79;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
};

const ROW_META: Record<UsageKind, Pick<CostRow, 'label' | 'hint' | 'color'>> = {
  cache: {
    label: '缓存命中',
    hint: '复用上下文',
    color: 'bg-amber-500',
  },
  input: {
    label: '输入未缓存',
    hint: '按输入单价计费的请求 Token',
    color: 'bg-blue-500',
  },
  cache_write: {
    label: '缓存写入',
    hint: '将未缓存内容写入缓存',
    color: 'bg-purple-500',
  },
  output: {
    label: '输出',
    hint: '模型生成内容',
    color: 'bg-emerald-500',
  },
};

function buildVendorGroups(presets: PricePreset[]): [string, PricePreset[]][] {
  const groups = new Map<string, PricePreset[]>();

  for (const preset of presets) {
    groups.set(preset.vendor, [...(groups.get(preset.vendor) ?? []), preset]);
  }

  return [...groups.entries()];
}

function indexPresets(presets: PricePreset[]) {
  return new Map(presets.map((preset) => [preset.id, preset]));
}

function mergePresets(base: PricePreset[], next: PricePreset[]) {
  const merged = new Map(base.map((preset) => [preset.id, preset]));

  for (const preset of next) {
    merged.set(preset.id, preset);
  }

  return [...merged.values()];
}

function presetToUnitPrices(preset: PricePreset, currency: Currency, rate: number): UnitPrices {
  const multiplier = currency === 'USD' ? 1 : rate;

  return {
    cache: roundPrice(preset.pricesUsdPer1M.cache * multiplier),
    input: roundPrice(preset.pricesUsdPer1M.input * multiplier),
    output: roundPrice(preset.pricesUsdPer1M.output * multiplier),
    cache_write: roundPrice(preset.pricesUsdPer1M.cache_write * multiplier),
  };
}

function convertUnitPrices(prices: UnitPrices, from: Currency, to: Currency, rate: number): UnitPrices {
  if (from === to) return prices;
  const multiplier = to === 'USD' ? 1 / rate : rate;

  return {
    cache: roundPrice(prices.cache * multiplier),
    input: roundPrice(prices.input * multiplier),
    output: roundPrice(prices.output * multiplier),
    cache_write: roundPrice(prices.cache_write * multiplier),
  };
}

function convertMoney(value: number, currency: Currency, rate: number) {
  return currency === 'USD' ? value * rate : value / rate;
}

function otherCurrency(currency: Currency): Currency {
  return currency === 'USD' ? 'CNY' : 'USD';
}

function roundPrice(value: number) {
  return Number(value.toFixed(4));
}

function formatMoney(value: number, currency: Currency) {
  return `${CURRENCY_SYMBOLS[currency]}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPrice(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatTokens(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString('en-US');
}

function formatUpdatedAt(value?: string) {
  if (!value) return '暂无同步时间';

  return new Date(value).toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function makeCostRows(totals: Totals, prices: UnitPrices): CostRow[] {
  const kinds: UsageKind[] = ['cache', 'input', 'output', 'cache_write'];

  const rows = kinds.map((key) => {
    const tokens = key === 'cache_write' ? totals.input : totals[key as 'cache' | 'input' | 'output'];
    const tokensM = tokens / 1_000_000;
    const cost = tokensM * prices[key];

    return {
      key,
      ...ROW_META[key],
      tokens,
      tokensM,
      unitPrice: prices[key],
      cost,
      ratio: 0,
    };
  });

  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);

  return rows.map((row) => ({
    ...row,
    ratio: totalCost > 0 ? (row.cost / totalCost) * 100 : 0,
  }));
}

export function CostCalculator({ totals, scope }: Props) {
  const selectedPresetIdRef = useRef<string>(DEFAULT_PRICE_PRESET_ID);
  const currencyRef = useRef<Currency>('CNY');
  const rateRef = useRef(DEFAULT_RATE);
  const summarySentinelRef = useRef<HTMLDivElement>(null);
  const fallbackDefault = FALLBACK_PRICE_PRESETS.find((preset) => preset.id === DEFAULT_PRICE_PRESET_ID) ?? FALLBACK_PRICE_PRESETS[0];

  const [presets, setPresets] = useState<PricePreset[]>(FALLBACK_PRICE_PRESETS);
  const [pricingStatus, setPricingStatus] = useState<PricingStatus>({
    status: 'loading',
    source: 'fallback',
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string>(fallbackDefault.id);
  const [currency, setCurrency] = useState<Currency>('CNY');
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [unitPrices, setUnitPrices] = useState<UnitPrices>(() =>
    presetToUnitPrices(fallbackDefault, 'CNY', DEFAULT_RATE),
  );
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const presetsById = useMemo(() => indexPresets(presets), [presets]);
  const vendorGroups = useMemo(() => buildVendorGroups(presets), [presets]);
  const rows = useMemo(() => makeCostRows(totals, unitPrices), [totals, unitPrices]);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const secondaryCurrency = otherCurrency(currency);
  const secondaryTotal = convertMoney(totalCost, currency, rate);
  const totalTokens = totals.cache + totals.input + totals.output;
  const selectedPreset = selectedPresetId ? presetsById.get(selectedPresetId) : null;
  const modelMetric = selectedPreset ? selectedPreset.label : '自定义';

  useEffect(() => {
    let cancelled = false;

    fetch('/api/pricing')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json() as Promise<PricingResponse>;
      })
      .then((pricing) => {
        if (cancelled) return;

        const nextPresets = pricing.catalog.presets.length
          ? mergePresets(FALLBACK_PRICE_PRESETS, pricing.catalog.presets)
          : FALLBACK_PRICE_PRESETS;
        const nextById = indexPresets(nextPresets);
        const currentSelected = selectedPresetIdRef.current;

        setPresets(nextPresets);
        setPricingStatus({
          status: pricing.source === 'fallback' ? 'fallback' : 'ready',
          source: pricing.source,
          updatedAt: pricing.updatedAt ?? pricing.catalog.fetchedAt,
          stale: pricing.stale,
          error: pricing.error,
        });

        if (currentSelected) {
          const nextPreset = nextById.get(currentSelected);
          if (nextPreset) {
            setUnitPrices(presetToUnitPrices(nextPreset, currencyRef.current, rateRef.current));
          }
        }
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setPricingStatus({
          status: 'fallback',
          source: 'fallback',
          stale: true,
          error: error.message,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const element = summarySentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSummaryCollapsed(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const selectCurrency = (nextCurrency: Currency) => {
    if (nextCurrency === currency) return;

    currencyRef.current = nextCurrency;
    setUnitPrices((current) => convertUnitPrices(current, currency, nextCurrency, rate));
    setCurrency(nextCurrency);
  };

  const selectPreset = (id: string) => {
    const preset = presetsById.get(id);
    if (!preset) return;

    selectedPresetIdRef.current = id;
    setSelectedPresetId(id);
    setUnitPrices(presetToUnitPrices(preset, currency, rate));
  };

  const updatePrice = (key: UsageKind, value: number) => {
    selectedPresetIdRef.current = '';
    setSelectedPresetId('');
    setUnitPrices((current) => ({ ...current, [key]: value }));
  };

  const updateRate = (value: number) => {
    rateRef.current = value;
    setRate(value);
    if (selectedPresetId && currency === 'CNY') {
      const preset = presetsById.get(selectedPresetId);
      if (preset) setUnitPrices(presetToUnitPrices(preset, 'CNY', value));
    }
  };

  return (
    <div className="space-y-5">
      <div ref={summarySentinelRef} className="h-px" aria-hidden="true" />
      {isSummaryCollapsed ? (
        <Card className="fixed inset-x-4 top-4 z-20 overflow-hidden p-0 shadow-md shadow-slate-950/10 md:left-[calc(var(--sidebar-width)+2rem)] md:right-8">
          <div className="flex h-18 items-center justify-between gap-6 px-5 sm:px-7">
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">预计总费用</div>
              <div className="truncate text-sm text-slate-500">{modelMetric} · {currency}</div>
            </div>
            <div className="shrink-0 text-right font-mono text-2xl font-semibold tracking-tight text-slate-950">
              {formatMoney(totalCost, currency)}
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-blue-50 blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {scope.label}
              </div>
              <div className="text-sm text-muted-foreground">预计总费用</div>
              <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                <div className="font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {formatMoney(totalCost, currency)}
                </div>
                <div className="pb-1 text-sm text-muted-foreground">
                  ≈ {formatMoney(secondaryTotal, secondaryCurrency)}
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                当前按 {selectedPreset ? selectedPreset.label : '自定义价格'} 估算，覆盖 {scope.detail}，共 {formatTokens(totalTokens)} tokens。
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-gray-100 px-2.5 py-1">
                  {pricingStatus.status === 'loading'
                    ? '动态价格加载中'
                    : pricingStatus.source === 'postgres'
                      ? '使用动态价格'
                      : '使用本地默认价格'}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1">
                  更新：{formatUpdatedAt(pricingStatus.updatedAt)}
                </span>
                {pricingStatus.stale ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                    价格可能已过期
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/70 p-6 sm:p-7 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 gap-4">
              <Metric label="天数" value={`${scope.days}`} />
              <Metric label="模型" value={modelMetric} />
              <Metric label="主币种" value={currency} />
              <Metric label="汇率" value={`1 USD = ${rate}`} />
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Panel title="选择模型预设" subtitle="预设价格以 USD / 1M tokens 为基准，切换币种时自动换算。">
          <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
            {vendorGroups.map(([vendor, modelPresets]) => (
              <div key={vendor}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {vendor}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {modelPresets.map((preset) => {
                    const active = preset.id === selectedPresetId;

                    return (
                      <button
                        key={preset.id}
                        onClick={() => selectPreset(preset.id)}
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="truncate text-sm font-semibold">{preset.label}</div>
                        <div className="mt-1 truncate font-mono text-[11px] text-gray-400">
                          {preset.id}
                        </div>
                        <div className="mt-1 font-mono text-xs text-gray-400">
                          {CURRENCY_SYMBOLS.USD}{formatPrice(preset.pricesUsdPer1M.input)}/M in · {CURRENCY_SYMBOLS.USD}{formatPrice(preset.pricesUsdPer1M.output)}/M out
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="调整计价参数" subtitle="单价单位均为当前币种 / 1M tokens。手动修改后会进入自定义价格。">
          <Card className="mb-5 flex flex-wrap items-center gap-3 p-3 rounded-lg ring-0 shadow-none bg-gray-100">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              币种
            </label>
            <Select value={currency} onValueChange={(v) => selectCurrency(v as Currency)}>
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">1 USD =</span>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={rate}
                onChange={(e) => updateRate(parseFloat(e.target.value) || 0)}
                className="w-24 font-mono bg-white"
              />
              <span className="text-xs text-muted-foreground">CNY</span>
            </div>
          </Card>

          <div className="grid gap-3">
            <PriceInput
              label="缓存命中单价"
              value={unitPrices.cache}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`${formatTokens(totals.cache)} tokens`}
              onChange={(value) => updatePrice('cache', value)}
            />
            <PriceInput
              label="输入未缓存单价"
              value={unitPrices.input}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`${formatTokens(totals.input)} tokens`}
              onChange={(value) => updatePrice('input', value)}
            />
            <PriceInput
              label="缓存写入单价"
              value={unitPrices.cache_write}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`写入 ${formatTokens(totals.input)} tokens`}
              onChange={(value) => updatePrice('cache_write', value)}
            />
            <PriceInput
              label="输出单价"
              value={unitPrices.output}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`${formatTokens(totals.output)} tokens`}
              onChange={(value) => updatePrice('output', value)}
            />
          </div>
        </Panel>
      </section>

      <Panel title="费用拆解" subtitle="按实际用量 × 当前单价计算，条形长度表示费用占比。">
        <div className="grid gap-3 lg:grid-cols-4">
          {rows.map((row) => (
            <CostBreakdownCard
              key={row.key}
              row={row}
              currency={currency}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1 p-3 rounded-lg ring-0 shadow-none bg-gray-100">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-semibold">{value}</div>
    </Card>
  );
}

function PriceInput({
  label,
  detail,
  value,
  onChange,
  symbol,
}: {
  label: string;
  detail: string;
  value: number;
  onChange: (v: number) => void;
  symbol: string;
}) {
  return (
    <Card className="grid gap-3 p-3 sm:grid-cols-[1fr_170px] sm:items-center rounded-lg shadow-none">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">参与计算：{detail}</div>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-mono text-sm text-muted-foreground">{symbol}</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="font-mono"
        />
      </div>
    </Card>
  );
}

function CostBreakdownCard({ row, currency }: { row: CostRow; currency: Currency }) {
  return (
    <Card className="gap-4 p-4 shadow-none rounded-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{row.label}</div>
          <div className="mt-1 text-xs leading-5 text-gray-400">{row.hint}</div>
        </div>
        <div className="text-right font-mono text-sm font-semibold text-gray-900">
          {formatMoney(row.cost, currency)}
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full ${row.color}`}
          style={{ width: `${Math.max(row.ratio, row.cost > 0 ? 3 : 0)}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <BreakdownStat label="用量" value={formatTokens(row.tokens)} />
        <BreakdownStat label="单价 /M" value={`${CURRENCY_SYMBOLS[currency]}${formatPrice(row.unitPrice)}`} />
        <BreakdownStat label="占比" value={`${row.ratio.toFixed(0)}%`} />
      </div>
    </Card>
  );
}

function BreakdownStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="mt-1 truncate font-mono font-medium text-gray-700">{value}</div>
    </div>
  );
}
