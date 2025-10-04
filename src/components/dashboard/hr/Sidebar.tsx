// components/dashboard/hr/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  FiCpu, 
  FiLogOut, 
  FiArchive, 
  FiUser, 
  FiHome,
  FiBriefcase,
  FiFileText,
  FiCalendar,
  FiSettings,
  FiPlus,
  FiGitMerge
} from 'react-icons/fi';

const navItems = [
  { href: '/dashboard/hr', icon: FiHome, label: 'Dashboard' },
  { href: '/dashboard/hr/jd', icon: FiBriefcase, label: 'Job Descriptions' },
  { href: '/dashboard/hr/jd-matching', icon: FiGitMerge, label: 'JD Matching' },
  { href: '/dashboard/hr/resumes', icon: FiFileText, label: 'Resumes' },
  { href: '/dashboard/hr/create-interview', icon: FiCalendar, label: 'Create Interview' },
  { href: '/dashboard/hr/past-interviews', icon: FiArchive, label: 'Past Interviews' },
  { href: '/dashboard/hr/reports', icon: FiFileText, label: 'Analysis' }
];

const settingsNav = [
  { href: '/dashboard/hr/settings', icon: FiSettings, label: 'Settings' },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    logout();
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleCreateJD = () => {
    window.location.href = '/dashboard/hr/jd/create';
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex flex-col flex-1 p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <FiCpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text text-transparent">
            Prashne
          </span>
        </div>

        {/* Create JD Button */}
        <button
          onClick={handleCreateJD}
          className="flex items-center gap-3 px-4 py-3 mb-6 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 border bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/50 hover:shadow-purple-600/30"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create JD</span>
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-4 text-sidebar-foreground/60">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-lg'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive
                    ? 'text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'
                }`} />
                <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Navigation */}
        <nav className="space-y-2 mt-8">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-4 text-sidebar-foreground/60">
            General
          </p>
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-lg'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive
                    ? 'text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'
                }`} />
                <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="mt-8 pt-6 border-t border-sidebar-border">
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">
                    {user.username}
                  </p>
                  <p className="text-xs capitalize text-sidebar-foreground/60">
                    {user.role}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg transition-all duration-200 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                aria-label="Log out"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}