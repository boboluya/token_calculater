import type { PriceCatalog, PricePreset } from './types';

export const FALLBACK_SOURCE_URL = 'local:fallback-pricing';
export const DEFAULT_PRICE_PRESET_ID = 'GPT-5.5';

export const FALLBACK_PRICE_PRESETS: PricePreset[] = [
  preset('GPT-5.5', 'GPT-5.5', 'OpenAI', 0.5, 5, 30),
  preset('GPT-5.4', 'GPT-5.4', 'OpenAI', 0.25, 2.5, 15),
  preset('GPT-5.4 Mini', 'GPT-5.4 Mini', 'OpenAI', 0.075, 0.75, 4.5),
  preset('Opus 4.8', 'Opus 4.8', 'Anthropic', 0.5, 5, 25, 1.25),
  preset('Opus 4.7', 'Opus 4.7', 'Anthropic', 0.5, 5, 25, 1.25),
  preset('Sonnet 5', 'Sonnet 5', 'Anthropic', 0.2, 2, 10, 1.25),
  preset('Sonnet 4.6', 'Sonnet 4.6', 'Anthropic', 0.3, 3, 15, 1.25),
  preset('Fable5', 'Fable5', 'Anthropic', 1, 10, 50, 1.25),
  preset('DeepSeek V4 Flash', 'DeepSeek V4 Flash', 'DeepSeek', 0.0028, 0.14, 0.28),
  preset('DeepSeek V4 Pro', 'DeepSeek V4 Pro', 'DeepSeek', 0.003625, 0.435, 0.87),
];

export function buildFallbackPriceCatalog(now = new Date()): PriceCatalog {
  return {
    fetchedAt: now.toISOString(),
    sourceUrl: FALLBACK_SOURCE_URL,
    presets: FALLBACK_PRICE_PRESETS,
  };
}

function preset(
  id: string,
  label: string,
  vendor: string,
  cache: number,
  input: number,
  output: number,
  cacheWriteMultiplier = 0,
): PricePreset {
  return {
    id,
    label,
    vendor,
    source: 'fallback',
    pricesUsdPer1M: {
      cache,
      input,
      output,
      cache_write: roundPrice(input * cacheWriteMultiplier),
    },
    derived: cacheWriteMultiplier
      ? { cache_write: `${cacheWriteMultiplier}× input` }
      : undefined,
  };
}

function roundPrice(value: number) {
  return Number(value.toFixed(6));
}