import type { PriceCatalog, PricePreset, UnitPrices } from './types';

const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';
const USD_PER_TOKEN_TO_USD_PER_1M = 1_000_000;

interface OpenRouterModelsResponse {
  data?: OpenRouterModel[];
}

interface OpenRouterModel {
  id?: unknown;
  name?: unknown;
  pricing?: {
    prompt?: unknown;
    completion?: unknown;
    input_cache_read?: unknown;
    input_cache_write?: unknown;
    input_cache_write_1h?: unknown;
  };
}

export async function fetchOpenRouterPriceCatalog(apiKey: string): Promise<PriceCatalog> {
  const response = await fetch(OPENROUTER_MODELS_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`OpenRouter pricing request failed: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as OpenRouterModelsResponse;
  return parseOpenRouterPriceCatalog(payload, new Date());
}

export function parseOpenRouterPriceCatalog(
  payload: OpenRouterModelsResponse,
  now = new Date(),
): PriceCatalog {
  const models = Array.isArray(payload.data) ? payload.data : [];
  const presets = models.flatMap((model) => {
    const preset = parseModel(model);
    return preset ? [preset] : [];
  });

  return {
    fetchedAt: now.toISOString(),
    sourceUrl: OPENROUTER_MODELS_URL,
    presets: presets.sort((a, b) =>
      a.vendor.localeCompare(b.vendor) || a.label.localeCompare(b.label),
    ),
  };
}

function parseModel(model: OpenRouterModel): PricePreset | null {
  const id = asText(model.id);
  const input = pricePer1M(model.pricing?.prompt);
  const output = pricePer1M(model.pricing?.completion);

  if (!id || input === null || output === null) return null;

  const label = asText(model.name) ?? id;
  const vendor = vendorFromModel(id, label);
  const cache = pricePer1M(model.pricing?.input_cache_read) ?? input;
  const cacheWrite =
    pricePer1M(model.pricing?.input_cache_write) ??
    pricePer1M(model.pricing?.input_cache_write_1h) ??
    deriveCacheWritePrice(vendor, input);

  const derived: PricePreset['derived'] = {};
  if (model.pricing?.input_cache_read === undefined) derived.cache = 'input';
  if (
    model.pricing?.input_cache_write === undefined &&
    model.pricing?.input_cache_write_1h === undefined
  ) {
    derived.cache_write = vendor === 'Anthropic' ? '1.25× input' : '0';
  }

  return {
    id,
    label,
    vendor,
    source: 'openrouter',
    pricesUsdPer1M: roundPrices({
      cache,
      input,
      output,
      cache_write: cacheWrite,
    }),
    derived: Object.keys(derived).length ? derived : undefined,
  };
}

function pricePer1M(value: unknown) {
  const parsed = typeof value === 'string' || typeof value === 'number'
    ? Number(value)
    : NaN;

  return Number.isFinite(parsed)
    ? parsed * USD_PER_TOKEN_TO_USD_PER_1M
    : null;
}

function deriveCacheWritePrice(vendor: string, input: number) {
  return vendor === 'Anthropic' ? input * 1.25 : 0;
}

function roundPrices(prices: UnitPrices): UnitPrices {
  return {
    cache: roundPrice(prices.cache),
    input: roundPrice(prices.input),
    output: roundPrice(prices.output),
    cache_write: roundPrice(prices.cache_write),
  };
}

function roundPrice(value: number) {
  return Number(value.toFixed(6));
}

function asText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function vendorFromModel(id: string, label: string) {
  const rawVendor = id.split('/')[0] || label.split(':')[0] || 'Other';
  const normalized = rawVendor.toLowerCase();

  const known: Record<string, string> = {
    anthropic: 'Anthropic',
    deepseek: 'DeepSeek',
    google: 'Google',
    meta: 'Meta',
    mistral: 'Mistral',
    minimax: 'MiniMax',
    openai: 'OpenAI',
    qwen: 'Qwen',
    xiaomi: 'Xiaomi',
  };

  return known[normalized] ?? titleCase(rawVendor.replace(/[-_]/g, ' '));
}

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}