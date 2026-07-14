"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2Icon,
  FilesIcon,
  FolderOpenIcon,
  FolderSearch2Icon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ASSISTANT_SOURCES, getAssistantSource } from "@/lib/assistants";

const SOURCE_ICON_URL: Record<string, string> = {
  cursor: "/provider_icon/cursor.png",
  "claude-code": "/provider_icon/claudecode.png",
  codex: "/provider_icon/openai.svg",
  opencode: "/provider_icon/opencode.ico",
};

interface Props {
  directoryName: string | null;
  days: number;
  fileCount: number;
  loading: boolean;
  error: string | null;
  savedAt: number;
  assistantId: string;
  onAssistantChange: (id: string) => void;
  onSelect: () => void;
}

interface SourceStatus {
  kind: "loading" | "error" | "cached" | "empty" | "idle";
  label: string;
  icon: LucideIcon;
  className: string;
}

interface SourceStatusInput {
  loading: boolean;
  error: string | null;
  savedAt: number;
  days: number;
}

type OperatingSystem = "Linux" | "Windows" | "macOS";

function detectOperatingSystem(): OperatingSystem {
  const platform = `${navigator.platform} ${navigator.userAgent}`;

  if (/win/i.test(platform)) return "Windows";
  if (/mac/i.test(platform)) return "macOS";
  if (/linux|x11/i.test(platform)) return "Linux";
  return "Windows";
}

function subscribeToPlatform() {
  return () => undefined;
}

function useOperatingSystem() {
  return useSyncExternalStore(
    subscribeToPlatform,
    detectOperatingSystem,
    () => "Windows",
  );
}

function resolveSourceStatus({
  loading,
  error,
  savedAt,
  days,
}: SourceStatusInput): SourceStatus {
  if (loading) {
    return {
      kind: "loading",
      label: "正在读取",
      icon: LoaderCircleIcon,
      className: "bg-blue-50 text-blue-700 ring-blue-600/15",
    };
  }

  if (error) {
    return {
      kind: "error",
      label: "读取失败",
      icon: TriangleAlertIcon,
      className: "bg-rose-50 text-rose-700 ring-rose-600/15",
    };
  }

  if (savedAt > 0 && days > 0) {
    return {
      kind: "cached",
      label: "已缓存",
      icon: CheckCircle2Icon,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    };
  }

  if (savedAt > 0) {
    return {
      kind: "empty",
      label: "暂无数据",
      icon: FilesIcon,
      className: "bg-slate-100 text-slate-600 ring-slate-500/15",
    };
  }

  return {
    kind: "idle",
    label: "等待选择",
    icon: FolderOpenIcon,
    className: "bg-amber-50 text-amber-700 ring-amber-600/15",
  };
}

export function UsageDataSource({
  days,
  loading,
  error,
  savedAt,
  assistantId,
  onAssistantChange,
  onSelect,
}: Props) {
  const source = getAssistantSource(assistantId);
  const operatingSystem = useOperatingSystem();

  const selectionPath = source?.selectionPaths.find(
    (selection) => selection.os === operatingSystem,
  );

  const hasCache = savedAt > 0;
  const status = resolveSourceStatus({ loading, error, savedAt, days });
  const StatusIcon = status.icon;
  const isLoading = status.kind === "loading";

  return (
    <Card className="mb-7 gap-0 border-slate-200 bg-white shadow-none">
      <CardContent className="p-0">
        {/* ── 助手图标选择行 ── */}
        <div className="px-5 py-4 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            数据来源
          </p>
          <div className="flex flex-wrap gap-2">
            {ASSISTANT_SOURCES.map((sourceOption) => {
              const iconUrl = SOURCE_ICON_URL[sourceOption.id];
              const selected = sourceOption.id === assistantId;
              const isReady = sourceOption.ready;

              if (!isReady) {
                // 未实现的数据源灰显且不可点击。
                return (
                  <span
                    key={sourceOption.id}
                    title={sourceOption.description}
                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-slate-150 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-350"
                  >
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt={sourceOption.name}
                        width={16}
                        height={16}
                        className="size-4 opacity-40"
                      />
                    )}
                    {sourceOption.name}
                    <span className="ml-0.5 rounded bg-slate-200 px-1 py-px text-[10px] text-slate-500">
                      待实现
                    </span>
                  </span>
                );
              }

              return (
                <button
                  key={sourceOption.id}
                  type="button"
                  onClick={() => onAssistantChange(sourceOption.id)}
                  title={sourceOption.description}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                    selected
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/15"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={sourceOption.name}
                      width={16}
                      height={16}
                      className="size-4"
                    />
                  )}
                  {sourceOption.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-slate-400">
            原始目录仅在浏览器中解析，不会上传。
          </p>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── 状态信息 + 目录按钮 ── */}
        <div className="flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
              <FolderSearch2Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-950">本地用量数据</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${status.className}`}
                >
                  <StatusIcon
                    className={`size-3 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {status.label}
                </span>
              </div>
              {source && (
                <div className="mt-3 max-w-4xl">
                  <p className="mb-2 text-xs font-semibold text-slate-700">
                    目录选择器中请选择
                  </p>
                  {selectionPath ? (
                    <div className="flex min-w-0 items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900">
                      <FolderOpenIcon className="mt-0.5 size-4 shrink-0 text-slate-500" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-500">
                          {selectionPath.os}系统目录位置
                        </div>
                        <code className="mt-0.5 block break-all text-xs font-semibold leading-5 text-slate-900 sm:text-sm">
                          {selectionPath.path}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                      未能识别当前操作系统，请选择 {source.storagePath} 所在目录。
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    选择整个目录，将自动查找 <code>{source.filePattern}</code>
                  </p>
                </div>
              )}
              {/*{directoryName && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <FolderOpenIcon className="size-3.5 shrink-0 text-slate-400" />
                  <span className="shrink-0 text-slate-400">本地目录：</span>
                  <span className="truncate">{directoryName}</span>
                </p>
              )}
              <p
                className={`mt-1 text-sm ${isError ? "text-rose-600" : "text-slate-500"}`}
              >
                {statusText}
              </p>*/}
            </div>
          </div>

          <div className="self-start lg:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelect}
              disabled={loading}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <FolderOpenIcon className="size-3.5" />
              {hasCache ? "重新选择目录" : "选择目录"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
