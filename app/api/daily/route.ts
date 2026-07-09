import { NextResponse } from 'next/server';
import { gatherDailyTotals } from '@/lib/data';

export async function GET() {
  const dataDir = process.env.USAGE_DATA_DIR;
  const data = dataDir ? gatherDailyTotals(dataDir) : [];
  return NextResponse.json(data);
}