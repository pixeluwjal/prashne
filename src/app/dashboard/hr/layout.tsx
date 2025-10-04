// app/dashboard/hr/layout.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/hr/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HRDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hidden sidebar trigger for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 left-0 w-80 z-50">
            <Sidebar onMobileClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="w-full lg:pl-64">
        <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}