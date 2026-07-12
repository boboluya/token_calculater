<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目架构速查

> 供 AI agent 快速理解项目，避免每次重新扫描。

## 技术栈

Next.js 16.2.10 + React 19.2.4 + TypeScript 5.x + Tailwind CSS 4.x + ECharts (echarts-for-react)。包管理器 pnpm。

## 目录职责

```
app/                          # App Router（UI + API 在一起）
├── layout.tsx                # 根布局：HTML 骨架、字体、metadata
├── globals.css                # Tailwind 入口 + number input 样式重置
├── (dashboard)/              # 路由组，共享 Sidebar layout + UsageDataProvider
│   ├── layout.tsx            # UsageDataProvider > SidebarProvider > Sidebar + main
│   ├── page.tsx              # / → Charts 看板（从 Provider 获取数据）
│   ├── table/page.tsx        # /table → 月度明细表（从 Provider 获取数据）
│   └── calculator/page.tsx   # /calculator → 成本计算器（从 Provider 获取数据）
├── api/pricing/              # 定价 API（pricing/sync 等）
└── components/               # 全部为 "use client"
    ├── Sidebar.tsx           # 导航栏 + 收缩切换（local state）
    ├── UsageDataProvider.tsx # 数据源 Context：目录选择 → 筛选 history/usage.json* → 调用 gatherDailyTotals
    ├── Dashboard.tsx         # 看板控制器，从 Provider 获取数据
    ├── UsageDataSource.tsx   # 数据源状态卡片：显示目录名/文件数/天数/状态
    ├── SummaryCards.tsx       # KPI 卡片：总数/均值/百分比，导出 fmt/fmtFull
    ├── TokenCharts.tsx        # 4 张 ECharts 图表（total/breakdown/in-out/calls-turns）
    └── CostCalculator.tsx    # 预设单价 + 可编辑输入 + 成本汇总

lib/data.ts                   # 纯函数：接收字符串数组，解析 JSON、按日期合并、排序
```

## 路由与渲染模式

| 路由 | 文件 | 模式 |
|------|------|------|
| `/` | `(dashboard)/page.tsx` | 纯客户端，从 UsageDataProvider 获取数据 |
| `/calculator` | `(dashboard)/calculator/page.tsx` | 纯客户端，从 UsageDataProvider 获取数据 |
| `/table` | `(dashboard)/table/page.tsx` | 纯客户端，从 UsageDataProvider 获取数据 |

## 数据流

```
用户选择本地目录 → UsageDataProvider(筛选 history/usage.json*)
                         ↓
         lib/data.ts gatherDailyTotals(strings[])  ← 纯函数，可复用
                         ↓
         UsageDataContext(data, loading, error, directoryName...)
                         ↓
        ┌────────────────┼──────────────────┐
        ↓                ↓                  ↓
    Dashboard        Table page        Calculator page
    → SummaryCards   → 月度明细表       → CostCalculator
    → TokenCharts
```

## 状态管理

- `UsageDataProvider`（Context）：目录选择、数据加载、解析状态，所有子页面共享
- Sidebar: `collapsed`（useSidebar）
- CostCalculator: preset + price 输入（local useState）

## 关键依赖

- `echarts` + `echarts-for-react` — 图表渲染
- `tailwindcss` + `@tailwindcss/postcss` — 样式
- `eslint-config-next` — 代码规范

## 约定

- 组件放在 `app/components/`，全部 `"use client"`
- 服务端逻辑放在 `lib/`
- 类型定义内联在对应文件中，无独立 types 文件
- 路径别名 `@/*` → 项目根目录