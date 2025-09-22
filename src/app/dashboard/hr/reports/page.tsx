'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FiEye, FiLoader } from 'react-icons/fi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

// --- Types for the report data ---
interface Report {
  _id: string;
  jobTitle: string;
  candidateId: { name: string };
  // ✨ FIX: feedbackId can now be optional
  feedbackId?: { feedbackContent: string };
  transcripts: { role: string; content: string }[];
  updatedAt: string;
}

// --- Sub-component for the detailed report modal ---
function ReportDetailModal({ report, isOpen, onOpenChange }: { report: Report | null; isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          {/* The full name is still shown here in the modal title */}
          <DialogTitle className="text-2xl">{report.candidateId.name}</DialogTitle>
          <DialogDescription>{report.jobTitle} - Report generated on {new Date(report.updatedAt).toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-hidden h-full">
          {/* Left Panel: Feedback */}
          <div className="flex flex-col gap-4 h-full">
            <h3 className="font-semibold text-lg">AI Generated Feedback</h3>
            <Card className="flex-grow">
              <ScrollArea className="h-[calc(80vh-100px)]">
                <CardContent className="pt-6 whitespace-pre-wrap text-sm">
                  {/* ✨ FIX: Use optional chaining (?.) to safely access feedbackContent. */}
                  {/* If feedbackId exists, it shows the content. If not, it shows a fallback message. */}
                  {report.feedbackId?.feedbackContent ?? "Feedback for this interview is still processing or was not generated."}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          {/* Right Panel: Transcript */}
          <div className="flex flex-col gap-4 h-full">
            <h3 className="font-semibold text-lg">Interview Transcript</h3>
            <Card className="flex-grow">
              <ScrollArea className="h-[calc(80vh-100px)]">
                <CardContent className="pt-6 text-sm space-y-3">
                  {report.transcripts && report.transcripts.length > 0 ? report.transcripts.map((t, i) => (
                    <div key={i}>
                      <p className={`font-bold ${t.role === 'user' ? 'text-blue-500' : 'text-primary'}`}>{t.role === 'user' ? 'Candidate' : 'Interviewer'}</p>
                      <p className="text-muted-foreground">{t.content}</p>
                    </div>
                  )) : <p>No transcript available.</p>}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Dashboard Page Component ---
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FiLoader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
     return (
       <div className="p-8">
         <Alert variant="destructive">
           <XCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       </div>
     );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Interview Reports</CardTitle>
          <CardDescription>Review and manage all generated candidate reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Card key={report._id}>
                  <CardHeader>
                    {/* ✨ UPDATE: Card title now shows the Job Title as requested, not the candidate name. */}
                    <CardTitle>{report.jobTitle}</CardTitle>
                    <CardDescription>
                      Candidate: {report.candidateId?.name || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Completed on {new Date(report.updatedAt).toLocaleDateString()}
                    </p>
                    <Button className="w-full" onClick={() => handleViewReport(report)}>
                      <FiEye className="mr-2 h-4 w-4" />
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Reports Found</h3>
                <p className="text-muted-foreground mt-2">Completed interviews will appear here once they are processed.</p>
             </div>
          )}
        </CardContent>
      </Card>
      
      <ReportDetailModal 
        report={selectedReport}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}