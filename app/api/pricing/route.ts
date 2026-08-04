import { NextResponse } from 'next/server';
import {
  fetchAggregatePriceCatalog,
  ModelPricingRequestError,
} from "@/lib/pricing/aggregate";
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
      // Keep the configured backend URL server-only.
      catalog: { ...catalog, sourceUrl: 'backend' },
      source: 'backend',
      updatedAt: catalog.fetchedAt,
      stale: false,
    } satisfies PricingResponse);
  } catch (error) {
    // Keep the full upstream diagnosis in server logs only. Never log the key.
    if (error instanceof ModelPricingRequestError) {
      console.error("Model pricing upstream request failed", {
        method: "GET",
        url: error.url,
        status: error.status,
        responseBody: error.responseBody || "<empty>",
      });
    } else {
      console.error("Model pricing request failed", {
        method: "GET",
        baseUrl,
        path: "/model/model_pricing/aggregate",
        error,
      });
    }

    const status =
      error instanceof ModelPricingRequestError ? error.status : undefined;
    return fallbackResponse(
      status
        ? `上游定价接口返回 HTTP ${status}（/model/model_pricing/aggregate），请检查服务端 MODEL_PRICING_API_BASE_URL 和后端路由`
        : "动态价格接口请求失败，请检查服务端配置和后端日志",
    );
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