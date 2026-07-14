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
  DEFAULT_ASSISTANT_ID,
  getAssistantSource,
} from '@/lib/assistants';
import {
  matchClaudeCodeFile,
  parseClaudeCodeContent,
} from '@/lib/assistants/claude-code';
import {
  matchCodexFile,
  parseCodexFile,
} from '@/lib/assistants/codex';
import {
  matchOpenCodeFile,
  parseOpenCodeFile,
} from '@/lib/assistants/opencode';
import {
  matchCursorFile,
  parseCursorContent,
} from '@/lib/assistants/cursor';

const LEGACY_STORAGE_KEY = 'token_calculator_usage_cache';
const CACHE_KEY_PREFIX = 'token_calculator_usage_cache:';
const SELECTED_ASSISTANT_KEY = 'token_calculator_selected_assistant';

function cacheKey(assistantId: string) {
  return `${CACHE_KEY_PREFIX}${assistantId}`;
}

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
  /** 当前选中的数据源 id */
  assistantId: string;
  /** 切换数据源 */
  setAssistant: (id: string) => void;
  selectDirectory: () => void;
  directoryInput: ReactNode;
}

const UsageDataContext = createContext<UsageDataState | null>(null);

function parseCache(raw: string | null, assistantId?: string): CachePayload | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.directoryName !== 'string' ||
      typeof parsed.fileCount !== 'number' ||
      typeof parsed.savedAt !== 'number' ||
      typeof parsed.assistantId !== 'string' ||
      (assistantId !== undefined && parsed.assistantId !== assistantId) ||
      !Array.isArray(parsed.data)
    ) {
      return null;
    }
    return parsed as CachePayload;
  } catch {
    return null;
  }
}

function loadCache(assistantId: string): CachePayload | null {
  return parseCache(localStorage.getItem(cacheKey(assistantId)), assistantId);
}

function migrateLegacyCache(): CachePayload | null {
  const cached = parseCache(localStorage.getItem(LEGACY_STORAGE_KEY));
  if (!cached || !getAssistantSource(cached.assistantId)?.ready) return null;

  saveCache(cached);
  localStorage.setItem(SELECTED_ASSISTANT_KEY, cached.assistantId);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  return cached;
}

function saveCache(payload: CachePayload) {
  try {
    localStorage.setItem(cacheKey(payload.assistantId), JSON.stringify(payload));
  } catch {
    // Storage full or unavailable — silently ignore.
  }
}

function clearCache(assistantId: string) {
  localStorage.removeItem(cacheKey(assistantId));
}

function loadSelectedAssistant(): string {
  const selected = localStorage.getItem(SELECTED_ASSISTANT_KEY);
  return selected && getAssistantSource(selected)?.ready ? selected : DEFAULT_ASSISTANT_ID;
}

function matchesUsageFile(assistantId: string, relativePath: string): boolean {
  switch (assistantId) {
    case 'cursor':
      return matchCursorFile(relativePath);
    case 'claude-code':
      return matchClaudeCodeFile(relativePath);
    case 'codex':
      return matchCodexFile(relativePath);
    case 'opencode':
      return matchOpenCodeFile(relativePath);
    default:
      return false;
  }
}

async function parseUsageFile(assistantId: string, file: File): Promise<DailyEntry[]> {
  switch (assistantId) {
    case 'cursor':
      return parseCursorContent(await file.text());
    case 'claude-code':
      return parseClaudeCodeContent(await file.text());
    case 'codex':
      return parseCodexFile(file);
    case 'opencode':
      return parseOpenCodeFile(file);
    default:
      return [];
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
  const [assistantId, setAssistantId] = useState(DEFAULT_ASSISTANT_ID);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const migrated = migrateLegacyCache();
      const selectedId = migrated?.assistantId ?? loadSelectedAssistant();
      const cached = migrated ?? loadCache(selectedId);

      setAssistantId(selectedId);
      if (cached) {
        setData(cached.data);
        setDirectoryName(cached.directoryName);
        setFileCount(cached.fileCount);
        setSavedAt(cached.savedAt);
      }
      setHydrated(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const setAssistant = useCallback((id: string) => {
    if (id === assistantId || !getAssistantSource(id)?.ready) return;

    const cached = loadCache(id);
    setAssistantId(id);
    setData(cached?.data ?? []);
    setDirectoryName(cached?.directoryName ?? null);
    setFileCount(cached?.fileCount ?? 0);
    setSavedAt(cached?.savedAt ?? 0);
    setError(null);
    localStorage.setItem(SELECTED_ASSISTANT_KEY, id);
  }, [assistantId]);

  const selectDirectory = useCallback(() => inputRef.current?.click(), []);

  const readDirectory = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      event.target.value = '';
      if (!selectedFiles.length) return;

      const source = getAssistantSource(assistantId);
      if (!source?.ready) {
        setError(`数据源不可用: ${assistantId}`);
        return;
      }

      const name = selectedFiles[0].webkitRelativePath.split('/')[0] || '所选目录';
      const matchedFiles = selectedFiles
        .filter((file) => matchesUsageFile(assistantId, file.webkitRelativePath))
        .sort((a, b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath));

      setLoading(true);
      setError(null);

      try {
        if (!matchedFiles.length) {
          setData([]);
          setFileCount(0);
          setDirectoryName(name);
          setSavedAt(0);
          setError(`所选目录中未找到符合 ${source.name} 格式（${source.filePattern}）的文件`);
          clearCache(assistantId);
          return;
        }

        const parsedFiles = await Promise.all(
          matchedFiles.map((file) => parseUsageFile(assistantId, file)),
        );
        const daily = gatherDailyTotals(parsedFiles.flat());
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
        clearCache(assistantId);
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