# Token Calculator

Token 用量分析看板 + 成本计算器，基于 Next.js App Router 构建。

## 技术栈

- **Next.js** 16.2.10 · **React** 19.2.4 · **TypeScript** 5.x
- **Tailwind CSS** 4.x · **ECharts** (echarts-for-react)
- 包管理器：pnpm

## 快速开始

```bash
pnpm dev        # 开发服务器 → http://localhost:3000
pnpm build      # 生产构建
pnpm start      # 启动生产服务
```

## 项目结构

```
app/
├── layout.tsx              # 根布局，全局 HTML/字体/metadata
├── globals.css              # Tailwind 入口 + 全局样式
├── favicon.ico
├── (dashboard)/             # dashboard 路由组（共享侧边栏布局）
│   ├── layout.tsx           # Sidebar + flex 内容区
│   ├── page.tsx             # / → Charts 看板页
│   └── calculator/
│       └── page.tsx         # /calculator → 成本计算器页
├── api/
│   └── daily/
│       └── route.ts         # GET /api/daily → 聚合每日用量 JSON
└── components/
    ├── Sidebar.tsx           # 侧边栏导航（可收缩）
    ├── Dashboard.tsx         # 看板页控制器（初始数据/fallback fetch）
    ├── SummaryCards.tsx       # KPI 卡片（总计/平均/百分比）
    ├── TokenCharts.tsx        # 4 张 ECharts 图表
    └── CostCalculator.tsx    # 价格预设 + 可编辑单价 + 成本计算

lib/
└── data.ts                  # 服务端文件聚合逻辑（扫描 usage.json*，按日合并排序）

public/                      # 静态资源
```

## 路由

| 路由 | 渲染模式 | 说明 |
|------|---------|------|
| `/` | 服务端预取 + 客户端兜底 | 用量看板，展示 4 张图表和 KPI 卡片 |
| `/calculator` | 客户端 fetch | 成本计算器，可切换预设单价并估算总费用 |
| `/api/daily` | API Route | 返回按日聚合的 token 用量 JSON |

## 数据流

1. `lib/data.ts` 读取 `USAGE_DATA_DIR` 环境变量指向的目录，扫描 `usage.json*` 文件，按日期合并排序
2. `/api/daily` 封装上述聚合逻辑，返回 JSON
3. `/` 页面在服务端预计算 `initialData` 传给 `Dashboard`；若缺失则客户端 fetch `/api/daily`
4. `/calculator` 页在客户端 fetch `/api/daily`，汇总后传给 `CostCalculator`
5. `SummaryCards` / `TokenCharts` 从 `daily` 数组本地派生所有可视化数据

## 状态管理

无全局 store / context / 请求库。全部使用组件本地 `useState`：
- `Sidebar` 收缩状态
- `Dashboard` / Calculator 页面 loading/error/data 状态
- `CostCalculator` 预设 + 单价输入状态

## 配置文件

- `next.config.ts` — 默认空配置
- `tsconfig.json` — strict 模式，`moduleResolution: bundler`，`@/*` 路径别名
- `eslint.config.mjs` — Next.js core-web-vitals + TypeScript 规则
- `postcss.config.mjs` — Tailwind v4 PostCSS 插件
- `pnpm-workspace.yaml` — `sharp` / `unrs-resolver` 构建许可