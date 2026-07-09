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
├── (dashboard)/              # 路由组，共享 Sidebar layout
│   ├── layout.tsx            # flex 容器：<Sidebar /> + <main>{children}</main>
│   ├── page.tsx              # / → Charts 看板（服务端预取 initialData）
│   └── calculator/page.tsx   # /calculator → 成本计算器
├── api/daily/route.ts        # GET /api/daily → 聚合每日数据 JSON
└── components/               # 全部为 "use client"
    ├── Sidebar.tsx           # 导航栏 + 收缩切换（local state）
    ├── Dashboard.tsx         # 看板控制器，接收 initialData 或 fallback fetch
    ├── SummaryCards.tsx       # KPI 卡片：总数/均值/百分比，导出 fmt/fmtFull
    ├── TokenCharts.tsx        # 4 张 ECharts 图表（total/breakdown/in-out/calls-turns）
    └── CostCalculator.tsx    # 预设单价 + 可编辑输入 + 成本汇总

lib/data.ts                   # 服务端：读 USAGE_DATA_DIR，扫描 usage.json*，聚合排序
```

## 路由与渲染模式

| 路由 | 文件 | 模式 |
|------|------|------|
| `/` | `(dashboard)/page.tsx` | 服务端预取 initialData → Dashboard，缺失时客户端 fetch fallback |
| `/calculator` | `(dashboard)/calculator/page.tsx` | 纯客户端 fetch /api/daily |
| `/api/daily` | `api/daily/route.ts` | GET API Route，返回 DailyEntry[] JSON |

## 数据流

```
USAGE_DATA_DIR/usage.json* → lib/data.ts(聚合排序) → /api/daily
                                                          ↓
                                      / 页(server prefetch)   /calculator 页(client fetch)
                                          ↓                        ↓
                                      Dashboard              汇总 total → CostCalculator
                                      → SummaryCards
                                      → TokenCharts
```

## 状态管理

无全局 store、无 context、无 React Query 等请求库。纯本地 useState：
- Sidebar: `collapsed`
- Dashboard / Calculator 页: `data`, `loading`, `error`
- CostCalculator: preset + price 输入

## 关键依赖

- `echarts` + `echarts-for-react` — 图表渲染
- `tailwindcss` + `@tailwindcss/postcss` — 样式
- `eslint-config-next` — 代码规范

## 约定

- 组件放在 `app/components/`，全部 `"use client"`
- 服务端逻辑放在 `lib/`
- 类型定义内联在对应文件中，无独立 types 文件
- 路径别名 `@/*` → 项目根目录