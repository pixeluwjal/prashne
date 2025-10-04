'use client';

import React, { useState, useEffect, useCallback, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBriefcase, FiZap, FiCheckCircle, FiLoader, FiChevronDown, FiX, FiUsers, FiTarget, FiCheck, FiMinus, FiStar, FiAward, FiTrendingUp, FiSearch, FiFilter, FiMenu, FiXCircle } from 'react-icons/fi';

// --- Placeholder Types (Ensure these match your actual Mongoose types) ---
interface IJobDescription {
    _id: string;
    title: string;
    company: string;
    skills: string[];
}
interface IResume {
    _id: string;
    fullName: string;
    email: string;
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

const ScoreBadge: FC<{ score: number }> = ({ score }) => {
    let color = 'bg-red-500';
    let text = 'text-red-100';
    if (score >= 90) {
        color = 'bg-gradient-to-r from-emerald-500 to-green-600';
        text = 'text-white';
    } else if (score >= 80) {
        color = 'bg-gradient-to-r from-green-500 to-emerald-600';
        text = 'text-white';
    } else if (score >= 70) {
        color = 'bg-gradient-to-r from-yellow-500 to-amber-600';
        text = 'text-amber-900';
    } else if (score >= 60) {
        color = 'bg-gradient-to-r from-orange-500 to-amber-600';
        text = 'text-orange-900';
    }

    return (
        <div className={`${color} ${text} px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {score}% Match
        </div>
    );
};

const ResumeMatchCard: FC<{ resume: IResume, result: IMatchResult, rank: number }> = ({ resume, result, rank }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const getRankColor = () => {
        if (rank === 1) return 'from-yellow-400 to-amber-500 text-amber-900';
        if (rank === 2) return 'from-slate-400 to-slate-500 text-slate-900';
        if (rank === 3) return 'from-orange-400 to-orange-600 text-orange-900';
        return 'from-blue-500 to-purple-600 text-white';
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500"
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
                            <ScoreBadge score={result.matchScore} />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{resume.email}</p>
                        
                        {/* Strength Preview */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                            {result.strengths.slice(0, 2).map((strength, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30">
                                    <FiCheckCircle className="w-3 h-3 mr-1" />
                                    {strength}
                                </span>
                            ))}
                            {result.strengths.length > 2 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-300/50 dark:border-slate-600/50">
                                    +{result.strengths.length - 2} more
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

            {/* Expandable Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                            <div>
                                <h4 className="font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <div className="p-1 bg-green-500/20 rounded-lg">
                                        <FiTrendingUp className="w-4 h-4" />
                                    </div>
                                    Key Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {result.strengths.map((s, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-green-500/5 p-3 rounded-xl border border-green-500/10"
                                        >
                                            <FiCheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>{s}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <div className="p-1 bg-red-500/20 rounded-lg">
                                        <FiX className="w-4 h-4" />
                                    </div>
                                    Areas for Development
                                </h4>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((w, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-red-500/5 p-3 rounded-xl border border-red-500/10"
                                        >
                                            <FiMinus className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                            <span>{w}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-4 py-2.5 sm:py-3 bg-slate-100/50 dark:bg-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/70 border border-slate-300/50 dark:border-slate-600/50 rounded-xl text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 transition-all duration-300 group text-sm sm:text-base"
            >
                {isExpanded ? 'Show Less' : 'View Detailed Analysis'}
                <motion.span 
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="group-hover:scale-110 transition-transform"
                >
                    <FiChevronDown />
                </motion.span>
            </motion.button>
        </motion.div>
    );
};

const JobDescriptionCard: FC<{ jd: IJobDescription, isSelected: boolean, onClick: () => void }> = ({ jd, isSelected, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
            isSelected 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-2xl shadow-blue-500/20' 
                : 'bg-white/50 dark:bg-slate-800/30 border-slate-300/50 dark:border-slate-600/50 hover:border-slate-400/50 dark:hover:border-slate-500/50 shadow-lg hover:shadow-xl'
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
        <div className="flex flex-wrap gap-1.5">
            {jd.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-300/50 dark:border-slate-600/50">
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

const CandidateSelectionCard: FC<{ resume: IResume, isSelected: boolean, onToggle: () => void }> = ({ resume, isSelected, onToggle }) => (
    <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="w-full text-left p-3 sm:p-4 rounded-2xl border bg-white/50 dark:bg-slate-800/30 border-slate-300/50 dark:border-slate-600/50 hover:border-slate-400/50 dark:hover:border-slate-500/50 flex items-center gap-3 sm:gap-4 transition-all duration-300 backdrop-blur-sm group"
    >
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
            isSelected 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent shadow-lg shadow-blue-500/30' 
                : 'border-slate-400 dark:border-slate-500 bg-white/50 dark:bg-slate-700/50 group-hover:border-slate-500 dark:group-hover:border-slate-400'
        }`}>
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                    <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </motion.div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{resume.fullName}</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs truncate">{resume.email}</p>
        </div>
    </motion.button>
);

// --- MOBILE SIDEBAR ---
const MobileSidebar: FC<{
    isOpen: boolean;
    onClose: () => void;
    jds: IJobDescription[];
    selectedJdId: string | null;
    setSelectedJdId: (id: string) => void;
    resumes: IResume[];
    selectedResumeIds: Set<string>;
    handleSelectResume: (id: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredResumes: IResume[];
    runBulkMatch: () => void;
    loading: boolean;
}> = ({ isOpen, onClose, ...props }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 z-50 lg:hidden overflow-y-auto"
                >
                    <div className="p-4 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Setup Matching</h2>
                            <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Job Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FiBriefcase className="w-5 h-5 text-blue-500" />
                                Job Description
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {props.jds.map(jd => (
                                    <JobDescriptionCard
                                        key={jd._id}
                                        jd={jd}
                                        isSelected={props.selectedJdId === jd._id}
                                        onClick={() => props.setSelectedJdId(jd._id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Candidate Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FiUsers className="w-5 h-5 text-purple-500" />
                                    Candidates
                                </h3>
                                <button
                                    onClick={() => props.handleSelectResume('all')}
                                    className="text-sm font-semibold bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/70 px-2 py-1 rounded-lg border border-slate-300/50 dark:border-slate-600/50 transition-colors text-slate-700 dark:text-slate-300"
                                >
                                    {props.selectedResumeIds.size === props.filteredResumes.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            
                            <div className="relative mb-3">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    value={props.searchTerm}
                                    onChange={(e) => props.setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                />
                            </div>
                            
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {props.filteredResumes.map(resume => (
                                    <CandidateSelectionCard
                                        key={resume._id}
                                        resume={resume}
                                        isSelected={props.selectedResumeIds.has(resume._id)}
                                        onToggle={() => props.handleSelectResume(resume._id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={props.runBulkMatch}
                            disabled={!props.selectedJdId || props.selectedResumeIds.size === 0 || props.loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:opacity-50"
                        >
                            {props.loading ? (
                                <FiLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                <FiZap className="w-5 h-5" />
                            )}
                            {props.loading ? 'Analyzing...' : `Analyze ${props.selectedResumeIds.size}`}
                        </motion.button>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

// --- MAIN PAGE COMPONENT ---
export default function MatchPage() {
    const [jds, setJds] = useState<IJobDescription[]>([]);
    const [resumes, setResumes] = useState<IResume[]>([]);
    const [selectedJdId, setSelectedJdId] = useState<string | null>(null);
    const [selectedResumeIds, setSelectedResumeIds] = useState<Set<string>>(new Set());
    const [results, setResults] = useState<IMatchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

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
            setSelectedResumeIds(new Set(resumesData.data.map((r: IResume) => r._id)));
        } catch (error: any) {
            toast.error(`Error loading data: ${error.message}`);
        } finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => { loadInitialData(); }, [loadInitialData]);

    const handleSelectResume = (id: string) => {
        if (id === 'all') {
            setSelectedResumeIds(prev => 
                prev.size === filteredResumes.length ? new Set() : new Set(filteredResumes.map(r => r._id))
            );
            return;
        }
        const newSet = new Set(selectedResumeIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedResumeIds(newSet);
    };

    const runBulkMatch = async () => {
        if (!selectedJdId || selectedResumeIds.size === 0) {
            toast.error("Please select a JD and at least one candidate.");
            return;
        }
        setLoading(true); 
        setResults([]);
        setMobileSidebarOpen(false);
        
        const matchToast = toast.loading(
            <div className="flex items-center gap-3">
                <FiLoader className="w-5 h-5 animate-spin" />
                <div>
                    <p className="font-semibold">AI Analysis in Progress</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing {selectedResumeIds.size} candidates...</p>
                </div>
            </div>,
            { duration: Infinity }
        );

        try {
            const res = await fetch(`${API_BASE}/resumes/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jdId: selectedJdId, candidateIds: Array.from(selectedResumeIds) }),
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to perform bulk matching');
            }
            
            const data = await res.json();
            const resultsData = (data.data || []).sort((a: IMatchResult, b: IMatchResult) => b.matchScore - a.matchScore);
            setResults(resultsData);
            
            toast.success(
                <div className="flex items-center gap-3">
                    <FiAward className="w-6 h-6 text-green-500 dark:text-green-400" />
                    <div>
                        <p className="font-semibold">Matching Complete!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Found {resultsData.length} matches</p>
                    </div>
                </div>,
                { id: matchToast }
            );
        } catch (error: any) {
            console.error('Matching Error:', error);
            toast.error(
                <div className="flex items-center gap-3">
                    <FiX className="w-5 h-5 text-red-500 dark:text-red-400" />
                    <div>
                        <p className="font-semibold">Matching Failed</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
                    </div>
                </div>,
                { id: matchToast }
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredResumes = resumes.filter(resume =>
        resume.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-200 font-sans p-3 sm:p-4 md:p-6 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-grid-slate-300/30 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)]"></div>
            <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="max-w-8xl mx-auto relative z-10">
                {/* Enhanced Header with Single Mobile Control */}
                <div className="text-center mb-8 sm:mb-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 mb-6 shadow-2xl relative"
                    >
                        {/* Single Mobile Menu Button - Only show when needed */}
                        {jds.length > 0 && resumes.length > 0 && (
                            <button 
                                onClick={() => setMobileSidebarOpen(true)}
                                className="lg:hidden absolute left-4 top-4 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <FiMenu className="w-5 h-5" />
                            </button>
                        )}

                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <FiTarget className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                                AI Resume Matcher
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg font-medium">Intelligent candidate-job matching powered by AI</p>
                        </div>
                    </motion.div>

                    {/* Mobile Quick Stats - Only show when data is loaded */}
                    {jds.length > 0 && resumes.length > 0 && (
                        <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">{jds.length}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Jobs</div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">{resumes.length}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Candidates</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Show empty state if no data */}
                {jds.length === 0 || resumes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 sm:py-20 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-dashed border-slate-300/50 dark:border-slate-700/50 rounded-3xl shadow-2xl"
                    >
                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center border border-slate-300/50 dark:border-slate-600/50">
                            <FiTarget className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500 dark:text-slate-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                            {jds.length === 0 && resumes.length === 0 ? 'No Data Available' : 
                             jds.length === 0 ? 'No Job Descriptions' : 'No Resumes Available'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-sm sm:text-lg mb-4 sm:mb-6 px-4">
                            {jds.length === 0 && resumes.length === 0 
                                ? 'Please add job descriptions and resumes to start matching.'
                                : jds.length === 0 
                                ? 'Create some job descriptions first to enable matching.'
                                : 'Upload some resumes to start matching against your job descriptions.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                        {/* --- LEFT COLUMN: SETUP (FIXED) --- */}
                        <motion.div 
                            layout
                            className="hidden lg:block lg:col-span-1 bg-white/50 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 space-y-6 sticky top-8 shadow-2xl"
                            style={{ 
                                height: 'calc(100vh - 4rem)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Job Selection */}
                            <div className="flex-shrink-0">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                        <FiBriefcase className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    Select Job Description
                                </h2>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {jds.map(jd => (
                                        <JobDescriptionCard
                                            key={jd._id}
                                            jd={jd}
                                            isSelected={selectedJdId === jd._id}
                                            onClick={() => setSelectedJdId(jd._id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Candidate Selection */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex-shrink-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                                <FiUsers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                            </div>
                                            Select Candidates
                                        </h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelectResume('all')}
                                            className="text-sm font-semibold bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/70 px-3 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-600/50 transition-colors text-slate-700 dark:text-slate-300"
                                        >
                                            {selectedResumeIds.size === filteredResumes.length ? 'Deselect All' : 'Select All'}
                                        </motion.button>
                                    </div>
                                    
                                    {/* Search */}
                                    <div className="relative mb-4">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search candidates..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-2">
                                        {filteredResumes.map(resume => (
                                            <CandidateSelectionCard
                                                key={resume._id}
                                                resume={resume}
                                                isSelected={selectedResumeIds.has(resume._id)}
                                                onToggle={() => handleSelectResume(resume._id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <motion.button 
                                whileHover={{ 
                                    scale: 1.02, 
                                    boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" 
                                }} 
                                whileTap={{ scale: 0.98 }} 
                                onClick={runBulkMatch}
                                disabled={!selectedJdId || selectedResumeIds.size === 0 || loading}
                                className="w-full flex-shrink-0 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl relative overflow-hidden group mt-4"
                            >
                                {loading && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-3">
                                    {loading ? (
                                        <FiLoader className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <FiZap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    )}
                                    {loading ? 'AI Analysis in Progress...' : `Analyze ${selectedResumeIds.size} Candidate${selectedResumeIds.size !== 1 ? 's' : ''}`}
                                </span>
                            </motion.button>
                        </motion.div>

                        {/* --- RIGHT COLUMN: RESULTS (SCROLLABLE) --- */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6" style={{ maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
                            {/* Single Mobile Floating Action Button - Only show when data is available */}
                            {jds.length > 0 && resumes.length > 0 && (
                                <div className="lg:hidden fixed bottom-6 right-6 z-30">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMobileSidebarOpen(true)}
                                        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl flex items-center justify-center"
                                    >
                                        <FiMenu className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {loading && (
                                    <motion.div 
                                        key="loader" 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex justify-center items-center py-12 sm:py-20 text-center bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
                                    >
                                        <div className="space-y-4 sm:space-y-6 px-4">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                                            >
                                                <FiLoader className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">AI Analysis in Progress</h3>
                                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-lg">
                                                    Analyzing {selectedResumeIds.size} candidates against your job requirements...
                                                </p>
                                            </div>
                                            <motion.div 
                                                className="w-40 sm:w-48 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto overflow-hidden"
                                            >
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {!loading && results.length === 0 && (
                                    <motion.div 
                                        key="prompt" 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-12 sm:py-20 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-dashed border-slate-300/50 dark:border-slate-700/50 rounded-3xl shadow-2xl mx-2 sm:mx-0"
                                    >
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center border border-slate-300/50 dark:border-slate-600/50">
                                            <FiTarget className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500 dark:text-slate-500" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Ready to Match Candidates</h3>
                                        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto text-sm sm:text-lg mb-4 sm:mb-6 px-4">
                                            Select a Job Description and candidates, then run the AI analysis to see detailed matching results.
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-500 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2 justify-center">
                                                <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>1. Choose Job</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>2. Select Candidates</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <FiZap className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>3. Run Analysis</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {!loading && results.length > 0 && (
                                    <motion.div 
                                        key="results"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 px-2 sm:px-0">
                                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <FiAward className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500 dark:text-yellow-400" />
                                                Matching Results
                                                <span className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-normal">
                                                    ({results.length} candidate{results.length !== 1 ? 's' : ''})
                                                </span>
                                            </h2>
                                            <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium bg-slate-200/50 dark:bg-slate-800/50 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-300/50 dark:border-slate-700/50 self-start sm:self-auto">
                                                Sorted by Match Score
                                            </div>
                                        </div>
                                        
                                        {results.map((result, index) => {
                                            const resume = resumes.find(r => r._id === result.candidateId);
                                            return resume ? (
                                                <ResumeMatchCard 
                                                    key={result.candidateId} 
                                                    resume={resume} 
                                                    result={result} 
                                                    rank={index + 1} 
                                                />
                                            ) : null;
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                jds={jds}
                selectedJdId={selectedJdId}
                setSelectedJdId={setSelectedJdId}
                resumes={resumes}
                selectedResumeIds={selectedResumeIds}
                handleSelectResume={handleSelectResume}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredResumes={filteredResumes}
                runBulkMatch={runBulkMatch}
                loading={loading}
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(226, 232, 240, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.7);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.3);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.5);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 116, 139, 0.7);
                }
            `}</style>
        </div>
    );
}