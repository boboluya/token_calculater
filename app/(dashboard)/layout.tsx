import { Sidebar } from '../components/Sidebar';
import { UsageDataProvider } from '../components/UsageDataProvider';
import {
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsageDataProvider>
      <SidebarProvider className="h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:hidden">
            <SidebarTrigger
              aria-label="打开导航菜单"
              title="打开导航菜单"
              className="size-9 rounded-xl border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-950"
            />
            <span className="text-sm font-semibold tracking-tight text-slate-950">
              Token 计算器
            </span>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </UsageDataProvider>
  );
}