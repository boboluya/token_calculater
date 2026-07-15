'use client';

import { useMemo } from 'react';
import {
  ASSISTANT_SOURCES,
  type AssistantCapabilities,
  getAssistantSource,
} from '@/lib/assistants';
import { SummaryCards } from './SummaryCards';
import { TokenCharts } from './TokenCharts';
import { UsageDataSource } from './UsageDataSource';
import { useUsageData } from './UsageDataProvider';

/** 取所有勾选 agent 的 capabilities 并集 */
function mergeCapabilities(agentIds: string[]): AssistantCapabilities | null {
  if (agentIds.length === 0) return null;
  const selected = ASSISTANT_SOURCES.filter((s) => agentIds.includes(s.id));
  if (selected.length === 0) return null;

  return {
    tokenBreakdown: selected.every((s) => s.capabilities.tokenBreakdown),
    calls: selected.some((s) => s.capabilities.calls),
    turns: selected.some((s) => s.capabilities.turns),
    callsLabel: selected.every((s) => s.capabilities.callsLabel === '会话数')
      ? '会话数'
      : '调用次数',
  };
}

export function Dashboard() {
  const source = useUsageData();

  const capabilities = useMemo(() => {
    if (source.aggregationMode) {
      return mergeCapabilities(source.aggregationAgentIds);
    }
    return getAssistantSource(source.assistantId)?.capabilities ?? null;
  }, [source.aggregationMode, source.aggregationAgentIds, source.assistantId]);

  if (!capabilities) return null;

  return (
    <>
      <UsageDataSource
        directoryName={source.directoryName}
        days={source.data.length}
        fileCount={source.fileCount}
        loading={source.loading}
        error={source.error}
        savedAt={source.savedAt}
        assistantId={source.assistantId}
        onAssistantChange={source.setAssistant}
        onSelect={source.selectDirectory}
        aggregationMode={source.aggregationMode}
        aggregationAgentIds={source.aggregationAgentIds}
        onToggleAggregationMode={source.toggleAggregationMode}
        onToggleAggregationAgent={source.toggleAggregationAgent}
      />
      {source.directoryInput}
      <SummaryCards data={source.data} capabilities={capabilities} />
      <TokenCharts data={source.data} capabilities={capabilities} />
    </>
  );
}