'use client';

import { getAssistantSource } from '@/lib/assistants';
import { SummaryCards } from './SummaryCards';
import { TokenCharts } from './TokenCharts';
import { UsageDataSource } from './UsageDataSource';
import { useUsageData } from './UsageDataProvider';

export function Dashboard() {
  const source = useUsageData();
  const capabilities = getAssistantSource(source.assistantId)?.capabilities;

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
      />
      {source.directoryInput}
      <SummaryCards data={source.data} capabilities={capabilities} />
      <TokenCharts data={source.data} capabilities={capabilities} />
    </>
  );
}