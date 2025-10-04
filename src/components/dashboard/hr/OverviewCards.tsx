// src/components/dashboard/hr/OverviewCards.tsx
'use client';

import useSWR from 'swr';
import { getAnalytics } from '@/lib/api/hr';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiCalendar, FiCheckCircle, FiClock, FiBarChart2 } from 'react-icons/fi';

const fetcher = () => getAnalytics();

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  isLoading 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  trend?: number;
  isLoading: boolean;
}) => {
  const colorVariants = [
    {
      gradient: 'from-blue-500/20 to-purple-600/20 dark:from-blue-400/30 dark:to-purple-500/30',
      accent: 'from-blue-500 to-purple-600',
      light: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400'
    },
    {
      gradient: 'from-emerald-500/20 to-green-600/20 dark:from-emerald-400/30 dark:to-green-500/30',
      accent: 'from-emerald-500 to-green-600',
      light: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      gradient: 'from-amber-500/20 to-orange-600/20 dark:from-amber-400/30 dark:to-orange-500/30',
      accent: 'from-amber-500 to-orange-600',
      light: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400'
    },
    {
      gradient: 'from-purple-500/20 to-pink-600/20 dark:from-purple-400/30 dark:to-pink-500/30',
      accent: 'from-purple-500 to-pink-600',
      light: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const colorIndex = Math.floor(Math.random() * colorVariants.length);
  const colors = colorVariants[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.2 }
      }}
      className="relative group"
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className={`relative bg-card backdrop-blur-xl rounded-3xl p-6 border border-border transition-all duration-500 group-hover:shadow-xl group-hover:border-accent/30 overflow-hidden`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${colors.light} backdrop-blur-sm border border-border`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            
            {trend !== undefined && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  trend >= 0 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                <FiTrendingUp className={`w-3 h-3 ${trend >= 0 ? '' : 'rotate-180'}`} />
                {Math.abs(trend)}%
              </motion.div>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            {isLoading ? (
              <div className="h-12 bg-gradient-to-r from-muted to-muted/80 rounded-2xl animate-pulse" />
            ) : (
              <motion.div
                key={value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-black bg-gradient-to-r from-card-foreground to-card-foreground/90 bg-clip-text text-transparent"
              >
                {value.toLocaleString()}
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-card-foreground/90 mb-4">{title}</h3>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isLoading ? '50%' : `${Math.min((value / 100) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${colors.accent} rounded-full shadow-sm`}
            />
          </div>

          {/* Bottom Accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} rounded-b-3xl`} />

          {/* Decorative Elements */}
          <div className="absolute bottom-3 right-3 opacity-5 text-card-foreground">
            <Icon className="w-12 h-12" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function OverviewCards() {
  const { data, error, isLoading } = useSWR('/api/hr/analytics', fetcher);

  const cardMetrics = [
    { 
      key: 'totalInterviews', 
      title: 'Total Interviews', 
      icon: FiUsers,
      description: 'All interviews conducted',
      trend: 12
    },
    { 
      key: 'pendingInterviews', 
      title: 'Pending', 
      icon: FiClock,
      description: 'Awaiting completion',
      trend: -5
    },
    { 
      key: 'completedInterviews', 
      title: 'Completed', 
      icon: FiCheckCircle,
      description: 'Successfully finished',
      trend: 18
    },
    {
      key: 'upcomingInterviews',
      title: 'Upcoming',
      icon: FiCalendar,
      description: 'This week schedule',
      trend: 8
    }
  ];

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {cardMetrics.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card backdrop-blur-xl rounded-3xl p-6 border border-destructive/20 text-center"
          >
            <div className="w-12 h-12 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-destructive/30">
              <FiBarChart2 className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-destructive font-semibold text-sm">Failed to load</p>
            <p className="text-muted-foreground text-xs mt-1">{item.title}</p>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardMetrics.map((item, index) => (
        <StatCard
          key={item.key}
          title={item.title}
          value={data ? data[item.key as keyof typeof data] || 0 : 0}
          icon={item.icon}
          trend={item.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}