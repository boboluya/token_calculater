"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { lora } from "@/app/fonts";
import {
  DEFAULT_PRICE_PRESET_ID,
  FALLBACK_PRICE_PRESETS,
} from "@/lib/pricing/fallback";
import type {
  PriceCatalog,
  PricePreset,
  PricingResponse,
  UnitPrices,
  UsageKind,
} from "@/lib/pricing/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Currency = "USD" | "CNY";

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
  status: "loading" | "ready" | "fallback";
  source: "backend" | "cache" | "fallback";
  updatedAt?: string;
  error?: string;
}

interface CachedPricingCatalog {
  version: 2;
  catalog: PriceCatalog;
}

const DEFAULT_RATE = 6.79;
const PRICING_CACHE_KEY = "token-calculator:pricing-catalog:v2";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  CNY: "¥",
};

const ROW_META: Record<UsageKind, Pick<CostRow, "label" | "hint" | "color">> = {
  cache: {
    label: "缓存命中",
    hint: "复用上下文",
    color: "bg-amber-500",
  },
  input: {
    label: "输入未缓存",
    hint: "按输入单价计费的请求 Token",
    color: "bg-blue-500",
  },
  cache_write: {
    label: "缓存写入",
    hint: "将未缓存内容写入缓存",
    color: "bg-purple-500",
  },
  output: {
    label: "输出",
    hint: "模型生成内容",
    color: "bg-emerald-500",
  },
};

/** 厂商名称 → public/provider_icon/ 下的图标文件路径 */
const VENDOR_ICONS: Record<string, string> = {
  openai: "/provider_icon/openai.svg",
  anthropic: "/provider_icon/claudecode.png",
  deepseek: "/provider_icon/DeepSeek.svg",
  cursor: "/provider_icon/cursor.png",
  opencode: "/provider_icon/opencode.ico",
};

const VENDOR_DISPLAY_NAMES: Record<string, string> = {
  moonshotai: "月之暗面(USD)",
  openai: "OpenAi",
  "z-ai": "智谱(USD)",
  deepseek: "deepseek(USD)",
};

function vendorIcon(vendor: string): string | undefined {
  return VENDOR_ICONS[vendor.toLowerCase()];
}

function formatVendorName(value: string) {
  const mapped = VENDOR_DISPLAY_NAMES[value.toLowerCase()];
  return (
    mapped ?? (value ? value.charAt(0).toUpperCase() + value.slice(1) : value)
  );
}

