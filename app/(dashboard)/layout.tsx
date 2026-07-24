import { Sidebar } from '../components/Sidebar';
import { UsageDataProvider } from '../components/UsageDataProvider';
import { SidebarProvider } from '../components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsageDataProvider>
      <SidebarProvider className="h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </SidebarProvider>
    </UsageDataProvider>
  );
}