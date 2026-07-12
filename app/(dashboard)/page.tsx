'use client';

import { Dashboard } from '../components/Dashboard';

export default function ChartsPage() {

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
          目前支持解析 Cursor 本地助手（~/.cursor-local-assistant-v2）的用量记录，更多工具接入中。
        </p>
      </div>
      <Dashboard />
    </div>
  );
}