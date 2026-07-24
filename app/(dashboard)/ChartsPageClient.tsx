'use client';

import { Dashboard } from '../components/Dashboard';

/** 首页看板 UI（client）；SEO metadata 放在同级 page.tsx 服务端导出 */
export default function ChartsPageClient() {
  return (
    <div>
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Usage monitor
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Token 用量趋势
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          汇总 Cursor、Claude Code、Codex 与 OpenCode 的本地 Token 用量记录。
        </p>
      </div>
      <Dashboard />
    </div>
  );
}