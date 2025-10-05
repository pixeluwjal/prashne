'use client';

import React, { useState, useEffect, useCallback, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBriefcase, FiZap, FiLoader, FiX, FiUsers, FiTarget, FiCheck, FiAward, FiTrendingUp, FiSearch, FiFilter, FiArrowRight, FiArrowLeft, FiCalendar } from 'react-icons/fi';

// --- Placeholder Types ---
interface IJobDescription {
    _id: string;
    title: string;
    company: string;
    skills: string[];
    description: string;
}

interface IResume {
    _id: string;
    fullName: string;
    email: string;
    skills: string[];
}

// --- TYPES FOR MATCHING ---
interface IMatchResult {
    candidateId: string;
    matchScore: number;
    overallSummary: string;
    strengths: string[];
    weaknesses: string[];
}

const API_BASE = '/api';

// --- STUNNING NEW SUB-COMPONENTS ---

const CircularScore: FC<{ score: number }> = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let gradient = 'from-red-500 to-red-600';
    let glow = 'shadow-red-500/20';
    if (score >= 90) {
        gradient = 'from-emerald-500 to-green-600';
        glow = 'shadow-emerald-500/30';
    } else if (score >= 80) {
        gradient = 'from-green-500 to-emerald-600';
        glow = 'shadow-green-500/25';
    } else if (score >= 70) {
        gradient = 'from-yellow-500 to-amber-600';
        glow = 'shadow-yellow-500/20';
    } else if (score >= 60) {
        gradient = 'from-orange-500 to-amber-600';
        glow = 'shadow-orange-500/20';
    } else if (score >= 50) {
        gradient = 'from-orange-500 to-red-500';
        glow = 'shadow-orange-500/15';
    }

    return (
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle className="text-slate-300/50 dark:text-slate-700/50" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                <motion.circle
                    className={`bg-gradient-to-r ${gradient}`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center flex-col ${glow}`}>
                <span className="text-xl sm:text-2xl font-black text-white drop-shadow-lg">{score}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mt-[-2px]">MATCH</span>
            </div>
        </div>
    );
};

const ResumeMatchCard: FC<{ 
    resume: IResume, 
    result: IMatchResult, 
    rank: number,
    jobDescription: IJobDescription | null,
    onScheduleInterview: (candidate: IResume, jd: IJobDescription) => void 
}> = ({ resume, result, rank, jobDescription, onScheduleInterview }) => {
    
    const getRankColor = () => {
        if (rank === 1) return 'from-yellow-400 to-amber-500 text-amber-900';
        if (rank === 2) return 'from-slate-400 to-slate-500 text-slate-900';
        if (rank === 3) return 'from-orange-400 to-orange-600 text-orange-900';
        return 'from-blue-500 to-purple-600 text-white';
    };

    const handleScheduleInterview = () => {
        if (jobDescription) {
            onScheduleInterview(resume, jobDescription);
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500"
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getRankColor()} rounded-2xl flex items-center justify-center font-black text-sm sm:text-lg shadow-lg`}>
                        #{rank}
                    </div>
                    
                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">{resume.fullName}</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{resume.email}</p>
                        
                        {/* Skills Preview */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                            {resume.skills.slice(0, 4).map((skill, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                                    {skill}
                                </span>
                            ))}
                            {resume.skills.length > 4 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                                    +{resume.skills.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Circular Score */}
                <div className="flex-shrink-0 self-center sm:self-auto">
                    <CircularScore score={result.matchScore} />
                </div>
            </div>

            {/* Summary */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 font-medium italic border-l-4 border-blue-500/50 pl-3 sm:pl-4 bg-blue-500/5 py-2 rounded-r-xl"
            >
                "{result.overallSummary}"
            </motion.p>

            {/* Schedule Interview Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScheduleInterview}
                disabled={!jobDescription}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FiCalendar className="w-4 h-4" />
                Schedule Interview
            </motion.button>
        </motion.div>
    );
};

const JobDescriptionCard: FC<{ 
    jd: IJobDescription; 
    isSelected: boolean; 
    onClick: () => void;
    showDescription?: boolean;
}> = ({ jd, isSelected, onClick, showDescription = false }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
            isSelected 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400 dark:border-blue-600 shadow-2xl shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 shadow-lg hover:shadow-xl'
        }`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2 leading-tight">{jd.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{jd.company}</p>
            </div>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ml-2 sm:ml-3"
                >
                    <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </motion.div>
            )}
        </div>
        
        {showDescription && jd.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                {jd.description}
            </p>
        )}
        
        <div className="flex flex-wrap gap-1.5">
            {jd.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-300 dark:border-slate-600">
                    {skill}
                </span>
            ))}
            {jd.skills.length > 3 && (
                <span className="px-2 py-1 bg-slate-200/30 dark:bg-slate-700/30 text-slate-500 dark:text-slate-500 text-xs font-medium rounded-full">
                    +{jd.skills.length - 3}
                </span>
            )}
        </div>
    </motion.button>
);

// --- SIMPLE SLIDER COMPONENT ---
const MinScoreSlider: FC<{
    minScore: number;
    onMinChange: (value: number) => void;
}> = ({ minScore, onMinChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onMinChange(Number(e.target.value));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Minimum Match Score</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {minScore}%+
                </span>
            </div>
            
            <div className="space-y-4">
                {/* Slider */}
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={handleChange}
                        className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div 
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg pointer-events-none"
                        style={{ width: `${minScore}%` }}
                    />
                </div>
                
                {/* Quick select buttons */}
                <div className="flex justify-between">
                    {[0, 25, 50, 75, 100].map((score) => (
                        <button
                            key={score}
                            onClick={() => onMinChange(score)}
                            className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                                minScore === score
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {score}%
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- ONBOARDING STEPS ---
type OnboardingStep = 'select-jd' | 'set-filters' | 'view-results';

// --- MAIN PAGE COMPONENT ---
export default function MatchPage() {
    const [jds, setJds] = useState<IJobDescription[]>([]);
    const [resumes, setResumes] = useState<IResume[]>([]);
    const [selectedJd, setSelectedJd] = useState<IJobDescription | null>(null);
    const [results, setResults] = useState<IMatchResult[]>([]);
    const [filteredResults, setFilteredResults] = useState<IMatchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [minScore, setMinScore] = useState(70);
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('select-jd');

    const loadInitialData = useCallback(async () => {
        setInitialLoading(true);
        try {
            const [jdsRes, resumesRes] = await Promise.all([
                fetch(`${API_BASE}/jds`),
                fetch(`${API_BASE}/resumes`)
            ]);
            if (!jdsRes.ok || !resumesRes.ok) throw new Error('Failed to load initial data.');
            const jdsData = await jdsRes.json();
            const resumesData = await resumesRes.json();
            setJds(jdsData.data || []);
            setResumes(resumesData.data || []);
        } catch (error: any) {
            toast.error(`Error loading data: ${error.message}`);
        } finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => { 
        loadInitialData(); 
    }, [loadInitialData]);

    useEffect(() => {
        // Filter results based on score range
        const filtered = results.filter(result => result.matchScore >= minScore);
        setFilteredResults(filtered);
    }, [results, minScore]);

    const filteredJds = jds.filter(jd =>
        jd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const runBulkMatch = async () => {
        if (!selectedJd) {
            toast.error("Please select a Job Description.");
            return;
        }
        
        setLoading(true); 
        setResults([]);
        
        const matchToast = toast.loading(
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">AI Matching in Progress</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Finding best candidates for your job...</p>
                </div>
            </div>,
            { duration: Infinity }
        );

        try {
            const res = await fetch(`${API_BASE}/resumes/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    jdId: selectedJd._id, 
                    candidateIds: resumes.map(r => r._id) 
                }),
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to perform matching');
            }
            
            const data = await res.json();
            const resultsData = (data.data || []).sort((a: IMatchResult, b: IMatchResult) => b.matchScore - a.matchScore);
            setResults(resultsData);
            setCurrentStep('view-results');
            
            toast.success(
                <div className="flex items-center gap-3">
                    <FiAward className="w-6 h-6 text-green-500" />
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Matching Complete!</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Found {resultsData.length} potential matches</p>
                    </div>
                </div>,
                { 
                    id: matchToast,
                    duration: 4000
                }
            );
        } catch (error: any) {
            console.error('Matching Error:', error);
            toast.error(
                <div className="flex items-center gap-3">
                    <FiX className="w-5 h-5 text-red-500" />
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Matching Failed</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{error.message}</p>
                    </div>
                </div>,
                { 
                    id: matchToast,
                    duration: 5000
                }
            );
        } finally {
            setLoading(false);
        }
    };

const handleScheduleInterview = (candidate: IResume, jd: IJobDescription) => {
    // Create URL parameters with candidate and JD details
    const queryParams = new URLSearchParams({
        candidateId: candidate._id,
        candidateName: candidate.fullName,
        candidateEmail: candidate.email,
        jdId: jd._id,
        jdTitle: jd.title,
        jdCompany: jd.company,
        jdDescription: jd.description || ''
    });

    // Redirect to the CORRECT create interview page route
    window.location.href = `/dashboard/hr/create-interview?${queryParams.toString()}`;
};
    const handleJdSelect = (jd: IJobDescription) => {
        setSelectedJd(jd);
        setCurrentStep('set-filters');
    };

    const handleBack = () => {
        if (currentStep === 'set-filters') {
            setCurrentStep('select-jd');
        } else if (currentStep === 'view-results') {
            setCurrentStep('set-filters');
        }
    };

    const handleFindMatches = () => {
        runBulkMatch();
    };

    // Initial loading state
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                    >
                        <FiLoader className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">Loading AI Matcher</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                        Preparing your data for intelligent matching...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] font-sans p-3 sm:p-4 md:p-6 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,black_5%,transparent_95%)]"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <FiTarget className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1 sm:mb-2">
                                AI Resume Matcher
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
                                Find the perfect candidates in 3 simple steps
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Steps */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-6 sm:mb-8"
                >
                    <div className="flex items-center justify-center gap-2 sm:gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-md">
                        {[
                            { step: 'select-jd', label: 'Select Job', icon: FiBriefcase },
                            { step: 'set-filters', label: 'Set Filters', icon: FiFilter },
                            { step: 'view-results', label: 'View Results', icon: FiAward },
                        ].map((item, index) => (
                            <div key={item.step} className="flex items-center gap-2 sm:gap-3">
                                <div className={`flex items-center gap-2 ${
                                    currentStep === item.step 
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                        : currentStep > item.step
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-slate-400 dark:text-slate-600'
                                }`}>
                                    <div className={`p-2 rounded-lg ${
                                        currentStep === item.step 
                                            ? 'bg-blue-500/20 border border-blue-500/30' 
                                            : currentStep > item.step
                                            ? 'bg-green-500/20 border border-green-500/30'
                                            : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                                    }`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm hidden sm:block">{item.label}</span>
                                </div>
                                {index < 2 && (
                                    <div className={`w-4 sm:w-8 h-0.5 ${
                                        currentStep > item.step 
                                            ? 'bg-green-500' 
                                            : 'bg-slate-300 dark:bg-slate-700'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: Select Job Description */}
                        {currentStep === 'select-jd' && (
                            <motion.div
                                key="select-jd"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <div className="text-center mb-4 sm:mb-8">
                                    <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        Select a Job Description
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                        Choose the job you want to find candidates for
                                    </p>
                                </div>

                                {/* Search */}
                                <div className="relative max-w-md mx-auto">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search jobs by title, company, or skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500"
                                    />
                                </div>

                                {/* Job Cards Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredJds.map(jd => (
                                        <JobDescriptionCard
                                            key={jd._id}
                                            jd={jd}
                                            isSelected={selectedJd?._id === jd._id}
                                            onClick={() => handleJdSelect(jd)}
                                            showDescription={true}
                                        />
                                    ))}
                                </div>

                                {filteredJds.length === 0 && (
                                    <div className="text-center py-8 sm:py-12">
                                        <FiBriefcase className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                                            {searchTerm ? 'No jobs found matching your search.' : 'No job descriptions available.'}
                                        </p>
                                    </div>
                                )}

                                {/* Next Button */}
                                {selectedJd && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-center pt-4 sm:pt-6"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentStep('set-filters')}
                                            className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 shadow-xl text-sm sm:text-base"
                                        >
                                            Continue to Filters
                                            <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 2: Set Filters */}
                        {currentStep === 'set-filters' && (
                            <motion.div
                                key="set-filters"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-6 sm:space-y-8 max-w-2xl mx-auto"
                            >
                                <div className="text-center">
                                    <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        Set Match Filters
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                        Set the minimum match score for candidates
                                    </p>
                                </div>

                                {/* Selected Job Preview */}
                                {selectedJd && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-3 sm:p-4"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{selectedJd.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{selectedJd.company}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Simple Min Score Slider */}
                                <div className="bg-slate-100 dark:bg-slate-800 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                                    <MinScoreSlider
                                        minScore={minScore}
                                        onMinChange={setMinScore}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBack}
                                        className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 text-sm sm:text-base order-2 sm:order-1"
                                    >
                                        <FiArrowLeft className="w-4 h-4" />
                                        Back
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleFindMatches}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300 text-sm sm:text-base order-1 sm:order-2"
                                    >
                                        {loading ? (
                                            <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        ) : (
                                            <FiZap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                        {loading ? 'Finding Matches...' : 'Find Matches'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: View Results */}
                        {currentStep === 'view-results' && (
                            <motion.div
                                key="view-results"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex-1">
                                        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                                            Matching Results
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                            {filteredResults.length} candidates found with {minScore}%+ match score
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleBack}
                                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 text-sm order-2 sm:order-1"
                                        >
                                            <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Back
                                        </motion.button>

                                        {/* Score Filter in Results */}
                                        <div className="bg-slate-100 dark:bg-slate-800 backdrop-blur-sm rounded-xl p-3 border border-slate-200 dark:border-slate-700 order-1 sm:order-2">
                                            <MinScoreSlider
                                                minScore={minScore}
                                                onMinChange={setMinScore}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Results Grid */}
                                <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredResults.map((result, index) => {
                                        const resume = resumes.find(r => r._id === result.candidateId);
                                        return resume ? (
                                            <ResumeMatchCard 
                                                key={result.candidateId} 
                                                resume={resume} 
                                                result={result} 
                                                rank={index + 1}
                                                jobDescription={selectedJd}
                                                onScheduleInterview={handleScheduleInterview}
                                            />
                                        ) : null;
                                    })}
                                </div>

                                {filteredResults.length === 0 && (
                                    <div className="text-center py-8 sm:py-12">
                                        <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                                            No candidates found matching your criteria. Try adjusting the score range.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(148, 163, 184, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.5);
                }
                
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }
                
                .slider-thumb::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}