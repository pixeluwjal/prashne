'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createInterview, generateAIQuestions } from '@/lib/api/hr';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CalendarIcon, Loader2, CheckCircle2, Copy, PlusCircle, ArrowLeft, ArrowRight, Trash2, Sparkles } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedInterview, setCompletedInterview] = useState<CreatedInterview | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [questions, setQuestions] = useState<{ text: string }[]>([{ text: '' }]);
  const [numQuestions, setNumQuestions] = useState<number>(5);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'difficulty', value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const addQuestionField = () => {
    setQuestions([...questions, { text: '' }]);
  };

  const removeQuestionField = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleGenerateAI = async () => {
    const { jobTitle, jobDescription, difficulty } = formData;
    if (!jobTitle || !jobDescription || !difficulty) {
      toast.error("Please fill in Job Title, Description, and Difficulty to generate questions.");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await generateAIQuestions({ jobTitle, jobDescription, difficulty, numQuestions });
      const generatedQuestions = response.questions.map((q: { text: string }) => ({ text: q.text }));
      if (generatedQuestions.length === 0) {
        toast.error("AI failed to generate questions, please try again.");
        setQuestions([{ text: '' }]);
      } else {
        setQuestions(generatedQuestions);
        toast.success(`${generatedQuestions.length} AI questions generated!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate questions.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.jobTitle || !formData.difficulty || !formData.jobDescription) {
        toast.error('Please fill in all job details, including the description.');
        return;
      }
      if (questions.some(q => q.text.trim() === '')) {
         toast.error('Please fill out all question fields or remove empty ones.');
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
    if (!expiresAt || !formData.candidateName || !formData.candidateEmail) {
      toast.error('Please fill in all candidate and scheduling details.');
      return;
    }
    
    const validQuestions = questions
        .filter(q => q.text.trim() !== '')
        .map(q => ({
          text: q.text.trim()
        }));
        
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question.');
      return;
    }

    const payload = { ...formData, expiresAt, questions: validQuestions };
    
    setIsLoading(true);
    const promise = createInterview(payload);

    toast.promise(promise, {
      loading: 'Scheduling interview...',
      success: (data) => {
        setCompletedInterview(data.interview);
        return `Interview for ${data.interview.candidateName} scheduled successfully!`;
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
    setCurrentStep(1);
    setQuestions([{ text: '' }]);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl shadow-slate-300/50 bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200/70">
      <CardHeader className="text-center p-8 bg-gradient-to-r from-slate-900 to-slate-700 rounded-t-lg">
        <CardTitle className="text-4xl font-bold tracking-tight text-white">
          Create AI-Powered Interview
        </CardTitle>
        <CardDescription className="text-lg text-slate-200 mt-2">
          {completedInterview
            ? 'Your interview has been scheduled! Share the unique link with the candidate.'
            : 'Effortlessly generate interview questions or enter your own to schedule with our AI assistant.'}
        </CardDescription>
        {!completedInterview && (
          <div className="pt-6">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} labels={['Job & Questions', 'Candidate & Schedule']} />
          </div>
        )}
      </CardHeader>

      <CardContent className="px-8 pb-8 bg-white rounded-b-lg">
        {completedInterview ? (
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl ring-1 ring-green-200 shadow-inner animate-in fade-in duration-700">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-200/50 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold mt-6 text-slate-900">Interview Scheduled!</h3>
            <p className="text-lg text-slate-600 mt-3">The unique interview link for <span className="font-semibold text-slate-900">{completedInterview.candidateName}</span> is ready.</p>
            
            <div className="mt-8 flex items-center w-full max-w-lg mx-auto bg-white border border-slate-300 rounded-xl shadow-sm p-3 pr-2 transition-all duration-300 hover:shadow-md hover:ring-2 hover:ring-slate-300">
              <Input readOnly value={completedInterview.interviewLink} className="border-none bg-transparent focus-visible:ring-0 text-base font-medium text-slate-900 truncate" />
              <Button variant="ghost" size="icon" onClick={handleCopyLink} className="flex-shrink-0 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetForm} size="lg" className="bg-slate-900 text-white shadow-lg hover:bg-slate-800 transform transition-all duration-300 hover:-translate-y-1">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Another Interview
              </Button>
              <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300">
                View All Interviews
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="bg-slate-50 rounded-xl p-6 ring-1 ring-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Job Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="jobTitle" className="text-slate-700 font-medium">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        value={formData.jobTitle} 
                        onChange={handleInputChange} 
                        placeholder="e.g., Senior Frontend Developer" 
                        required 
                        className="bg-white border-slate-300 focus:border-slate-400 transition-colors duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="difficulty" className="text-slate-700 font-medium">Difficulty Level</Label>
                      <Select onValueChange={(value) => handleSelectChange('difficulty', value)} value={formData.difficulty} required>
                        <SelectTrigger className="bg-white border-slate-300 focus:border-slate-400 transition-colors duration-300">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="jobDescription" className="text-slate-700 font-medium">Job Description & Skills</Label>
                    <Textarea 
                      id="jobDescription" 
                      value={formData.jobDescription} 
                      onChange={handleInputChange} 
                      placeholder="Paste the job description or list key responsibilities and required skills..." 
                      required 
                      rows={5}
                      className="bg-white border-slate-300 focus:border-slate-400 transition-colors duration-300 resize-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 ring-1 ring-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Interview Questions</h3>
                      <p className="text-slate-600 text-sm mt-1">Add questions manually or generate them with AI</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="numQuestions" className="text-sm text-slate-600 whitespace-nowrap">Questions:</Label>
                        <Input
                          id="numQuestions"
                          type="number"
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(Math.max(1, Math.min(15, Number(e.target.value))))}
                          min={1}
                          max={15}
                          className="w-20 bg-white border-slate-300"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={handleGenerateAI} disabled={isGenerating} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4 text-slate-600" />
                        )}
                        Generate AI
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 ring-1 ring-slate-200 transition-all duration-300 hover:ring-slate-300">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                            <span className="text-sm font-medium text-slate-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder={`Enter question ${index + 1}...`}
                              value={q.text}
                              onChange={(e) => handleQuestionChange(index, e.target.value)}
                              required
                              className="border-slate-300 focus:border-slate-400 bg-white"
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeQuestionField(index)} 
                            disabled={questions.length <= 1} 
                            className="flex-shrink-0 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addQuestionField} 
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={handleNextStep} 
                    size="lg" 
                    className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg transform transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Next Step <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-slate-50 rounded-xl p-6 ring-1 ring-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Candidate & Scheduling</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="candidateName" className="text-slate-700 font-medium">Candidate Name</Label>
                      <Input 
                        id="candidateName" 
                        value={formData.candidateName} 
                        onChange={handleInputChange} 
                        placeholder="e.g., Alice Johnson" 
                        required 
                        className="bg-white border-slate-300 focus:border-slate-400 transition-colors duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="candidateEmail" className="text-slate-700 font-medium">Candidate Email</Label>
                      <Input 
                        id="candidateEmail" 
                        value={formData.candidateEmail} 
                        onChange={handleInputChange} 
                        type="email" 
                        placeholder="e.g., alice@example.com" 
                        required 
                        className="bg-white border-slate-300 focus:border-slate-400 transition-colors duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <Label className="text-slate-700 font-medium">Interview Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant={"outline"} 
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400",
                            !expiresAt && "text-slate-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-5 w-5 text-slate-500" />
                          {expiresAt ? format(expiresAt, "PPP") : "Pick a date for the candidate to complete by"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={expiresAt} 
                          onSelect={setExpiresAt} 
                          initialFocus 
                          disabled={(date) => date < new Date() && date.toDateString() !== new Date().toDateString()}
                          className="rounded-md border border-slate-200 shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevStep} 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Previous
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isLoading} 
                    className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg transform transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : 'Schedule Interview'}
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