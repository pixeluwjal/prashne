// components/dashboard/hr/HRDashboard.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { OverviewCards } from './OverviewCards';
import { UpcomingInterviewsTable } from './UpcomingInterviewsTable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile drawer

export default function HRDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Permanent Sidebar for Desktop */}
      <Sidebar />
      
      {/* Mobile Sidebar as a Drawer */}
      <div className="lg:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            {/* We can re-use the Sidebar component inside the drawer */}
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="lg:ml-64">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          <OverviewCards />
          <UpcomingInterviewsTable />
        </main>
      </div>
    </div>
  );
}