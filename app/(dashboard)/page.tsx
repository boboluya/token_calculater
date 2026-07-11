import { Dashboard } from '../components/Dashboard';
import { gatherDailyTotals } from '@/lib/data';

export default function ChartsPage() {
  const dataDir = process.env.USAGE_DATA_DIR;
  // null = no data source (needs client fetch), [] = data source exists but empty
  const initialData = dataDir ? gatherDailyTotals(dataDir) : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cursor Token 用量趋势</h1>
      <p className="text-sm text-gray-400 mb-6">
        数据实时来自 usage.json 文件 · 刷新页面获取最新
      </p>
      <Dashboard initialData={initialData} />
    </div>
  );
}