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
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#1A1A1A] border border-gray-800 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <FiBarChart2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Interview Report
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4" />
                    <span>{jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(report.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(55, 65, 81, 0.3)' }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => onOpenChange(false)}
                className="p-3 text-gray-300 hover:text-white rounded-2xl transition-colors flex-shrink-0"
              >
                <FiX className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 overflow-auto">
            {/* Feedback Panel */}
            <div className="flex flex-col min-h-0">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiTrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">AI Generated Feedback</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="flex-1 overflow-y-auto p-6">
                  {report.feedbackId?.feedbackContent ? (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                          {report.feedbackId.feedbackContent}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-3xl flex items-center justify-center">
                        <FiClock className="w-8 h-8 text-gray-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Processing Feedback</h4>
                      <p className="text-gray-400">AI is analyzing the interview transcript</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transcript Panel */}
            <div className="flex flex-col min-h-0">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FiMessageSquare className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Interview Transcript</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="flex-1 overflow-y-auto p-6">
                  {report.transcripts && report.transcripts.length > 0 ? (
                    <div className="space-y-4">
                      {report.transcripts.map((t, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-4 rounded-xl border backdrop-blur-sm ${
                            t.role === 'user' 
                              ? 'bg-blue-500/10 border-blue-500/20' 
                              : 'bg-gray-500/10 border-gray-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              t.role === 'user' 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {t.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <span className={`font-semibold text-sm ${
                              t.role === 'user' ? 'text-blue-300' : 'text-gray-300'
                            }`}>
                              {t.role === 'user' ? 'Candidate' : 'Interviewer'}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{t.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-3xl flex items-center justify-center">
                        <FiMessageSquare className="w-8 h-8 text-gray-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No Transcript Available</h4>
                      <p className="text-gray-400">Interview transcript is being processed</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 animate-pulse"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-800 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-800 rounded w-full"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-gray-800 rounded-xl mt-4"></div>
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
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: FiCheckCircle,
          label: 'Completed'
        };
      case 'processing':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: FiClock,
          label: 'Processing'
        };
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: FiClock,
          label: 'Pending'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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
      <div className="min-h-screen bg-[#0A0A0A] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <div className="h-8 bg-gray-800 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-96 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-800 rounded-xl w-32 animate-pulse"></div>
          </motion.div>
          <ReportSkeleton />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-800 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <FiX className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-red-200 font-semibold text-lg">Error Loading Reports</h3>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Interview Reports
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Review and analyze candidate performance with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl px-4 py-2">
              <span className="text-white font-semibold">{reports.length} Total Reports</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-2xl shadow-blue-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold text-white mt-2">{reports.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-2xl shadow-green-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-2xl shadow-purple-500/25"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {reports.filter(r => r.status !== 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 shadow-2xl"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiAward className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Interview Reports</h2>
            </div>
            <p className="text-gray-400 text-lg">
              Click on any report to view detailed analysis and transcript
            </p>
          </div>
          
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 cursor-pointer hover:shadow-2xl hover:border-gray-600 transition-all duration-300 group backdrop-blur-sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <div className="relative">
                      {/* Status Badge */}
                      <div className="absolute top-0 right-0">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="text-xs font-medium">{statusConfig.label}</span>
                        </div>
                      </div>
                      
                      {/* Job Title */}
                      <div className="mb-4 pr-20">
                        <h3 className="font-semibold text-white truncate text-sm leading-tight">
                          {jobTitle}
                        </h3>
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FiCalendar className="w-4 h-4" />
                          {new Date(report.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FiMessageSquare className="w-4 h-4" />
                          {report.transcripts?.length || 0} messages
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600 flex items-center justify-center gap-2"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        View Full Report
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
              className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-3xl flex items-center justify-center">
                <FiAward className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No Reports Generated Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto text-lg">
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