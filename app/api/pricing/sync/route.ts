import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fetchOpenRouterPriceCatalog } from '@/lib/pricing/openrouter';
import {
  readSyncState,
  writeLatestPriceCatalog,
  writeSyncState,
} from '@/lib/pricing/postgres';
import type { SyncState } from '@/lib/pricing/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return syncPricing(request);
}

export async function POST(request: NextRequest) {
  return syncPricing(request);
}

async function syncPricing(request: NextRequest) {
  const authError = authorizeCron(request);
  if (authError) return authError;

  const now = new Date();
  const currentHour = toUtcHourKey(now);
  const force = new URL(request.url).searchParams.get('force') === '1';
  const graceMinutes = readGraceMinutes();

  if (!force && now.getUTCMinutes() >= graceMinutes) {
    return NextResponse.json({
      ok: true,
      skipped: 'outside_grace_window',
      currentHour,
      graceMinutes,
    });
  }

  const state = await readSyncState();
  if (!force && state.lastSuccessHour === currentHour) {
    return NextResponse.json({
      ok: true,
      skipped: 'already_synced',
      currentHour,
      lastSuccessAt: state.lastSuccessAt,
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'OPENROUTER_API_KEY environment variable is not set' },
      { status: 500 },
    );
  }

  await writeSyncState({
    ...state,
    lastAttemptHour: currentHour,
    lastAttemptAt: now.toISOString(),
  });

  try {
    const catalog = await fetchOpenRouterPriceCatalog(apiKey);
    if (!catalog.presets.length) {
      throw new Error('OpenRouter returned no usable pricing presets');
    }

    await writeLatestPriceCatalog(catalog);

    const successState: SyncState = {
      lastAttemptHour: currentHour,
      lastAttemptAt: now.toISOString(),
      lastSuccessHour: currentHour,
      lastSuccessAt: new Date().toISOString(),
    };
    await writeSyncState(successState);

    return NextResponse.json({
      ok: true,
      synced: true,
      currentHour,
      presets: catalog.presets.length,
      fetchedAt: catalog.fetchedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeSyncState({
      ...state,
      lastAttemptHour: currentHour,
      lastAttemptAt: now.toISOString(),
      lastError: message,
    });

    return NextResponse.json(
      { ok: false, error: message, currentHour },
      { status: 502 },
    );
  }
}

function authorizeCron(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

function toUtcHourKey(date: Date) {
  return date.toISOString().slice(0, 13);
}

function readGraceMinutes() {
  const value = Number(process.env.PRICING_SYNC_GRACE_MINUTES ?? 10);
  if (!Number.isFinite(value)) return 10;

  return Math.min(Math.max(Math.floor(value), 1), 60);
}