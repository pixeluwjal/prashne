'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createInterview } from '@/lib/api/hr';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ProgressBar } from '@/components/ui/ProgressBar'; // Import the new ProgressBar
import { CalendarIcon, Loader2, CheckCircle2, Copy, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreatedInterview {
  candidateName: string;
  interviewLink: string;
}

const initialFormData = {
  jobTitle: '',
  jobDescription: '',
  candidateName: '',
  candidateEmail: '',
  difficulty: '',
};

export function CreateInterviewForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [completedInterview, setCompletedInterview] = useState<CreatedInterview | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // New state for multi-step form
  const totalSteps = 2; // Total number of steps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'difficulty', value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleNextStep = () => {
    // Basic validation for Step 1
    if (currentStep === 1) {
      if (!formData.jobTitle || !formData.jobDescription || !formData.difficulty) {
        toast.error('Please fill in all job details.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiresAt) {
      toast.error('Please select an expiry date for the interview.');
      return;
    }
    // Basic validation for Step 2
    if (!formData.candidateName || !formData.candidateEmail) {
      toast.error('Please fill in candidate details.');
      return;
    }
    
    setIsLoading(true);
    const promise = createInterview({ ...formData, expiresAt });

    toast.promise(promise, {
      loading: 'Generating questions & scheduling interview...',
      success: (data) => {
        setCompletedInterview(data.interview);
        return `Interview for ${formData.candidateName} scheduled successfully!`;
      },
      error: (err: any) => err.message || 'An unexpected error occurred.',
      finally: () => setIsLoading(false),
    });
  };

  const handleCopyLink = () => {
    if (completedInterview) {
      navigator.clipboard.writeText(completedInterview.interviewLink);
      toast.success('Interview link copied to clipboard!');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setExpiresAt(undefined);
    setCompletedInterview(null);
    setCurrentStep(1); // Reset to first step
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.005] bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-3xl font-extrabold text-gray-900 leading-tight">Create AI-Powered Interview</CardTitle>
        <CardDescription className="text-lg text-gray-600 mt-2">
          {completedInterview
            ? 'Your interview has been scheduled! Share the unique link with the candidate.'
            : 'Effortlessly generate interview questions and schedule with our AI assistant.'}
        </CardDescription>
        {!completedInterview && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} labels={['Job Details', 'Candidate & Schedule']} />
        )}
      </CardHeader>

      <CardContent>
        {completedInterview ? (
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-inner animate-in fade-in duration-500">
            <div className="mx-auto w-20 h-20 bg-green-200 rounded-full flex items-center justify-center ring-4 ring-green-300 ring-opacity-50 animate-bounce-in">
              <CheckCircle2 className="h-10 w-10 text-green-700" />
            </div>
            <h3 className="text-3xl font-bold mt-6 text-gray-900">Interview Scheduled!</h3>
            <p className="text-lg text-gray-600 mt-3">The unique interview link for <span className="font-semibold text-blue-700">{completedInterview.candidateName}</span> is ready.</p>
            
            <div className="mt-8 flex items-center w-full max-w-lg mx-auto bg-white border border-blue-200 rounded-xl shadow-md p-3 pr-2 transition-all duration-300 hover:shadow-lg hover:border-blue-400">
              <Input readOnly value={completedInterview.interviewLink} className="border-none bg-transparent focus-visible:ring-0 text-base font-medium text-blue-700 truncate" />
              <Button variant="ghost" size="icon" onClick={handleCopyLink} className="flex-shrink-0 text-blue-600 hover:bg-blue-100/50">
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetForm} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Another Interview
              </Button>
              {/* Optionally add a button to view the interview details */}
              <Button variant="outline" size="lg" className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
                 View All Interviews
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="e.g., Senior Frontend Developer" required className="focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select onValueChange={(value) => handleSelectChange('difficulty', value)} value={formData.difficulty} required>
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500"><SelectValue placeholder="Select a difficulty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description & Skills</Label>
                  <Textarea 
                    id="jobDescription" 
                    value={formData.jobDescription} 
                    onChange={handleInputChange} 
                    placeholder="Paste the job description or list key responsibilities and required skills (e.g., React, Node.js, AWS, REST APIs)..." 
                    required 
                    rows={6}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleNextStep} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Next Step <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Candidate & Scheduling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate Name</Label>
                    <Input id="candidateName" value={formData.candidateName} onChange={handleInputChange} placeholder="e.g., Alice Johnson" required className="focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="candidateEmail">Candidate Email</Label>
                    <Input id="candidateEmail" value={formData.candidateEmail} onChange={handleInputChange} type="email" placeholder="e.g., alice@example.com" required className="focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Interview Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-12", !expiresAt && "text-muted-foreground", "focus:ring-blue-500 focus:border-blue-500 border-gray-300 hover:bg-gray-50")}>
                        <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                        {expiresAt ? format(expiresAt, "PPP") : <span className="text-gray-500">Pick a date for the candidate to complete by</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={expiresAt} 
                        onSelect={setExpiresAt} 
                        initialFocus 
                        disabled={(date) => date < new Date() && date.toDateString() !== new Date().toDateString()} // Disable past dates
                        className="rounded-md border shadow"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="border-gray-300 text-gray-600 hover:bg-gray-100">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Previous
                  </Button>
                  <Button type="submit" size="lg" disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : 'Generate & Send Invitation'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}