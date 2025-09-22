// app/dashboard/hr/layout.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/hr/Sidebar';
import { TopNavbar } from '@/components/dashboard/hr/TopNavbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function HRDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* This div shows the Sidebar permanently on desktop ONLY */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>
      
      {/* This handles the slide-out drawer on mobile */}
      <div className="lg:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 border-r-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* This is the main content area with a left margin on desktop */}
      <div className="lg:ml-64">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}