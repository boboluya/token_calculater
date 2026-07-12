'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { gatherDailyTotals, type DailyEntry } from '@/lib/data';
import {
  getAdapter,
  DEFAULT_ADAPTER_ID,
  type AssistantAdapter,
} from '@/lib/assistants';

const STORAGE_KEY = 'token_calculator_usage_cache';

interface CachePayload {
  directoryName: string;
  fileCount: number;
  data: DailyEntry[];
  savedAt: number;
  assistantId: string;
}

export interface UsageDataState {
  data: DailyEntry[];
  directoryName: string | null;
  fileCount: number;
  loading: boolean;
  error: string | null;
  /** Unix ms — when the data was last persisted (or 0 if no cache loaded). */
  savedAt: number;
  /** 当前选中的适配器 id */
  assistantId: string;
  /** 切换适配器 */
  setAssistant: (id: string) => void;
  selectDirectory: () => void;
  directoryInput: ReactNode;
}

const UsageDataContext = createContext<UsageDataState | null>(null);

function loadCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.directoryName !== 'string' ||
      typeof parsed.fileCount !== 'number' ||
      typeof parsed.savedAt !== 'number' ||
      typeof parsed.assistantId !== 'string' ||
      !Array.isArray(parsed.data)
    ) {
      return null;
    }
    return parsed as CachePayload;
  } catch {
    return null;
  }
}

function saveCache(payload: CachePayload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable — silently ignore.
  }
}

export function UsageDataProvider({ children }: { children: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<DailyEntry[]>([]);
  const [directoryName, setDirectoryName] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [assistantId, setAssistantId] = useState(DEFAULT_ADAPTER_ID);

  // 初始化时从 localStorage 恢复缓存
  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setData(cached.data);
      setDirectoryName(cached.directoryName);
      setFileCount(cached.fileCount);
      setSavedAt(cached.savedAt);
      // 如果缓存的 assistantId 在当前注册表中存在，则恢复它
      if (getAdapter(cached.assistantId)) {
        setAssistantId(cached.assistantId);
      }
    }
    setHydrated(true);
  }, []);

  const setAssistant = useCallback((id: string) => {
    if (getAdapter(id)) {
      setAssistantId(id);
    }
  }, []);

  const selectDirectory = useCallback(() => inputRef.current?.click(), []);

  const readDirectory = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      event.target.value = '';
      if (!selectedFiles.length) return;

      const adapter = getAdapter(assistantId);
      if (!adapter) {
        setError(`未找到适配器: ${assistantId}`);
        return;
      }

      const name = selectedFiles[0].webkitRelativePath.split('/')[0] || '所选目录';
      const matchedFiles = selectedFiles
        .filter((f) => adapter.matchFile(f.webkitRelativePath))
        .sort((a, b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath));

      setLoading(true);
      setError(null);

      try {
        if (!matchedFiles.length) {
          setData([]);
          setFileCount(0);
          setDirectoryName(name);
          setSavedAt(0);
          setError(`所选目录中未找到符合 ${adapter.name} 格式（${adapter.filePattern}）的文件`);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const contents = await Promise.all(matchedFiles.map((f) => f.text()));

        // 每个适配器各自解析其文件格式，再用 gatherDailyTotals 按日期合并
        const allEntries = matchedFiles.flatMap((f, i) =>
          adapter.parseContent(contents[i], f.webkitRelativePath),
        );
        const daily = gatherDailyTotals(allEntries);
        const now = Date.now();

        setData(daily);
        setFileCount(matchedFiles.length);
        setDirectoryName(name);
        setSavedAt(now);

        saveCache({
          directoryName: name,
          fileCount: matchedFiles.length,
          data: daily,
          savedAt: now,
          assistantId,
        });
      } catch (reason) {
        setData([]);
        setFileCount(0);
        setDirectoryName(null);
        setSavedAt(0);
        setError(reason instanceof Error ? reason.message : '目录读取失败');
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    },
    [assistantId],
  );

  // 在 hydration 完成前不暴露 data，避免 SSR/CSR 闪烁导致的图表空值问题
  const value = useMemo(
    () => ({
      data: hydrated ? data : [],
      directoryName,
      fileCount,
      loading: !hydrated || loading,
      error: hydrated ? error : null,
      savedAt,
      assistantId,
      setAssistant,
      selectDirectory,
      directoryInput: (
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          aria-hidden="true"
          onChange={readDirectory}
          {...({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      ),
    }),
    [
      data,
      directoryName,
      error,
      fileCount,
      hydrated,
      loading,
      readDirectory,
      savedAt,
      assistantId,
      setAssistant,
      selectDirectory,
    ],
  );

  return <UsageDataContext.Provider value={value}>{children}</UsageDataContext.Provider>;
}

export function useUsageData() {
  const value = useContext(UsageDataContext);
  if (!value) throw new Error('useUsageData must be used within UsageDataProvider');
  return value;
}