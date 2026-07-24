import type { PriceCatalog, PricePreset, UnitPrices } from './types';

const AGGREGATE_PATH = '/model/model_pricing/aggregate';

interface AggregateResponse {
  code?: unknown;
  msg?: unknown;
  data?: unknown;
}

interface AggregateProvider {
  providerType?: unknown;
  provider?: unknown;
  providerUrl?: unknown;
  iconData?: unknown;
  models?: unknown;
}

interface AggregateModel {
  name?: unknown;
  plans?: unknown;
}

interface AggregatePlan {
  type?: unknown;
  currency?: unknown;
  pricing?: unknown;
}

interface AggregatePricing {
  input?: unknown;
  cachedInput?: unknown;
  cacheWrite?: unknown;
  output?: unknown;
}

export async function fetchAggregatePriceCatalog(
  baseUrl: string,
  apiKey: string,
): Promise<PriceCatalog> {
  const sourceUrl = `${baseUrl.replace(/\/$/, '')}${AGGREGATE_PATH}`;
  const response = await fetch(sourceUrl, {
    headers: {
      'X-API-Key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Model pricing request failed: HTTP ${response.status}`);
  }

  return parseAggregatePriceCatalog(await response.json(), sourceUrl);
}

export function parseAggregatePriceCatalog(
  payload: unknown,
  sourceUrl: string,
  now = new Date(),
): PriceCatalog {
  if (!isRecord(payload)) throw new Error('Model pricing response is not an object');

  const response = payload as AggregateResponse;
  if (response.code !== 200) {
    const message = asText(response.msg) ?? 'unknown error';
    throw new Error(`Model pricing response failed: ${message}`);
  }
  if (!Array.isArray(response.data)) {
    throw new Error('Model pricing response data is not an array');
  }

  const presets = response.data.flatMap((provider) => parseProvider(provider));
  if (!presets.length) {
    throw new Error('Model pricing response contains no usable USD plans');
  }

  return {
    fetchedAt: now.toISOString(),
    sourceUrl,
    presets: presets.sort((a, b) =>
      a.vendor.localeCompare(b.vendor) || a.label.localeCompare(b.label),
    ),
  };
}

type ProviderContext = {
  vendor: string;
  providerType: string | null;
  providerUrl: string | null;
  iconData: string | null;
};

function parseProvider(value: unknown): PricePreset[] {
  if (!isRecord(value)) return [];

  const provider = value as AggregateProvider;
  const vendor = asText(provider.provider);
  const providerType = asText(provider.providerType);
  const providerUrl = asText(provider.providerUrl);
  const iconData = asIconData(provider.iconData);
  if (!vendor || !Array.isArray(provider.models)) return [];

  return provider.models.flatMap((model) =>
    parseModel(model, { vendor, providerType, providerUrl, iconData }),
  );
}

function parseModel(value: unknown, provider: ProviderContext): PricePreset[] {
  if (!isRecord(value)) return [];

  const model = value as AggregateModel;
  const modelName = asText(model.name);
  if (!modelName || !Array.isArray(model.plans)) return [];

  return model.plans.flatMap((plan) => {
    const preset = parsePlan(plan, modelName, provider);
    return preset ? [preset] : [];
  });
}

function parsePlan(
  value: unknown,
  modelName: string,
  provider: ProviderContext,
): PricePreset | null {
  if (!isRecord(value)) return null;

  const plan = value as AggregatePlan;
  const currency = normalizeCurrency(asText(plan.currency));
  const planType = asText(plan.type) ?? 'default';
  if (currency !== 'USD' || !isRecord(plan.pricing)) return null;

  const pricing = plan.pricing as AggregatePricing;
  const prices = parsePrices(pricing);
  if (!prices) return null;

  const id = [
    provider.providerType ?? 'unknown',
    provider.vendor,
    provider.providerUrl ?? 'default',
    modelName,
    planType,
  ].map(encodeURIComponent).join(':');

  return {
    id,
    label: planType === 'default' ? modelName : `${modelName} · ${planType}`,
    vendor: provider.vendor,
    provider: {
      name: provider.vendor,
      ...(provider.providerType ? { type: provider.providerType } : {}),
      ...(provider.providerUrl ? { url: provider.providerUrl } : {}),
      ...(provider.iconData ? { iconData: provider.iconData } : {}),
    },
    source: 'backend',
    pricesUsdPer1M: prices,
  };
}

function parsePrices(pricing: AggregatePricing): UnitPrices | null {
  const cache = asPrice(pricing.cachedInput);
  const input = asPrice(pricing.input);
  const output = asPrice(pricing.output);
  const cacheWrite = asPrice(pricing.cacheWrite);

  if (cache === null || input === null || output === null || cacheWrite === null) {
    return null;
  }

  return {
    cache,
    input,
    output,
    cache_write: cacheWrite,
  };
}

function asPrice(value: unknown) {
  const number = typeof value === 'number' || typeof value === 'string'
    ? Number(value)
    : NaN;

  return Number.isFinite(number) && number >= 0 ? number : null;
}

function normalizeCurrency(value: string | null) {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();
  return normalized === '美元' ? 'USD' : normalized;
}

function asText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** 接受完整 Data URL；拒绝空串与非 data: 伪协议内容。 */
function asIconData(value: unknown) {
  const text = asText(value);
  if (!text) return null;
  return text.startsWith('data:image/') ? text : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}