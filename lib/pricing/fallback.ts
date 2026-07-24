import type { PriceCatalog, PricePreset } from './types';

export const FALLBACK_SOURCE_URL = 'local:fallback-pricing';
export const DEFAULT_PRICE_PRESET_ID = 'GPT-5.5';

/** 与 Go 聚合接口 USD 计划对齐的离线兜底（2026-07-24 拉取） */
export const FALLBACK_PRICE_PRESETS: PricePreset[] = [
  // OpenAI
  preset('GPT-5.5', 'GPT-5.5', 'OpenAI', 0.5, 5, 30, 0),
  preset('GPT-5.4', 'GPT-5.4', 'OpenAI', 0.25, 2.5, 15, 0),
  preset('GPT-5.4 Mini', 'GPT-5.4 Mini', 'OpenAI', 0.075, 0.75, 4.5, 0),
  preset('GPT-5.6 Luna', 'GPT-5.6 Luna', 'OpenAI', 0.1, 1, 6, 1.25),
  preset('GPT-5.6 Sol', 'GPT-5.6 Sol', 'OpenAI', 0.5, 5, 30, 6.25),
  preset('GPT-5.6 Terra', 'GPT-5.6 Terra', 'OpenAI', 0.25, 2.5, 15, 3.125),
  // Anthropic
  preset('Opus 4.8', 'Opus 4.8', 'Anthropic', 0.5, 5, 25, 6.25),
  preset('Opus 4.7', 'Opus 4.7', 'Anthropic', 0.5, 5, 25, 6.25),
  preset('Sonnet 5', 'Sonnet 5', 'Anthropic', 0.2, 2, 10, 2.5),
  preset('Fable5', 'Fable5', 'Anthropic', 1, 10, 50, 12.5),
  // Moonshot
  preset('Kimi K2.6', 'Kimi K2.6', 'Moonshot', 0.16, 0.95, 4, 0),
  preset('Kimi K3', 'Kimi K3', 'Moonshot', 0.3, 3, 15, 0),
  // Z.AI
  preset('GLM-5', 'GLM-5', 'Z.AI', 0.19, 0.95, 3.15, 0),
  preset('GLM-5 Turbo', 'GLM-5 Turbo', 'Z.AI', 0.24, 1.2, 4, 0),
  preset('GLM-5.1', 'GLM-5.1', 'Z.AI', 0.1794, 0.966, 3.036, 0),
  preset('GLM-5.2', 'GLM-5.2', 'Z.AI', 0.18122, 0.9758, 3.0668, 0),
  preset('GLM-5V Turbo', 'GLM-5V Turbo', 'Z.AI', 0.24, 1.2, 4, 0),
  // DeepSeek
  preset('DeepSeek V4 Flash', 'DeepSeek V4 Flash', 'DeepSeek', 0.0196, 0.098, 0.196, 0),
  preset('DeepSeek V4 Pro', 'DeepSeek V4 Pro', 'DeepSeek', 0.00363, 0.435, 0.87, 0),
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
  cacheWrite: number,
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
      cache_write: roundPrice(cacheWrite),
    },
  };
}

function roundPrice(value: number) {
  return Number(value.toFixed(6));
}