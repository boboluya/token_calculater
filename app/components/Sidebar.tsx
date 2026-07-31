"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalculatorIcon,
  ChartColumnIcon,
  PanelLeftIcon,
  Table2Icon,
  XIcon,
} from "lucide-react";

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/app/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/",
    label: "图表",
    icon: ChartColumnIcon,
  },
  {
    href: "/table",
    label: "表格",
    icon: Table2Icon,
  },
  {
    href: "/calculator",
    label: "计算器",
    icon: CalculatorIcon,
  },
];

function SidebarToggle() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const desktopLabel = collapsed ? "展开侧边栏" : "收起侧边栏";

  return (
    <>
      <button
        type="button"
        aria-label="关闭导航菜单"
        title="关闭导航菜单"
        onClick={toggleSidebar}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-30 grid size-14 place-items-center rounded-full bg-slate-950 text-white shadow-xl shadow-slate-950/25 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:hidden"
      >
        <XIcon className="size-6" />
      </button>
      <button
        type="button"
        aria-label={desktopLabel}
        title={desktopLabel}
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-30 hidden size-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm shadow-slate-950/5 transition-colors hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:grid"
      >
        <PanelLeftIcon
          className={cn("size-3.5 transition-transform duration-200", collapsed && "rotate-180")}
        />
      </button>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileMenu = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarRoot collapsible="icon" className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="relative border-b border-sidebar-border px-3 pb-4 pt-5">
        <SidebarToggle />
        <div className="flex h-11 min-w-0 items-center gap-3 rounded-2xl px-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Token计算logo.png"
            alt="Token 计算器"
            className="size-9 shrink-0"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold tracking-tight text-slate-950">
              Token 计算器
            </div>
            <div className="truncate text-[11px] font-medium text-slate-400">
              usage · cost · insight
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="justify-end px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-3 md:justify-start md:px-2 md:py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400 md:px-3 md:text-[11px]">
            导航
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 md:gap-1.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className="h-14 rounded-xl px-4 text-lg font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 data-[active=true]:bg-slate-950 data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:shadow-slate-950/15 md:h-10 md:px-3 md:text-[13px] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:px-0"
                    >
                      <Link href={item.href} onClick={closeMobileMenu}>
                        <Icon className="size-5 md:size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarRoot>
  );
}