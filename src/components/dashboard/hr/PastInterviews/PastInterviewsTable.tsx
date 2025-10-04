'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { getInterviews } from '@/lib/api/hr';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiXCircle, FiExternalLink, FiEye } from 'react-icons/fi';

// The fetcher function for SWR, which calls our API service function
const fetcher = () => getInterviews();

export function PastInterviewsTable() {
  const { data, error, isLoading } = useSWR('/api/hr/interviews', fetcher);

  // Filter for interviews that are completed or expired to show in the "past" list
  const pastInterviews = useMemo(() => {
    if (!data?.interviews) return [];
    return data.interviews.filter(
      (interview: any) => interview.status === 'completed' || interview.status === 'expired'
    );
  }, [data]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiClock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-green-600',
      'from-pink-500 to-rose-600'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Past Interviews
                </h1>
                <p className="text-slate-300 text-lg mt-1">
                  Complete history of all conducted interviews
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{pastInterviews.length}</div>
              <div className="text-slate-300 text-sm">Total Interviews</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-300/50 dark:border-slate-700/50">
            <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="col-span-4 lg:col-span-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FiUser className="w-4 h-4" />
                  Candidate
                </div>
              </div>
              <div className="col-span-4 lg:col-span-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FiBriefcase className="w-4 h-4" />
                  Role
                </div>
              </div>
              <div className="col-span-3 lg:col-span-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <FiCalendar className="w-4 h-4" />
                  Date Completed
                </div>
              </div>
              <div className="col-span-2 lg:col-span-2 text-right">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1"></div>
            </div>

            <div className="divide-y divide-slate-300/30 dark:divide-slate-800/30">
              {isLoading && [...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="col-span-4 lg:col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="col-span-4 lg:col-span-3 flex items-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="col-span-3 lg:col-span-3 flex items-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="col-span-2 lg:col-span-2 flex items-center justify-end">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20 animate-pulse"></div>
                  </div>
                  <div className="col-span-1 lg:col-span-1 flex items-center justify-end">
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  </div>
                </motion.div>
              ))}

              {!isLoading && error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <FiXCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Failed to load interviews
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Please try refreshing the page
                  </p>
                </motion.div>
              )}

              {!isLoading && !error && pastInterviews.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No completed interviews
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Completed interviews will appear here
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {!isLoading && !error && pastInterviews.map((interview: any, index: number) => (
                  <motion.div
                    key={interview._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-12 gap-4 p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Candidate */}
                    <div className="col-span-4 lg:col-span-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(interview.candidateName)} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-sm font-bold">
                            {getInitials(interview.candidateName)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <Link href={`/dashboard/hr/reports`} className="hover:underline">
                              {interview.candidateName}
                            </Link>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {interview.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-4 lg:col-span-3 flex items-center">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">
                        {interview.jobTitle}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-3 lg:col-span-3 flex items-center">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiCalendar className="w-4 h-4" />
                        {format(new Date(interview.updatedAt), 'MMM d, yyyy')}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 lg:col-span-2 flex items-center justify-end">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(interview.status)} backdrop-blur-sm`}>
                        {getStatusIcon(interview.status)}
                        <span className="text-xs font-medium capitalize">
                          {interview.status}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 lg:col-span-1 flex items-center justify-end">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link
                          href={`/dashboard/hr/reports`}
                          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Footer */}
          {!isLoading && !error && pastInterviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiCheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pastInterviews.filter((i: any) => i.status === 'completed').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <FiXCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pastInterviews.filter((i: any) => i.status === 'expired').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Expired</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FiUser className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pastInterviews.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Interviews</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}