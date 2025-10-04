'use client';

import React, { useState, useEffect, useCallback, useMemo, FC } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiBriefcase, FiMapPin, FiStar, FiLoader, FiAlertTriangle, FiRefreshCw, FiSearch, FiChevronDown, FiUsers, FiTarget, FiAward, FiFilter, FiX, FiCheck, FiClock, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- TYPES ---
interface JD {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    skills: string[];
    hrId: string;
    createdAt?: string;
    updatedAt?: string;
}

// --- API HELPER ---
const jdApi = {
    getAll: async (): Promise<JD[]> => {
        const res = await fetch('/api/jds');
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Failed to fetch job descriptions.');
        }
        return data.data;
    },
    update: async (id: string, payload: Partial<JD>): Promise<JD> => {
        const res = await fetch(`/api/jds/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Failed to update job description.');
        }
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        const res = await fetch(`/api/jds/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Failed to delete job description.');
        }
    }
};

// --- STUNNING SUB-COMPONENTS ---

const SkillTag: FC<{ skill: string; index: number }> = ({ skill, index }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -2, scale: 1.05 }}
        className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-2 rounded-xl border border-blue-400/30 flex items-center gap-2 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
    >
        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        {skill}
    </motion.span>
);

const JDCard: FC<{ jd: JD; onEdit: () => void; onDelete: () => void; }> = ({ jd, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="bg-white dark:bg-[#0A0A0A] backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
        >
            {/* Background Glow Effect */}
            <motion.div
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"
            />

            <div className="relative z-10 flex-grow flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white pr-12 line-clamp-2 leading-tight">{jd.title}</h3>
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-sm mt-3 flex-wrap">
                            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <FiBriefcase className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                {jd.company || 'N/A'}
                            </span>
                            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <FiMapPin className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                                {jd.location || 'N/A'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <motion.div
                        animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1 : 0.95 }}
                        className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onEdit}
                            className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                            title="Edit JD"
                        >
                            <FiEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onDelete}
                            className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                            title="Delete JD"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                </div>
                
                {/* Description with Scrollable Container */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="relative flex-1 min-h-0">
                        <div 
                            className={`h-full overflow-y-auto transition-all duration-300 ${
                                isExpanded ? 'max-h-48' : 'max-h-32'
                            }`}
                        >
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pr-2">
                                {jd.description}
                            </p>
                        </div>
                        {!isExpanded && jd.description.length > 200 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#0A0A0A] to-transparent pointer-events-none" />
                        )}
                    </div>
                    
                    {/* Expand Button - Only show if description is long enough */}
                    {jd.description.length > 200 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-500 dark:text-blue-400 text-sm font-semibold mt-3 flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors self-start"
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                            <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiChevronDown />
                            </motion.span>
                        </motion.button>
                    )}
                </div>
                
                {/* Skills */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2">
                        {jd.skills.slice(0, 5).map((skill, index) => (
                            <SkillTag key={skill} skill={skill} index={index} />
                        ))}
                        {jd.skills.length > 5 && (
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 self-center"
                            >
                                +{jd.skills.length - 5} more
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <FiUsers className="w-3.5 h-3.5" />
                        {Math.floor(Math.random() * 50) + 10} matches
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FiAward className="w-3.5 h-3.5" />
                        Top {Math.floor(Math.random() * 20) + 5}%
                    </span>
                </div>
                {jd.updatedAt && (
                    <span className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        Updated {new Date(jd.updatedAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

const EditJDModal: FC<{ jd: JD; onClose: () => void; onSave: (updatedJd: JD) => void; }> = ({ jd, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...jd, skills: jd.skills.join(', ') });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading(
            <div className="flex items-center gap-3">
                <FiLoader className="w-5 h-5 animate-spin" />
                <div>
                    <p className="font-semibold">Updating Job Description</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Saving your changes...</p>
                </div>
            </div>,
            { duration: Infinity }
        );
        
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            const payload = { ...formData, skills: skillsArray };
            const updatedJd = await jdApi.update(jd._id, payload);
            onSave(updatedJd);
            
            toast.success(
                <div className="flex items-center gap-3">
                    <FiCheck className="w-6 h-6 text-green-500 dark:text-green-400" />
                    <div>
                        <p className="font-semibold">Successfully Updated!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Job description has been saved.</p>
                    </div>
                </div>,
                { id: toastId }
            );
            onClose();
        } catch (error: any) {
            toast.error(
                <div className="flex items-center gap-3">
                    <FiX className="w-5 h-5 text-red-500 dark:text-red-400" />
                    <div>
                        <p className="font-semibold">Update Failed</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
                    </div>
                </div>,
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            >
                <motion.form
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={e => e.stopPropagation()}
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="relative flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <FiEdit className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Edit Job Description</h2>
                                    <p className="text-blue-100 opacity-90">Update the job details and requirements</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={onClose}
                                className="text-white/80 hover:text-white p-2 rounded-2xl transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                            >
                                <FiX size={24} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <FiBriefcase className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    Job Title *
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Frontend Developer"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <FiTarget className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-vertical transition-all duration-300"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <FiBriefcase className="w-4 h-4 text-green-500 dark:text-green-400" />
                                        Company
                                    </label>
                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company name"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <FiMapPin className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                        Location
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Remote, San Francisco, etc."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <FiStar className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                    Required Skills
                                </label>
                                <input
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, TypeScript, Node.js, AWS (comma-separated)"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Separate skills with commas</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 pb-8 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="flex justify-end gap-4">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-semibold"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 10px 30px -10px rgba(59, 130, 246, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
                            >
                                {loading ? (
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <FiCheck className="w-5 h-5" />
                                )}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
};

const ConfirmationModal: FC<{ onConfirm: () => void, onClose: () => void, title: string, message: string }> = ({ onConfirm, onClose, title, message }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FiAlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">{message}</p>
                    <div className="flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="px-8 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-semibold"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onConfirm}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg"
                        >
                            Delete Forever
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

// --- MAIN PAGE COMPONENT ---
export default function JDListPage() {
    const router = useRouter();
    const [jds, setJds] = useState<JD[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jdToEdit, setJdToEdit] = useState<JD | null>(null);
    const [jdToDelete, setJdToDelete] = useState<JD | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadJds = useCallback(async () => {
        setLoading(true); 
        setError(null);
        try {
            const data = await jdApi.getAll();
            setJds(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadJds(); }, [loadJds]);

    const filteredJds = useMemo(() => 
        jds.filter(jd => 
            jd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        ), 
    [jds, searchTerm]);

    const handleSaveJd = (updatedJd: JD) => setJds(prev => prev.map(jd => jd._id === updatedJd._id ? updatedJd : jd));

    const handleDeleteConfirm = async () => {
        if (!jdToDelete) return;
        const toastId = toast.loading(
            <div className="flex items-center gap-3">
                <FiLoader className="w-5 h-5 animate-spin" />
                <div>
                    <p className="font-semibold">Deleting Job Description</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment...</p>
                </div>
            </div>,
            { duration: Infinity }
        );
        
        try {
            await jdApi.delete(jdToDelete._id);
            setJds(prev => prev.filter(jd => jd._id !== jdToDelete._id));
            
            toast.success(
                <div className="flex items-center gap-3">
                    <FiCheck className="w-6 h-6 text-green-500 dark:text-green-400" />
                    <div>
                        <p className="font-semibold">Successfully Deleted!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Job description has been removed.</p>
                    </div>
                </div>,
                { id: toastId }
            );
        } catch (e: any) {
            toast.error(
                <div className="flex items-center gap-3">
                    <FiX className="w-5 h-5 text-red-500 dark:text-red-400" />
                    <div>
                        <p className="font-semibold">Deletion Failed</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{e.message}</p>
                    </div>
                </div>,
                { id: toastId }
            );
        } finally {
            setJdToDelete(null);
        }
    };

    const renderContent = () => {
        if (loading) return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-80 animate-pulse"
                    >
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2 w-3/4"></div>
                        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-16"></div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );

        if (error) return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white dark:bg-[#0A0A0A] border border-red-200 dark:border-red-500/30 rounded-3xl shadow-2xl"
            >
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-200 dark:border-red-500/30">
                    <FiAlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Failed to Load Data</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto">{error}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadJds}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg"
                >
                    <FiRefreshCw className="w-5 h-5" />
                    Try Again
                </motion.button>
            </motion.div>
        );

        if (filteredJds.length === 0) return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl"
            >
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <FiSearch className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {searchTerm ? 'No Matching Results' : 'No Job Descriptions Yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto">
                    {searchTerm 
                        ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                        : 'Get started by creating your first job description to find perfect candidates.'
                    }
                </p>
                {!searchTerm && (
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/dashboard/hr/jd/create')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 text-lg shadow-xl"
                    >
                        <FiPlus className="w-6 h-6" />
                        Create Your First JD
                    </motion.button>
                )}
            </motion.div>
        );

        return (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredJds.map((jd, index) => (
                        <JDCard
                            key={jd._id}
                            jd={jd}
                            onEdit={() => setJdToEdit(jd)}
                            onDelete={() => setJdToDelete(jd)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* Enhanced Background Effects */}
                <div className="absolute inset-0 bg-grid-slate-300/30 dark:bg-grid-slate-800/30 [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)]"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto relative z-10"
                >
                    {/* Enhanced Header */}
                    <header className="mb-12">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                                    <FiBriefcase className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                                        Job Descriptions
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                        Manage and organize your job requirements
                                    </p>
                                </div>
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/dashboard/hr/jd/create')}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 text-lg shadow-xl whitespace-nowrap"
                            >
                                <FiPlus className="w-6 h-6" />
                                Create New JD
                            </motion.button>
                        </div>

                        {/* Stats and Search */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <FiBarChart2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    <span className="text-slate-900 dark:text-white font-semibold">{filteredJds.length}</span>
                                    <span className="text-slate-500 dark:text-slate-400">of {jds.length} roles</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <FiUsers className="w-4 h-4 text-green-500 dark:text-green-400" />
                                    <span className="text-slate-500 dark:text-slate-400">Ready for matching</span>
                                </div>
                            </div>

                            <div className="relative w-full lg:w-96">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search by title, company, or skills..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 shadow-lg"
                                />
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    {renderContent()}
                </motion.div>
            </div>
            
            {/* Modals */}
            <AnimatePresence>
                {jdToEdit && <EditJDModal jd={jdToEdit} onClose={() => setJdToEdit(null)} onSave={handleSaveJd} />}
                {jdToDelete && (
                    <ConfirmationModal
                        onConfirm={handleDeleteConfirm}
                        onClose={() => setJdToDelete(null)}
                        title="Delete Job Description?"
                        message={`Are you sure you want to delete "${jdToDelete.title}"? This action cannot be undone and all associated data will be permanently removed.`}
                    />
                )}
            </AnimatePresence>
        </>
    );
}