import type { QueryExecResult, SqlValue } from 'sql.js';

export type SqliteRow = Record<string, SqlValue>;

let enginePromise: ReturnType<typeof importSqliteEngine> | null = null;

async function importSqliteEngine() {
  const { default: initSqlJs } = await import('sql.js');
  return initSqlJs({ locateFile: () => '/api/sql-wasm' });
}

function rowsFromResult(result: QueryExecResult | undefined): SqliteRow[] {
  if (!result) return [];

  return result.values.map((values) =>
    Object.fromEntries(result.columns.map((column, index) => [column, values[index]])),
  );
}

export async function querySqliteFile(file: File, query: string): Promise<SqliteRow[]> {
  enginePromise ??= importSqliteEngine();
  const SQL = await enginePromise;
  const database = new SQL.Database(new Uint8Array(await file.arrayBuffer()));

  try {
    return rowsFromResult(database.exec(query)[0]);
  } finally {
    database.close();
  }
}