'use client';

import { useEffect, useState } from 'react';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold truncate">{report.candidateId.name}</h2>
              <p className="text-slate-300 mt-2 truncate">
                {report.jobTitle} • {new Date(report.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="text-white hover:text-slate-300 text-2xl font-bold ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-auto">
          {/* Feedback Panel */}
          <div className="flex flex-col min-h-0">
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-800">AI Generated Feedback</h3>
            </div>
            <div className="flex-1 min-h-0 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {report.feedbackId?.feedbackContent ? (
                  <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                    {report.feedbackId.feedbackContent}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <p className="text-slate-600 font-medium">Feedback is being processed</p>
                    <p className="text-slate-500 text-sm mt-1">Please check back later</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transcript Panel */}
          <div className="flex flex-col min-h-0">
            <div className="mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-800">Interview Transcript</h3>
            </div>
            <div className="flex-1 min-h-0 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {report.transcripts && report.transcripts.length > 0 ? (
                  <div className="space-y-4">
                    {report.transcripts.map((t, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border ${
                          t.role === 'user' 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            t.role === 'user' ? 'bg-blue-500' : 'bg-slate-500'
                          }`} />
                          <span className={`font-semibold text-sm ${
                            t.role === 'user' ? 'text-blue-700' : 'text-slate-700'
                          }`}>
                            {t.role === 'user' ? 'Candidate' : 'Interviewer'}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{t.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600 font-medium">No transcript available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg mt-4"></div>
          </div>
        </div>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Interview Reports</h1>
              <p className="text-slate-600 mt-2">Review and manage all generated candidate reports</p>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
          </div>
          <ReportSkeleton />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Reports</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Interview Reports</h1>
            <p className="text-slate-600 mt-2 text-lg">Review and manage all generated candidate reports</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white border border-slate-200 rounded-full px-3 py-1 text-sm text-slate-700">
              {reports.length} Total Reports
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-2xl font-bold mt-1">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold mt-1">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold mt-1">
                  {reports.filter(r => r.status !== 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Recent Interview Reports</h2>
            <p className="text-slate-600 mt-1">Click on any report to view detailed analysis and transcript</p>
          </div>
          
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
                  onClick={() => handleViewReport(report)}
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(report.status || 'completed')}`}>
                        {report.status || 'completed'}
                      </span>
                    </div>
                    <div className="mb-4 pr-16">
                      <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-tight">
                        {report.jobTitle}
                      </h3>
                    </div>
                    <div className="text-slate-600 text-sm mb-3">
                      Candidate: {report.candidateId?.name || 'N/A'}
                    </div>
                    <div className="text-slate-500 text-sm mb-4">
                      {new Date(report.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-slate-500 text-sm">
                        {report.transcripts?.length || 0} messages
                      </div>
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors group-hover:scale-105 transform transition-transform">
                        View Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Reports Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Completed interviews will appear here once they are processed. Check back later to review candidate performance.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <ReportDetailModal 
        report={selectedReport}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}