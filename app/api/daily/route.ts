import { NextResponse } from 'next/server';
import { gatherDailyTotals } from '@/lib/data';

export async function GET() {
  const dataDir = process.env.USAGE_DATA_DIR;
  if (!dataDir) {
    return NextResponse.json(
      { error: 'USAGE_DATA_DIR environment variable is not set' },
      { status: 500 }
    );
  }
  const data = gatherDailyTotals(dataDir);
  return NextResponse.json(data);
}