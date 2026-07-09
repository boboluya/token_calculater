export type PriceSource = 'openrouter' | 'fallback';
export type UsageKind = 'cache' | 'input' | 'output' | 'cache_write';

export type UnitPrices = Record<UsageKind, number>;

export interface PricePreset {
  id: string;
  label: string;
  vendor: string;
  pricesUsdPer1M: UnitPrices;
  source: PriceSource;
  derived?: Partial<Record<UsageKind, string>>;
}

export interface PriceCatalog {
  fetchedAt: string;
  sourceUrl: string;
  presets: PricePreset[];
}

export interface SyncState {
  lastAttemptHour?: string;
  lastAttemptAt?: string;
  lastSuccessHour?: string;
  lastSuccessAt?: string;
  lastError?: string;
}

export interface StoredPricingCatalog {
  catalog: PriceCatalog;
  updatedAt: string;
}

export interface PricingResponse {
  catalog: PriceCatalog;
  source: 'postgres' | 'fallback';
  updatedAt?: string;
  stale: boolean;
  error?: string;
}