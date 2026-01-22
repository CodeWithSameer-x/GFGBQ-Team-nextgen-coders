import type { ReactNode } from 'react';
import AppSidebar from '@/components/app-sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
