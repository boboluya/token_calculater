export interface AssistantCapabilities {
  tokenBreakdown: boolean;
  calls: boolean;
  turns: boolean;
  callsLabel: string;
}

export interface AssistantSelectionPath {
  os: 'Linux' | 'Windows' | 'macOS';
  path: string;
}

export interface AssistantSource {
  id: string;
  name: string;
  description: string;
  filePattern: string;
  ready: boolean;
  capabilities: AssistantCapabilities;
  /** 各操作系统的目录选择器目标目录 */
  selectionPaths: AssistantSelectionPath[];
  /** 本地数据存储路径（相对于用户主目录），用于展示给用户 */
  storagePath: string;
  /** 数据粒度说明 */
  storageNote: string;
}

const DETAILED_CAPABILITIES: AssistantCapabilities = {
  tokenBreakdown: true,
  calls: true,
  turns: true,
  callsLabel: '调用次数',
};

export const ASSISTANT_SOURCES: AssistantSource[] = [
  {
    id: 'cursor',
    name: 'Cursor 助手',
    description: 'Cursor 本地助手插件（~/.cursor-local-assistant-v2）的 usage.json 用量记录',
    filePattern: 'history/usage.json',
    ready: true,
    capabilities: DETAILED_CAPABILITIES,
    selectionPaths: [
      { os: 'Linux', path: '~/.cursor-local-assistant-v2/' },
      { os: 'Windows', path: '%USERPROFILE%\\.cursor-local-assistant-v2\\' },
      { os: 'macOS', path: '~/.cursor-local-assistant-v2/' },
    ],
    storagePath: '~/.cursor-local-assistant-v2/history/usage.json*',
    storageNote: 'Cursor 原生 agent-transcripts 不含 token 数据；这里读取本地助手插件生成的 usage.json 用量记录。',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Claude Code 本地项目会话（~/.claude/projects）的 JSONL 用量记录',
    filePattern: '**/*.jsonl',
    ready: true,
    capabilities: DETAILED_CAPABILITIES,
    selectionPaths: [
      { os: 'Linux', path: '~/.claude/' },
      { os: 'Windows', path: '%USERPROFILE%\\.claude\\' },
      { os: 'macOS', path: '~/.claude/' },
    ],
    storagePath: '~/.claude/projects/<项目名>/',
    storageNote: '每会话一个 JSONL 文件，含完整 usage 对象（input/output/cache）。需递归扫描 subagents/ 子目录，排除 .meta.json。',
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI Codex CLI 的本地会话总 Token 用量',
    filePattern: 'state_5.sqlite',
    ready: true,
    capabilities: {
      tokenBreakdown: false,
      calls: true,
      turns: false,
      callsLabel: '会话数',
    },
    selectionPaths: [
      { os: 'Linux', path: '~/.codex/' },
      { os: 'Windows', path: '%USERPROFILE%\\.codex\\' },
      { os: 'macOS', path: '~/.codex/' },
    ],
    storagePath: '~/.codex/state_5.sqlite',
    storageNote: 'threads 表的 tokens_used 字段，仅有总 Token 用量，无 input/output 拆分。state_5 为主库，logs_2/goals_1/memories_1 为空或已废弃。',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'OpenCode 本地 SQLite 会话用量记录',
    filePattern: 'opencode.db',
    ready: true,
    capabilities: {
      tokenBreakdown: true,
      calls: true,
      turns: false,
      callsLabel: '会话数',
    },
    selectionPaths: [
      { os: 'Linux', path: '~/.local/share/opencode/' },
      { os: 'Windows', path: '%USERPROFILE%\\.local\\share\\opencode\\' },
      { os: 'macOS', path: '~/.local/share/opencode/' },
    ],
    storagePath: '~/.local/share/opencode/opencode.db',
    storageNote: 'session 表，含 input/output/reasoning/cache_read/cache_write 及 cost（USD），数据最详细。project.worktree 区分项目。',
  },
];

export function getAssistantSource(id: string): AssistantSource | undefined {
  return ASSISTANT_SOURCES.find((source) => source.id === id);
}

export const DEFAULT_ASSISTANT_ID = 'cursor';
