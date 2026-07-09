import { NextResponse } from 'next/server';
import { buildFallbackPriceCatalog } from '@/lib/pricing/fallback';
import { readLatestPriceCatalog } from '@/lib/pricing/postgres';
import type { PricingResponse } from '@/lib/pricing/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export async function GET() {
  try {
    const stored = await readLatestPriceCatalog();
    if (!stored) return fallbackResponse('pricing catalog is not synced yet');

    const updatedAtMs = new Date(stored.updatedAt).getTime();
    const stale = !Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > STALE_AFTER_MS;

    return NextResponse.json({
      catalog: stored.catalog,
      source: 'postgres',
      updatedAt: stored.updatedAt,
      stale,
    } satisfies PricingResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return fallbackResponse(message);
  }
}

function fallbackResponse(error: string) {
  return NextResponse.json({
    catalog: buildFallbackPriceCatalog(),
    source: 'fallback',
    stale: true,
    error,
  } satisfies PricingResponse);
}