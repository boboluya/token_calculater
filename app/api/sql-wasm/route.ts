import { readFile } from 'node:fs/promises';

export const dynamic = 'force-static';

export async function GET() {
  const wasm = await readFile(
    new URL('../../../node_modules/sql.js/dist/sql-wasm.wasm', import.meta.url),
  );

  return new Response(wasm, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'application/wasm',
    },
  });
}