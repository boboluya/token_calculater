import { Dashboard } from '../components/Dashboard';
import { gatherDailyTotals } from '@/lib/data';

export default function ChartsPage() {
  const dataDir = process.env.USAGE_DATA_DIR;
  // null = no data source (needs client fetch), [] = data source exists but empty
  const initialData = dataDir ? gatherDailyTotals(dataDir) : null;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Usage monitor
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Cursor Token 用量趋势
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          用量会在每次扫描时按日期自动聚合，图表与汇总始终基于同一份本地记录。
        </p>
      </div>
      <Dashboard initialData={initialData} />
    </div>
  );
}