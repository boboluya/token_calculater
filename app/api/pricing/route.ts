import { NextResponse } from 'next/server';
import { fetchAggregatePriceCatalog } from '@/lib/pricing/aggregate';
import { buildFallbackPriceCatalog } from '@/lib/pricing/fallback';
import type { PricingResponse } from '@/lib/pricing/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const baseUrl = process.env.MODEL_PRICING_API_BASE_URL;
  const apiKey = process.env.MODEL_PRICING_API_KEY;

  if (!baseUrl || !apiKey) {
    return fallbackResponse('Model pricing API environment variables are not configured');
  }

  try {
    const catalog = await fetchAggregatePriceCatalog(baseUrl, apiKey);

    return NextResponse.json({
      catalog,
      source: 'backend',
      updatedAt: catalog.fetchedAt,
      stale: false,
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