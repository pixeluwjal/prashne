'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 1. Import useAuth instead of Clerk's hooks
import { useAuth } from '@/context/AuthContext';
import { FiCpu, FiLogOut, FiArchive } from 'react-icons/fi';
import { AiOutlineDashboard, AiOutlineCalendar, AiOutlineFileText, AiOutlineSetting } from 'react-icons/ai';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard/hr', icon: AiOutlineDashboard, label: 'Dashboard' },
  { href: '/dashboard/hr/create-interview', icon: AiOutlineCalendar, label: 'Create Interview' },
  { href: '/dashboard/hr/reports', icon: AiOutlineFileText, label: 'Reports' },
  { href: '/dashboard/hr/past-interviews', icon: FiArchive, label: 'Past Interviews' },
];

const settingsNav = [
  { href: '/dashboard/hr/settings', icon: AiOutlineSetting, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  // 2. Get user and the logout function from our custom AuthContext
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex flex-col flex-1 p-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <FiCpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">Prashne</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Settings Navigation */}
        <nav className="space-y-2 mt-auto">
           <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">General</p>
           {settingsNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          {/* 3. Add a check to only render this if the user object exists */}
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {/* 4. Use a dynamic avatar service since our custom user object doesn't have an imageUrl */}
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username.replace(' ', '+')}&background=4f46e5&color=fff`} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              {/* 5. Replace <SignOutButton> with a regular button that calls our logout function */}
              <button onClick={logout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" aria-label="Log out">
                <FiLogOut />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}