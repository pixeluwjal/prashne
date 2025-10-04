'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiBriefcase, FiMapPin, FiStar, FiFileText, FiGitMerge, FiLoader, FiZap, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- TYPES (for component state) ---
interface JDFormData {
    title: string;
    company: string;
    location: string;
    description: string;
    skills: string;
    aiPrompt: string;
    generateWithAi: boolean;
}

// --- SUB-COMPONENT ---
const SkillTag = ({ skill }: { skill: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        layout
        className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-blue-600 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap border border-blue-400/30"
    >
        <FiStar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
        {skill}
    </motion.div>
);

// --- MAIN PAGE COMPONENT ---
export default function CreateJDPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<JDFormData>({
        title: '',
        company: '',
        location: '',
        description: '',
        skills: '',
        aiPrompt: '',
        generateWithAi: false,
    });

    const skillsArray = useMemo(() =>
        formData.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0),
        [formData.skills]
    );

    // Improved logic for toggling modes without losing user input
    const toggleAiMode = () => {
        setFormData(prev => ({
            ...prev,
            generateWithAi: !prev.generateWithAi,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const creationToast = toast.loading(formData.generateWithAi ? 'Generating JD with AI...' : 'Creating job description...');

        try {
            let payload: any;
            if (formData.generateWithAi) {
                if (!formData.aiPrompt.trim()) {
                    toast.error("Please enter a prompt for AI generation.", { id: creationToast });
                    setLoading(false);
                    return;
                }
                payload = { generateWithAi: true, aiPrompt: formData.aiPrompt.trim() };
            } else {
                if (!formData.title.trim() || !formData.description.trim()) {
                    toast.error("Job Title and Description are required.", { id: creationToast });
                    setLoading(false);
                    return;
                }
                payload = {
                    title: formData.title.trim(),
                    company: formData.company.trim(),
                    location: formData.location.trim(),
                    description: formData.description.trim(),
                    skills: skillsArray,
                    generateWithAi: false
                };
            }

            const response = await fetch('/api/jds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                const errorMessage = data.error || `Server responded with status: ${response.status}`;
                throw new Error(errorMessage);
            }

            toast.success(formData.generateWithAi ? '🎉 AI-generated JD created!' : '🎉 Job description created!', { id: creationToast });
            router.push('/dashboard/hr/jd');

        } catch (error: any) {
            console.error('Failed to create JD:', error);
            toast.error(`❌ Failed to create JD: ${error.message || 'Network error.'}`, { id: creationToast });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute top-0 left-0 -translate-x-1/3 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 translate-x-1/3 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl opacity-50" />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto relative z-10">
                {/* Header with Back Button */}
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                Create Job Description
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                Define a new role to find the perfect candidate from your talent pool.
                            </p>
                        </div>
                         <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Go Back"
                        >
                            <FiArrowLeft size={18} /> Go Back
                        </motion.button>
                    </div>
                </header>

                {/* FORM */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8"
                >
                    <div className="space-y-8">
                        {/* Segmented Control */}
                        <div className="flex justify-center">
                            <div className="flex space-x-1 rounded-full bg-slate-100 dark:bg-slate-700/80 p-1.5 border border-slate-200 dark:border-slate-600/50">
                                {['Manual', 'AI Generate'].map(mode => {
                                    const isActive = (mode === 'AI Generate' && formData.generateWithAi) || (mode === 'Manual' && !formData.generateWithAi);
                                    return (
                                        <button
                                            key={mode} type="button" onClick={toggleAiMode}
                                            disabled={isActive}
                                            className="relative rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-default text-slate-600 dark:text-slate-300 disabled:text-white"
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-jd-pill"
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                                    style={{ borderRadius: 9999 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-2">
                                                {mode === 'Manual' ? <FiFileText /> : <FiZap />}
                                                {mode}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* AI GENERATION MODE */}
                            {formData.generateWithAi && (
                                <motion.div key="ai-mode" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                                    className="p-6 rounded-xl border border-purple-500 dark:border-purple-600/50 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-slate-800/20 space-y-4"
                                >
                                    <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                        <FiZap className="w-5 h-5" /> 
                                        AI Job Drafting
                                    </h2>
                                    <p className="text-sm text-purple-600 dark:text-purple-300/80">
                                        Enter a brief prompt, and the AI will generate the full JD and skills list for you.
                                    </p>
                                    <div className="relative">
                                        <textarea 
                                            id="aiPrompt" 
                                            name="aiPrompt" 
                                            required 
                                            rows={3} 
                                            value={formData.aiPrompt} 
                                            onChange={handleChange}
                                            placeholder="e.g. A Senior Full Stack Developer role focusing on Next.js, AWS, and GraphQL for a remote startup."
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/80 border border-purple-400 dark:border-purple-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-vertical text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                        <label htmlFor="aiPrompt" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-purple-600 dark:text-purple-400">
                                            AI Prompt *
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* MANUAL ENTRY MODE */}
                            {!formData.generateWithAi && (
                                <motion.div key="manual-mode" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                                    {/* Job Title */}
                                    <div className="relative">
                                        <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input 
                                            type="text" 
                                            id="title" 
                                            name="title" 
                                            required 
                                            value={formData.title} 
                                            onChange={handleChange} 
                                            placeholder="Senior Frontend Developer" 
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                        <label htmlFor="title" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                            Job Title *
                                        </label>
                                    </div>
                                    
                                    {/* Company and Location */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative">
                                            <FiGitMerge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input 
                                                type="text" 
                                                id="company" 
                                                name="company" 
                                                value={formData.company} 
                                                onChange={handleChange} 
                                                placeholder="Innovate Inc." 
                                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                            />
                                            <label htmlFor="company" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                                Company
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input 
                                                type="text" 
                                                id="location" 
                                                name="location" 
                                                value={formData.location} 
                                                onChange={handleChange} 
                                                placeholder="Remote, New York" 
                                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                            />
                                            <label htmlFor="location" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                                Location
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="relative">
                                        <FiFileText className="absolute left-4 top-5 text-slate-500" />
                                        <textarea 
                                            id="description" 
                                            name="description" 
                                            required 
                                            rows={10} 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            placeholder="Describe the role, responsibilities, requirements..." 
                                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                        />
                                        <label htmlFor="description" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                            Job Description *
                                        </label>
                                    </div>
                                    
                                    {/* Skills */}
                                    <div>
                                        <div className="relative">
                                            <FiStar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input 
                                                type="text" 
                                                id="skills" 
                                                name="skills" 
                                                value={formData.skills} 
                                                onChange={handleChange} 
                                                placeholder="JavaScript, React, Node.js..." 
                                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                            />
                                            <label htmlFor="skills" className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                                Required Skills
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">
                                            Enter skills separated by commas.
                                        </p>
                                        {skillsArray.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg">
                                                {skillsArray.map(skill => (
                                                    <SkillTag key={skill} skill={skill} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                            <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
                                disabled={loading || (formData.generateWithAi && !formData.aiPrompt.trim()) || (!formData.generateWithAi && (!formData.title.trim() || !formData.description.trim()))}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? (
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                ) : formData.generateWithAi ? (
                                    <FiZap className="w-5 h-5" />
                                ) : (
                                    <FiSave className="w-5 h-5" />
                                )}
                                {loading ? (
                                    formData.generateWithAi ? 'Generating...' : 'Creating...'
                                ) : formData.generateWithAi ? (
                                    'Generate & Create JD'
                                ) : (
                                    'Create & Save'
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
}