'use client';

import Link from 'next/link';
import { UserNav } from '@/components/ui/UserNav'; // 1. Import our custom UserNav
import { AiOutlineBell, AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/Button';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { Input } from '@/components/ui/input';

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <FiMenu className="w-6 h-6" />
          </Button>
          {/* Global Search */}
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <Input placeholder="Search interviews, candidates..." className="pl-10 w-64 lg:w-96" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 2. Wrap the "Create New" button in a Link */}
          <Link href="/dashboard/hr/create-interview">
            <Button className="hidden sm:inline-flex bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">
              <AiOutlinePlus className="mr-2 h-5 w-5"/>
              Create New
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <AiOutlineBell className="w-6 h-6 text-gray-600" />
          </Button>
          
          {/* 3. Replace Clerk's UserButton with our custom UserNav */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}