function safeExternalUrl(value?: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

interface VendorGroup {
  id: string;
  name: string;
  type?: string;
  url?: string;
  presets: PricePreset[];
}

function vendorGroupId(preset: PricePreset) {
  return `${preset.vendor}:${preset.provider?.url ?? ""}`;
}

function buildVendorGroups(presets: PricePreset[]): VendorGroup[] {
  const groups = new Map<string, VendorGroup>();

  for (const preset of presets) {
    const id = vendorGroupId(preset);
    const current = groups.get(id);
    const provider = preset.provider;

    groups.set(
      id,
      current
        ? { ...current, presets: [...current.presets, preset] }
        : {
            id,
            name: formatVendorName(provider?.name ?? preset.vendor),
            ...(provider?.type ? { type: provider.type } : {}),
            ...(provider?.url ? { url: provider.url } : {}),
            presets: [preset],
          },
    );
  }

  return [...groups.values()];
}

function indexPresets(presets: PricePreset[]) {
  return new Map(presets.map((preset) => [preset.id, preset]));
}

function presetToUnitPrices(
  preset: PricePreset,
  currency: Currency,
  rate: number,
): UnitPrices {
  const multiplier = currency === "USD" ? 1 : rate;

  return {
    cache: roundPrice(preset.pricesUsdPer1M.cache * multiplier),
    input: roundPrice(preset.pricesUsdPer1M.input * multiplier),
    output: roundPrice(preset.pricesUsdPer1M.output * multiplier),
    cache_write: roundPrice(preset.pricesUsdPer1M.cache_write * multiplier),
  };
}

function convertUnitPrices(
  prices: UnitPrices,
  from: Currency,
  to: Currency,
  rate: number,
): UnitPrices {
  if (from === to) return prices;
  const multiplier = to === "USD" ? 1 / rate : rate;

  return {
    cache: roundPrice(prices.cache * multiplier),
    input: roundPrice(prices.input * multiplier),
    output: roundPrice(prices.output * multiplier),
    cache_write: roundPrice(prices.cache_write * multiplier),
  };
}

function convertMoney(value: number, currency: Currency, rate: number) {
  return currency === "USD" ? value * rate : value / rate;
}

function otherCurrency(currency: Currency): Currency {
  return currency === "USD" ? "CNY" : "USD";
}

function roundPrice(value: number) {
  return Number(value.toFixed(4));
}

function formatMoney(value: number, currency: Currency) {
  return `${CURRENCY_SYMBOLS[currency]}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

function formatTokens(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("en-US");
}

function formatUpdatedAt(value?: string) {
  if (!value) return "暂无同步时间";

  return new Date(value).toLocaleString("zh-CN", {
    hour12: false,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pricingSourceLabel(status: PricingStatus) {
  if (status.status === "loading") return "动态价格加载中";
  if (status.source === "backend") return "使用实时价格";
  if (status.source === "cache") return "使用浏览器缓存价格";
  return "使用本地默认价格";
}

function formatPricingError(error: string) {
  return error.replace(/[。.!！?？]+$/u, "");
}

function readCachedPriceCatalog(): PriceCatalog | null {
  try {
    const raw = localStorage.getItem(PRICING_CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedPricingCatalog;
    if (
      cached.version !== 2 ||
      !cached.catalog ||
      typeof cached.catalog.fetchedAt !== "string" ||
      typeof cached.catalog.sourceUrl !== "string" ||
      !Array.isArray(cached.catalog.presets) ||
      !cached.catalog.presets.length ||
      cached.catalog.presets.some(
        (preset) =>
          !preset ||
          typeof preset.id !== "string" ||
          typeof preset.label !== "string" ||
          typeof preset.vendor !== "string" ||
          preset.source !== "backend" ||
          !hasValidUnitPrices(preset.pricesUsdPer1M),
      )
    ) {
      throw new Error("invalid pricing cache");
    }

    return cached.catalog;
  } catch {
    try {
      localStorage.removeItem(PRICING_CACHE_KEY);
    } catch {
      // 浏览器禁用持久存储时，仍允许本次使用动态价格。
    }
    return null;
  }
}

function hasValidUnitPrices(value: unknown): value is UnitPrices {
  if (!value || typeof value !== "object") return false;

  return (
    ["cache", "input", "output", "cache_write"] satisfies UsageKind[]
  ).every((key) => {
    const price = (value as Record<string, unknown>)[key];
    return typeof price === "number" && Number.isFinite(price) && price >= 0;
  });
}

function writeCachedPriceCatalog(catalog: PriceCatalog) {
  try {
    localStorage.setItem(
      PRICING_CACHE_KEY,
      JSON.stringify({ version: 2, catalog }),
    );
  } catch {
    // 持久化失败不应覆盖已成功取得的动态价格。
  }
}

function makeCostRows(totals: Totals, prices: UnitPrices): CostRow[] {
  const kinds: UsageKind[] = ["cache", "input", "output", "cache_write"];

  const rows = kinds.map((key) => {
    const tokens =
      key === "cache_write"
        ? totals.input
        : totals[key as "cache" | "input" | "output"];
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
  const currencyRef = useRef<Currency>("CNY");
  const rateRef = useRef(DEFAULT_RATE);
  const summarySentinelRef = useRef<HTMLDivElement>(null);
  const fallbackDefault =
    FALLBACK_PRICE_PRESETS.find(
      (preset) => preset.id === DEFAULT_PRICE_PRESET_ID,
    ) ?? FALLBACK_PRICE_PRESETS[0];

  const [presets, setPresets] = useState<PricePreset[]>(FALLBACK_PRICE_PRESETS);
  const [pricingStatus, setPricingStatus] = useState<PricingStatus>({
    status: "loading",
    source: "fallback",
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    fallbackDefault.id,
  );
  const [currency, setCurrency] = useState<Currency>("CNY");
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [unitPrices, setUnitPrices] = useState<UnitPrices>(() =>
    presetToUnitPrices(fallbackDefault, "CNY", DEFAULT_RATE),
  );
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [activeVendor, setActiveVendor] = useState<string | null>(null);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  const presetsById = useMemo(() => indexPresets(presets), [presets]);
  const vendorGroups = useMemo(() => buildVendorGroups(presets), [presets]);
  const rows = useMemo(
    () => makeCostRows(totals, unitPrices),
    [totals, unitPrices],
  );
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const secondaryCurrency = otherCurrency(currency);
  const secondaryTotal = convertMoney(totalCost, currency, rate);
  const totalTokens = totals.cache + totals.input + totals.output;
  const selectedPreset = selectedPresetId
    ? presetsById.get(selectedPresetId)
    : null;
  const modelMetric = selectedPreset ? selectedPreset.label : "自定义";

  const applyDynamicCatalog = useCallback(
    (catalog: PriceCatalog, source: "backend" | "cache") => {
      const nextById = indexPresets(catalog.presets);
      const currentSelected = selectedPresetIdRef.current;
      const nextPreset = currentSelected
        ? (nextById.get(currentSelected) ?? catalog.presets[0])
        : null;

      setPresets(catalog.presets);
      setPricingStatus({
        status: "ready",
        source,
        updatedAt: catalog.fetchedAt,
      });

      if (nextPreset) {
        selectedPresetIdRef.current = nextPreset.id;
        setSelectedPresetId(nextPreset.id);
        setUnitPrices(
          presetToUnitPrices(nextPreset, currencyRef.current, rateRef.current),
        );
        setActiveVendor(vendorGroupId(nextPreset));
      }
    },
    [],
  );

  const requestDynamicCatalog = useCallback(async () => {
    const response = await fetch("/api/pricing", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);

    const pricing = (await response.json()) as PricingResponse;
    if (pricing.source !== "backend" || !pricing.catalog.presets.length) {
      throw new Error(pricing.error ?? "动态价格暂不可用");
    }

    return pricing.catalog;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializePricing = async () => {
      const cached = readCachedPriceCatalog();
      if (cached) {
        if (!cancelled) applyDynamicCatalog(cached, "cache");
        return;
      }

      try {
        const catalog = await requestDynamicCatalog();
        if (cancelled) return;
        writeCachedPriceCatalog(catalog);
        applyDynamicCatalog(catalog, "backend");
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        setPricingStatus({
          status: "fallback",
          source: "fallback",
          error: message,
        });
      }
    };

    void initializePricing();

    return () => {
      cancelled = true;
    };
  }, [applyDynamicCatalog, requestDynamicCatalog]);

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
    setUnitPrices((current) =>
      convertUnitPrices(current, currency, nextCurrency, rate),
    );
    setCurrency(nextCurrency);
  };

  const selectPreset = (id: string) => {
    const preset = presetsById.get(id);
    if (!preset) return;

    selectedPresetIdRef.current = id;
    setSelectedPresetId(id);
    setUnitPrices(presetToUnitPrices(preset, currency, rate));
  };

  const selectVendor = (vendor: string) => {
    setActiveVendor(vendor);
  };

  const updatePrice = (key: UsageKind, value: number) => {
    selectedPresetIdRef.current = "";
    setSelectedPresetId("");
    setUnitPrices((current) => ({ ...current, [key]: value }));
  };

  const updateRate = (value: number) => {
    rateRef.current = value;
    setRate(value);
    if (selectedPresetId && currency === "CNY") {
      const preset = presetsById.get(selectedPresetId);
      if (preset) setUnitPrices(presetToUnitPrices(preset, "CNY", value));
    }
  };

  const refreshPrices = async () => {
    if (isRefreshingPrices) return;

    setIsRefreshingPrices(true);
    try {
      const catalog = await requestDynamicCatalog();
      writeCachedPriceCatalog(catalog);
      applyDynamicCatalog(catalog, "backend");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setPricingStatus((current) => ({ ...current, error: message }));
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  const activeVendorGroup =
    vendorGroups.find((group) => group.id === activeVendor) ?? vendorGroups[0];
  const activeModels = activeVendorGroup?.presets ?? [];
  const activeVendorUrl = safeExternalUrl(activeVendorGroup?.url);

  return (
    <div className="space-y-5">
      <div ref={summarySentinelRef} className="h-px" aria-hidden="true" />
      {isSummaryCollapsed ? (
        <Card className="fixed inset-x-4 top-4 z-20 overflow-hidden p-0 shadow-md shadow-slate-950/10 md:left-[calc(var(--sidebar-width)+2rem)] md:right-8">
          <div className="flex h-18 items-center justify-between gap-6 px-5 sm:px-7">
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                预计总费用
              </div>
              <div className="truncate text-sm text-slate-500">
                {modelMetric} · {currency}
              </div>
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
                当前按 {selectedPreset ? selectedPreset.label : "自定义价格"}{" "}
                估算，覆盖 {scope.detail}，共 {formatTokens(totalTokens)}{" "}
                tokens。
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {/*<span className="rounded-full bg-gray-100 px-2.5 py-1">
                  {pricingSourceLabel(pricingStatus)}
                </span>*/}
                <span className="rounded-full bg-gray-100 px-2.5 py-1">
                  更新：{formatUpdatedAt(pricingStatus.updatedAt)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={isRefreshingPrices}
                  onClick={refreshPrices}
                  aria-label="刷新模型价格"
                >
                  <RefreshCw
                    className={isRefreshingPrices ? "animate-spin" : undefined}
                  />
                  {isRefreshingPrices ? "刷新中" : "刷新价格"}
                </Button>
              </div>
              {pricingStatus.error ? (
                <p
                  className="mt-2 text-xs leading-5 text-amber-700"
                  role="status"
                >
                  动态价格获取失败：{formatPricingError(pricingStatus.error)}
                  {pricingStatus.source === "fallback"
                    ? "。当前使用本地默认价格，下次进入会自动重试。"
                    : "。当前价格未被覆盖。"}
                </p>
              ) : null}
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
        <Panel
          title="选择模型预设"
          subtitle="预设价格以 USD / 1M tokens 为基准，切换币种时自动换算。"
        >
          <div className="max-h-130 space-y-4 overflow-y-auto pr-1">
            {/* 按厂商筛选模型 */}
            <div className="flex flex-wrap gap-2">
              {vendorGroups.map((group) => {
                const selected = group.id === activeVendorGroup?.id;
                const icon = vendorIcon(group.name);

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => selectVendor(group.id)}
                    aria-pressed={selected}
                    className={`${lora.className} inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/15"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {icon && (
                      <span className="grid size-5 shrink-0 place-items-center overflow-hidden rounded bg-white">
                        <Image
                          src={icon}
                          alt={group.name}
                          width={20}
                          height={20}
                          className="size-4 object-contain"
                        />
                      </span>
                    )}
                    {group.name}
                  </button>
                );
              })}
            </div>

            {activeVendorGroup && activeModels.length > 0 ? (
              <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <div className="flex items-baseline gap-2">
                    <div className="text-sm font-medium text-foreground">
                      <span className={lora.className}>
                        {activeVendorGroup.name}
                      </span>{" "}
                      模型
                    </div>
                    {activeVendorGroup.type ? (
                      <span className="text-xs text-muted-foreground">
                        {activeVendorGroup.type}
                      </span>
                    ) : null}
                    {activeVendorUrl ? (
                      <a
                        href={activeVendorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 underline-offset-2 hover:underline"
                      >
                        供应商官网
                      </a>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    USD / 1M tokens
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeModels.map((preset) => {
                    const active = preset.id === selectedPresetId;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectPreset(preset.id)}
                        aria-pressed={active}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? "border-blue-300 bg-blue-50 text-blue-950 ring-1 ring-blue-100"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`${lora.className} min-h-5 text-sm font-semibold leading-5`}
                        >
                          {preset.label}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200/80 pt-3">
                          <PresetPrice
                            label="缓存命中"
                            value={preset.pricesUsdPer1M.cache}
                          />
                          <PresetPrice
                            label="输入"
                            value={preset.pricesUsdPer1M.input}
                          />
                          <PresetPrice
                            label="缓存写入"
                            value={preset.pricesUsdPer1M.cache_write}
                          />
                          <PresetPrice
                            label="输出"
                            value={preset.pricesUsdPer1M.output}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel
          title="调整计价参数"
          subtitle="单价单位均为当前币种 / 1M tokens。手动修改后会进入自定义价格。"
        >
          <Card className="mb-5 flex flex-wrap items-center gap-3 p-3 rounded-lg ring-0 shadow-none bg-gray-100">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              币种
            </label>
            <Select
              value={currency}
              onValueChange={(v) => selectCurrency(v as Currency)}
            >
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
              onChange={(value) => updatePrice("cache", value)}
            />
            <PriceInput
              label="输入未缓存单价"
              value={unitPrices.input}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`${formatTokens(totals.input)} tokens`}
              onChange={(value) => updatePrice("input", value)}
            />
            <PriceInput
              label="缓存写入单价"
              value={unitPrices.cache_write}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`写入 ${formatTokens(totals.input)} tokens`}
              onChange={(value) => updatePrice("cache_write", value)}
            />
            <PriceInput
              label="输出单价"
              value={unitPrices.output}
              symbol={CURRENCY_SYMBOLS[currency]}
              detail={`${formatTokens(totals.output)} tokens`}
              onChange={(value) => updatePrice("output", value)}
            />
          </div>
        </Panel>
      </section>

      <Panel
        title="费用拆解"
        subtitle="按实际用量 × 当前单价计算，条形长度表示费用占比。"
      >
        <div className="grid gap-3 lg:grid-cols-4">
          {rows.map((row) => (
            <CostBreakdownCard key={row.key} row={row} currency={currency} />
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

function PresetPrice({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5 font-mono text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="whitespace-nowrap font-medium text-slate-800">
        {CURRENCY_SYMBOLS.USD}
        {formatPrice(value)}
      </span>
    </div>
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
        <div className="mt-0.5 text-xs text-muted-foreground">
          参与计算：{detail}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-mono text-sm text-muted-foreground">
          {symbol}
        </span>
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

function CostBreakdownCard({
  row,
  currency,
}: {
  row: CostRow;
  currency: Currency;
}) {
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
        <BreakdownStat
          label="单价 /M"
          value={`${CURRENCY_SYMBOLS[currency]}${formatPrice(row.unitPrice)}`}
        />
        <BreakdownStat label="占比" value={`${row.ratio.toFixed(0)}%`} />
      </div>
    </Card>
  );
}

function BreakdownStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="mt-1 truncate font-mono font-medium text-gray-700">
        {value}
      </div>
    </div>
  );
}
