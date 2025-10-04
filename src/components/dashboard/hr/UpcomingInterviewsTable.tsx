'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterviews } from '@/lib/api/hr';
import { FiCopy, FiEye, FiClock, FiTrash2, FiSearch, FiFilter, FiMoreVertical, FiUser, FiCalendar, FiBriefcase, FiCheckCircle, FiXCircle, FiClock as FiClockIcon } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const fetcher = () => getInterviews();

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-amber-500/20 dark:bg-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30 dark:border-amber-500/40',
      icon: FiClockIcon,
      label: 'Pending'
    },
    completed: {
      bg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      icon: FiCheckCircle,
      label: 'Completed'
    },
    expired: {
      bg: 'bg-red-500/20 dark:bg-red-500/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500/30 dark:border-red-500/40',
      icon: FiXCircle,
      label: 'Expired'
    }
  };

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </motion.span>
  );
};

const InterviewCard = ({ interview, onAction }: { interview: any; onAction: (type: string, interview: any) => void }) => {
  const [showActions, setShowActions] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(interview.interviewLink);
    toast.success('Interview link copied to clipboard!');
    setShowActions(false);
  };

  const actions = [
    { icon: FiCopy, label: 'Copy Link', action: () => handleCopyLink(), color: 'text-blue-600 dark:text-blue-400' }
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-card backdrop-blur-xl rounded-3xl p-6 border border-border transition-all duration-500 hover:border-accent/50 hover:shadow-xl group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-card rounded-full border-2 border-card shadow-sm flex items-center justify-center">
              <FiBriefcase className="w-2.5 h-2.5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-card-foreground text-lg truncate">{interview.candidateName}</h3>
            <p className="text-muted-foreground text-sm truncate">{interview.jobTitle}</p>
          </div>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <FiMoreVertical className="w-4 h-4" />
          </motion.button>

          <AnimatePresence>
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowActions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute right-0 top-10 z-50 w-48 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl py-2"
                >
                  {actions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={action.action}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-accent/50 transition-all duration-200 ${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {format(new Date(interview.expiresAt), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <FiClockIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {format(new Date(interview.expiresAt), 'hh:mm a')}
            </span>
          </div>
        </div>

        <StatusBadge status={interview.status} />
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-card backdrop-blur-xl rounded-3xl p-6 border border-border shadow-lg animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-muted rounded-2xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="w-8 h-8 bg-muted rounded-xl"></div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <div className="h-3 bg-muted rounded w-20"></div>
        <div className="h-3 bg-muted rounded w-16"></div>
      </div>
      <div className="h-6 bg-muted rounded-xl w-20"></div>
    </div>
  </div>
);

export function UpcomingInterviewsTable() {
  const { data, error, isLoading } = useSWR('/api/hr/interviews', fetcher);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredInterviews = useMemo(() => {
    if (!data?.interviews) return [];
    
    return data.interviews.filter((interview: any) => {
      const statusMatch = filterStatus === 'all' || interview.status === filterStatus;
      const searchMatch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [data, filterStatus, searchTerm]);

  const handleAction = (type: string, interview: any) => {
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} action for ${interview.candidateName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-card-foreground to-card-foreground/80 bg-clip-text text-transparent">
            Interview Management
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Search, filter, and manage all your interviews
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-accent/50 rounded-2xl p-1.5 border border-border backdrop-blur-sm">
            {['grid', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'grid' | 'list')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                {mode === 'grid' ? 'Grid' : 'List'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-accent/50 backdrop-blur-xl rounded-3xl border border-border shadow-lg"
      >
        <div className="relative flex-1 w-full lg:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by candidate or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background/80 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm text-card-foreground placeholder-muted-foreground transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FiFilter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filter:</span>
          </div>
          {['all', 'pending', 'completed', 'expired'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 capitalize ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-background/80 text-muted-foreground hover:text-card-foreground hover:bg-accent/50 border border-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-accent/50 backdrop-blur-xl rounded-3xl border border-destructive/20"
          >
            <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-destructive/30">
              <FiXCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-destructive mb-2">Failed to load interviews</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </motion.div>
        )}

        {!isLoading && !error && filteredInterviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-accent/50 backdrop-blur-xl rounded-3xl border border-border"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
              <FiSearch className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">No interviews found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </motion.div>
        )}

        {!isLoading && !error && filteredInterviews.length > 0 && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                layout
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredInterviews.map((interview: any) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    onAction={handleAction}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                layout
                className="space-y-4"
              >
                {filteredInterviews.map((interview: any) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    onAction={handleAction}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}