export type PriceSource = 'backend' | 'openrouter' | 'fallback';
export type PriceCurrency = 'USD' | 'CNY';
export type UsageKind = 'cache' | 'input' | 'output' | 'cache_write';

export type UnitPrices = Record<UsageKind, number>;

export interface PriceAmount {
  currency: PriceCurrency;
  per1M: UnitPrices;
}

export interface ProviderMetadata {
  name: string;
  type?: string;
  url?: string;
  introduction?: string;
  featured?: boolean;
  sortOrder?: number;
  /** 供应商图标 Data URL（data:image/...;base64,...） */
  iconData?: string;
}

export interface PricePreset {
  id: string;
  label: string;
  vendor: string;
  provider?: ProviderMetadata;
  pricing: PriceAmount;
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
  source: 'backend' | 'fallback';
  updatedAt?: string;
  stale: boolean;
  error?: string;
}