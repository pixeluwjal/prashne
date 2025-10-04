// components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white/80 dark:bg-[#020068]/80 backdrop-blur-sm border border-slate-200/50 dark:border-[#0300a0]/50 shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <FiMoon className="w-5 h-5 text-slate-600" />
        ) : (
          <FiSun className="w-5 h-5 text-amber-300" />
        )}
      </motion.div>
    </motion.button>
  );
}