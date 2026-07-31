import { ListBulletIcon } from '@heroicons/react/24/outline';

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
          <SidebarTrigger
            aria-label="打开导航菜单"
            title="打开导航菜单"
            className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 size-14 rounded-full bg-slate-950 text-white shadow-xl shadow-slate-950/25 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <ListBulletIcon className="size-6" />
          </SidebarTrigger>
          <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </UsageDataProvider>
  );
}