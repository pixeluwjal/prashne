'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createInterview, generateAIQuestions } from '@/lib/api/hr';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiCopy, FiPlus, FiTrash2, FiArrowRight, FiArrowLeft, FiCheckCircle, FiLoader, FiUser, FiMail, FiBriefcase, FiFileText, FiSearch, FiX, FiBook } from 'react-icons/fi';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CreatedInterview {
  candidateName: string;
  interviewLink: string;
}

interface JobDescription {
  _id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  location: string;
  createdAt: string;
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
  
  // JD Selection State
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [showJDSelector, setShowJDSelector] = useState(false);
  const [jdSearchTerm, setJdSearchTerm] = useState('');
  const [isLoadingJDs, setIsLoadingJDs] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, difficulty: value }));
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

  // Fetch Job Descriptions
  const fetchJobDescriptions = async () => {
    setIsLoadingJDs(true);
    try {
      const response = await fetch('/api/jds');
      const result = await response.json();
      if (result.success) {
        setJobDescriptions(result.data);
      } else {
        toast.error('Failed to load job descriptions');
      }
    } catch (error) {
      toast.error('Error loading job descriptions');
    } finally {
      setIsLoadingJDs(false);
    }
  };

  // Load JDs when selector opens
  useEffect(() => {
    if (showJDSelector) {
      fetchJobDescriptions();
    }
  }, [showJDSelector]);

  // Filter JDs based on search
  const filteredJDs = jobDescriptions.filter(jd =>
    jd.title.toLowerCase().includes(jdSearchTerm.toLowerCase()) ||
    jd.company.toLowerCase().includes(jdSearchTerm.toLowerCase()) ||
    jd.skills.some(skill => skill.toLowerCase().includes(jdSearchTerm.toLowerCase()))
  );

  // Select JD and populate form
  const handleSelectJD = (jd: JobDescription) => {
    setFormData(prev => ({
      ...prev,
      jobTitle: jd.title,
      jobDescription: jd.description
    }));
    setShowJDSelector(false);
    setJdSearchTerm('');
    toast.success(`Selected JD: ${jd.title}`);
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

  const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );

  // Sparkles icon component since it's not in react-icons/fi
  const SparklesIcon = ({ className = "w-4 h-4" }) => (
    <svg 
      stroke="currentColor" 
      fill="none" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      className={className}
    >
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
    </svg>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiFileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Create AI Interview
              </h1>
            </div>
            <p className="text-slate-300 text-lg mt-2">
              {completedInterview
                ? 'Interview scheduled! Share the unique link with your candidate.'
                : 'Generate AI-powered questions and schedule interviews effortlessly.'}
            </p>
            {!completedInterview && (
              <div className="mt-8">
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span className={currentStep >= 1 ? "text-blue-400 font-semibold" : ""}>Job & Questions</span>
                  <span className={currentStep >= 2 ? "text-blue-400 font-semibold" : ""}>Candidate & Schedule</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {completedInterview ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiCheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Interview Scheduled!</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                  The unique interview link for <span className="font-semibold text-slate-900 dark:text-white">{completedInterview.candidateName}</span> is ready.
                </p>

                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
                  <input
                    readOnly
                    value={completedInterview.interviewLink}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm font-medium truncate px-3"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <FiCopy className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300"
                  >
                    <FiPlus className="w-5 h-5" />
                    Create Another Interview
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Job Details - Left Side */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FiBriefcase className="w-5 h-5 text-blue-500" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Job Details</h3>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowJDSelector(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          <FiBook className="w-4 h-4" />
                          Choose from JDs
                        </motion.button>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Difficulty Level
                          </label>
                          <select
                            value={formData.difficulty}
                            onChange={(e) => handleSelectChange(e.target.value)}
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                          >
                            <option value="">Select difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Job Description & Skills
                          </label>
                          <textarea
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleInputChange}
                            placeholder="Paste the job description or list key responsibilities and required skills..."
                            rows={6}
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Questions Section - Right Side */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <FiFileText className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interview Questions</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Add questions manually or generate with AI</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Questions:</span>
                            <input
                              type="number"
                              value={numQuestions}
                              onChange={(e) => setNumQuestions(Math.max(1, Math.min(15, Number(e.target.value))))}
                              min={1}
                              max={15}
                              className="w-16 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-center text-slate-900 dark:text-white"
                            />
                          </div>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                          >
                            {isGenerating ? (
                              <FiLoader className="w-4 h-4 animate-spin" />
                            ) : (
                              <SparklesIcon className="w-4 h-4" />
                            )}
                            Generate AI
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {questions.map((q, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-300/50 dark:border-slate-600/50"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{index + 1}</span>
                            </div>
                            <input
                              type="text"
                              placeholder={`Enter question ${index + 1}...`}
                              value={q.text}
                              onChange={(e) => handleQuestionChange(index, e.target.value)}
                              className="flex-1 p-2 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-500"
                            />
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeQuestionField(index)}
                              disabled={questions.length <= 1}
                              className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={addQuestionField}
                          className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                        >
                          <FiPlus className="w-5 h-5 mx-auto" />
                        </motion.button>
                      </div>

                      <div className="flex justify-end mt-6">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNextStep}
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300"
                        >
                          Next Step
                          <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Candidate Details */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <FiUser className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Candidate Details</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Candidate Name
                          </label>
                          <input
                            type="text"
                            name="candidateName"
                            value={formData.candidateName}
                            onChange={handleInputChange}
                            placeholder="e.g., Alice Johnson"
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Candidate Email
                          </label>
                          <input
                            type="email"
                            name="candidateEmail"
                            value={formData.candidateEmail}
                            onChange={handleInputChange}
                            placeholder="e.g., alice@example.com"
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scheduling */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <FiCalendar className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interview Scheduling</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Interview Expiry Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  "w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-left flex items-center gap-3",
                                  !expiresAt && "text-slate-500"
                                )}
                              >
                                <FiCalendar className="w-5 h-5 text-slate-500" />
                                {expiresAt ? format(expiresAt, "PPP") : "Pick expiry date"}
                              </motion.button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={expiresAt}
                                onSelect={setExpiresAt}
                                initialFocus
                                disabled={(date) => date < new Date()}
                                className="rounded-md border border-slate-200 dark:border-slate-700"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="flex justify-between pt-4">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePrevStep}
                            className="flex items-center gap-3 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <FiArrowLeft className="w-5 h-5" />
                            Previous
                          </motion.button>
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <FiLoader className="w-5 h-5 animate-spin" />
                            ) : (
                              'Schedule Interview'
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* JD Selector Modal */}
      <AnimatePresence>
        {showJDSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowJDSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 flex justify-between items-center border-b border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiBook className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select Job Description</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Choose from your existing job descriptions</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(148, 163, 184, 0.3)' }} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => setShowJDSelector(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-slate-300 dark:border-slate-700">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search job descriptions..." 
                    value={jdSearchTerm} 
                    onChange={(e) => setJdSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  />
                </div>
              </div>

              {/* JD List */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingJDs ? (
                  <div className="flex items-center justify-center py-12">
                    <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredJDs.length === 0 ? (
                  <div className="text-center py-12">
                    <FiBook className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      {jdSearchTerm ? 'No matching job descriptions found' : 'No job descriptions available'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredJDs.map((jd) => (
                      <motion.div
                        key={jd._id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-300 dark:border-slate-600 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        onClick={() => handleSelectJD(jd)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg">{jd.title}</h3>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {format(new Date(jd.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                          {jd.company} • {jd.location}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {jd.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {jd.skills.length > 4 && (
                            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                              +{jd.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}