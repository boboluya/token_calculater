'use client';

import { SummaryCards } from './SummaryCards';
import { TokenCharts } from './TokenCharts';
import { UsageDataSource } from './UsageDataSource';
import { useUsageData } from './UsageDataProvider';

export function Dashboard() {
  const source = useUsageData();

  return (
    <>
      <UsageDataSource
        directoryName={source.directoryName}
        days={source.data.length}
        fileCount={source.fileCount}
        loading={source.loading}
        error={source.error}
        savedAt={source.savedAt}
        onSelect={source.selectDirectory}
      />
      {source.directoryInput}
      <SummaryCards data={source.data} />
      <TokenCharts data={source.data} />
    </>
  );
}