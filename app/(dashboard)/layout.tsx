import { Sidebar } from '../components/Sidebar';
import { SidebarProvider } from '../components/ui/sidebar';

export const metadata = {
  title: 'Token 计算器',
  description: 'Token 用量分析看板',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </SidebarProvider>
  );
}