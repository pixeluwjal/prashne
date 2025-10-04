'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMessageSquare, FiBarChart2, FiExternalLink, FiX, FiCheckCircle, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

interface Report {
  _id: string;
  jobTitle: string;
  candidateId: { name: string };
  feedbackId?: { feedbackContent: string };
  transcripts: { role: string; content: string }[];
  updatedAt: string;
  status?: 'completed' | 'processing' | 'pending';
}

function ReportDetailModal({ report, isOpen, onOpenChange }: { report: Report | null; isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
  if (!report || !isOpen) return null;

  const jobTitle = report.jobTitle || 'No Job Title';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-3xl w-full max-w-4xl lg:max-w-6xl max-h-[90vh] md:max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                    <FiBarChart2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Interview Report
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">{jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{new Date(report.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(55, 65, 81, 0.1)' }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => onOpenChange(false)}
                className="p-2 sm:p-3 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors flex-shrink-0"
              >
                <FiX className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 overflow-auto">
            {/* Feedback Panel */}
            <div className="flex flex-col min-h-0">
              <div className="mb-4 sm:mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-blue-500/20 rounded-lg">
                    <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Generated Feedback</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {report.feedbackId?.feedbackContent ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="prose prose-sm sm:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {report.feedbackId.feedbackContent}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 dark:bg-gray-800 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                        <FiClock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing Feedback</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">AI is analyzing the interview transcript</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transcript Panel */}
            <div className="flex flex-col min-h-0">
              <div className="mb-4 sm:mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-purple-500/20 rounded-lg">
                    <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Interview Transcript</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {report.transcripts && report.transcripts.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {report.transcripts.map((t, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-sm ${
                            t.role === 'user' 
                              ? 'bg-blue-500/10 border-blue-500/20' 
                              : 'bg-gray-500/10 border-gray-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                              t.role === 'user' 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {t.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <span className={`font-semibold text-xs sm:text-sm ${
                              t.role === 'user' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
                            }`}>
                              {t.role === 'user' ? 'Candidate' : 'Interviewer'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">{t.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-200 dark:bg-gray-800 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                        <FiMessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No Transcript Available</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Interview transcript is being processed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ReportSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 animate-pulse"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
              <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-12 sm:w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
            <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-800 rounded-lg sm:rounded-xl mt-3 sm:mt-4"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch('/api/hr/reports');
        if (!response.ok) throw new Error('Failed to fetch reports from the server.');
        const data = await response.json();
        setReports(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
          icon: FiCheckCircle,
          label: 'Completed'
        };
      case 'processing':
        return {
          color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
          icon: FiClock,
          label: 'Processing'
        };
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
          icon: FiClock,
          label: 'Pending'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
          icon: FiClock,
          label: 'Unknown'
        };
    }
  };

  const getJobTitle = (report: Report) => {
    return report.jobTitle || 'No Job Title';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="space-y-2">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 sm:w-64 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 sm:w-96 animate-pulse"></div>
            </div>
            <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-800 rounded-lg sm:rounded-xl w-28 sm:w-32 animate-pulse"></div>
          </motion.div>
          <ReportSkeleton />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold text-base sm:text-lg">Error Loading Reports</h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6"
        >
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Interview Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
              Review and analyze candidate performance with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2">
              <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{reports.length} Total</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-2xl shadow-blue-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Reports</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">{reports.length}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FiBarChart2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-2xl shadow-green-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Completed</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-2xl shadow-purple-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">In Progress</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {reports.filter(r => r.status !== 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-2xl"
        >
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-2xl shadow-lg">
                <FiAward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Recent Interview Reports</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Click on any report to view detailed analysis and transcript
            </p>
          </div>
          
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {reports.map((report, index) => {
                const statusConfig = getStatusConfig(report.status || 'completed');
                const StatusIcon = statusConfig.icon;
                const jobTitle = getJobTitle(report);
                
                return (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 cursor-pointer hover:shadow-lg sm:hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group backdrop-blur-sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <div className="relative">
                      {/* Status Badge - Fixed positioning to prevent overlap */}
                      <div className="absolute top-0 right-0 z-10">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border backdrop-blur-sm text-xs ${statusConfig.color}`}>
                          <StatusIcon className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span className="font-medium hidden xs:inline">{statusConfig.label}</span>
                          <span className="font-medium xs:hidden">{statusConfig.label.slice(0, 3)}</span>
                        </div>
                      </div>
                      
                      {/* Job Title - Added padding to prevent overlap */}
                      <div className="mb-3 sm:mb-4 pr-16 sm:pr-20">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {jobTitle}
                        </h3>
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{new Date(report.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          <FiMessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{report.transcripts?.length || 0} messages</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <FiExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        View Report
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12 md:py-16 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl sm:rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gray-200 dark:bg-gray-800 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <FiAward className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">No Reports Generated Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto px-4">
                Completed interviews will appear here once they are processed. Check back later to review candidate performance.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <ReportDetailModal 
        report={selectedReport}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}