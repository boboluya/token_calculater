import postgres from 'postgres';
import type { PriceCatalog, StoredPricingCatalog, SyncState } from './types';

const LATEST_KEY = 'openrouter:latest';
const SYNC_STATE_KEY = 'openrouter:sync-state';

let client: postgres.Sql | null = null;

function getClient() {
  if (client) return client;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

  return client;
}

export async function ensurePricingCacheTable() {
  const sql = getClient();

  await sql`
    create table if not exists pricing_cache (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
}

export async function readLatestPriceCatalog(): Promise<StoredPricingCatalog | null> {
  await ensurePricingCacheTable();
  const sql = getClient();
  const rows = await sql<{ value: PriceCatalog; updated_at: Date }[]>`
    select value, updated_at
    from pricing_cache
    where key = ${LATEST_KEY}
    limit 1
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    catalog: row.value,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function writeLatestPriceCatalog(catalog: PriceCatalog) {
  await ensurePricingCacheTable();
  const sql = getClient();

  await sql`
    insert into pricing_cache (key, value, updated_at)
    values (${LATEST_KEY}, ${sql.json(catalog as unknown as postgres.JSONValue)}, now())
    on conflict (key) do update set
      value = excluded.value,
      updated_at = excluded.updated_at
  `;
}

export async function readSyncState(): Promise<SyncState> {
  await ensurePricingCacheTable();
  const sql = getClient();
  const rows = await sql<{ value: SyncState }[]>`
    select value
    from pricing_cache
    where key = ${SYNC_STATE_KEY}
    limit 1
  `;

  return rows[0]?.value ?? {};
}

export async function writeSyncState(state: SyncState) {
  await ensurePricingCacheTable();
  const sql = getClient();

  await sql`
    insert into pricing_cache (key, value, updated_at)
    values (${SYNC_STATE_KEY}, ${sql.json(state as unknown as postgres.JSONValue)}, now())
    on conflict (key) do update set
      value = excluded.value,
      updated_at = excluded.updated_at
  `;
}