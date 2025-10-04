// src/app/dashboard/hr/resumes/page.tsx

"use client";

import React, { useState, useEffect, useCallback, FC, ReactNode, ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUpload, FiFileText, FiUsers, FiRefreshCw, FiAward, FiBriefcase } from "react-icons/fi";
import { Resume } from "../../../../components/types";
import { ResumeTable } from "../../../../components/ResumeTable";
import { ResumeDetailModal, ConfirmationModal, ResumeUploadModal } from "../../../../components/ResumeModals";
import ResumeEditorModal from "../../../../components/ResumeEditorModal";

const StatCard: FC<{ title: string; value: string | number; icon: ReactNode; gradient: string; }> = ({ title, value, icon, gradient }) => (
    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} whileHover={{ scale: 1.05, y: -4 }} className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className={`absolute -top-1/2 -right-1/2 h-[160%] w-[160%] bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-20 blur-3xl`} aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md shadow-slate-900/40`}>
                {React.cloneElement(icon as ReactElement, { className: "w-7 h-7 text-white" })}
            </div>
            <div className="text-left">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    </motion.div>
);

const StatsGrid: FC<{ resumes: Resume[] }> = ({ resumes }) => {
    const totalSkills = Array.from(new Set(resumes.flatMap(r => r.skills))).length;
    const totalExperience = resumes.reduce((total, r) => total + r.experience.length, 0);
    return (
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Resumes" value={resumes.length} icon={<FiFileText />} gradient="from-cyan-500 to-blue-500" />
            <StatCard title="Unique Candidates" value={resumes.length} icon={<FiUsers />} gradient="from-purple-500 to-indigo-500" />
            <StatCard title="Skills Found" value={totalSkills} icon={<FiAward />} gradient="from-amber-500 to-orange-500" />
            <StatCard title="Experience Entries" value={totalExperience} icon={<FiBriefcase />} gradient="from-teal-500 to-green-500" />
        </motion.div>
    );
};

export default function ResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [editorInitialData, setEditorInitialData] = useState<Resume | null>(null);
    const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
    const [confirmDelete, setConfirmDelete] = useState<{ ids: string[]; message: string; } | null>(null);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

    const loadResumes = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await fetch("/api/resumes");
            if (!response.ok) throw new Error("Failed to fetch resumes");
            const data = await response.json();
            setResumes(data.data);
        } catch (error) {
            toast.error("❌ Could not fetch resumes.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => { loadResumes(); }, [loadResumes]);

    const handleFileUpload = async (file: File) => {
        const uploadToast = toast.loading('Uploading and parsing resume...');
        try {
            const formData = new FormData();
            formData.append("resume", file);
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Upload failed");
            
            toast.success('✅ Resume parsed! Please review.', { id: uploadToast });
            const newResume = data.data;
            setIsUploadModalOpen(false);
            setEditorInitialData(newResume);
            setIsEditorModalOpen(true);
            return newResume;
        } catch (error: any) {
            toast.error(`❌ ${error.message}`, { id: uploadToast });
            throw error;
        }
    };
    
    const handleEditorSave = async (data: Resume) => {
        if (!data._id) throw new Error("Cannot save resume: ID is missing.");
        const response = await fetch(`/api/resumes/${data._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save edits');
        }
        const result = await response.json();
        const finalizedResume = result.data;
        
        setResumes((prev) => {
            const exists = prev.some(r => r._id === finalizedResume._id);
            if (exists) { return prev.map(r => r._id === finalizedResume._id ? finalizedResume : r); } 
            else { return [finalizedResume, ...prev]; }
        });
        setIsEditorModalOpen(false);
    };

    const handleOpenEditor = (resume: Resume) => {
        setEditorInitialData(resume);
        setIsEditorModalOpen(true);
    };

    const openDeleteConfirmation = (resume: Resume) => setConfirmDelete({ ids: [resume._id], message: `Are you sure you want to delete ${resume.fullName}'s resume?` });
    const openBulkDeleteConfirmation = () => { if (selectedResumes.size === 0) return; setConfirmDelete({ ids: Array.from(selectedResumes), message: `Are you sure you want to delete ${selectedResumes.size} selected resume(s)?` }); };

    const handleDeleteConfirmed = async () => {
        if (!confirmDelete) return;
        const deleteToast = toast.loading('Deleting resume(s)...');
        try {
            await Promise.all(confirmDelete.ids.map(id => fetch(`/api/resumes/${id}`, { method: "DELETE" }).then(res => { if (!res.ok) throw new Error('Deletion failed'); })));
            setResumes((prev) => prev.filter((resume) => !confirmDelete.ids.includes(resume._id)));
            setSelectedResumes(new Set());
            toast.success("🎉 Resume(s) deleted!", { id: deleteToast });
        } catch (error) {
            toast.error("❌ Failed to delete.", { id: deleteToast });
        } finally {
            setConfirmDelete(null);
        }
    };

    const handleSelectResume = (resumeId: string) => {
        const newSelected = new Set(selectedResumes);
        newSelected.has(resumeId) ? newSelected.delete(resumeId) : newSelected.add(resumeId);
        setSelectedResumes(newSelected);
    };
    
    const filteredResumes = resumes.filter(r =>
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.experience.some(exp => exp.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSelectAll = () => {
        if (selectedResumes.size === filteredResumes.length) { setSelectedResumes(new Set()); } 
        else { setSelectedResumes(new Set(filteredResumes.map((r) => r._id))); }
    };

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-200 font-sans relative overflow-hidden">
                <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/3 w-[1200px] h-[1200px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl opacity-40" aria-hidden="true" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/3 w-[1200px] h-[1200px] bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-full blur-3xl opacity-40" aria-hidden="true" />

                <main className="max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Resume Intelligence Hub</h1>
                                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Manage, search, and analyze all your parsed candidate data in one place.</p>
                            </div>
                            <div className="flex gap-3 w-full lg:w-auto">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={() => loadResumes()} 
                                    className="p-3 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/80 transition-all duration-200 shadow-md"
                                >
                                    <FiRefreshCw className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={() => setIsUploadModalOpen(true)} 
                                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                                >
                                    <FiUpload className="w-5 h-5" /> Upload Resume
                                </motion.button>
                            </div>
                        </div>
                    </motion.header>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loader" exit={{ opacity: 0 }}><SkeletonLoader /></motion.div>
                        ) : (
                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <StatsGrid resumes={resumes} />
                                <ResumeTable
                                    resumes={resumes} 
                                    searchTerm={searchTerm} 
                                    setSearchTerm={setSearchTerm}
                                    selectedResumes={selectedResumes} 
                                    handleSelectResume={handleSelectResume} 
                                    handleSelectAll={handleSelectAll}
                                    openBulkDeleteConfirmation={openBulkDeleteConfirmation} 
                                    setSelectedResume={setSelectedResume}
                                    openDeleteConfirmation={openDeleteConfirmation} 
                                    filteredResumes={filteredResumes}
                                    setIsUploadModalOpen={setIsUploadModalOpen} 
                                    openEditor={handleOpenEditor}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <ResumeUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleFileUpload} />
            <ResumeDetailModal resume={selectedResume} onClose={() => setSelectedResume(null)} />
            <ConfirmationModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDeleteConfirmed} title="Delete Resume(s)" message={confirmDelete?.message || ""} />
            <AnimatePresence>
                {isEditorModalOpen && (
                    <ResumeEditorModal 
                        isOpen={isEditorModalOpen} 
                        onClose={() => setIsEditorModalOpen(false)} 
                        onSave={handleEditorSave} 
                        initialData={editorInitialData}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

const SkeletonLoader = () => (
    <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-200/50 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700 rounded-2xl h-[160px]"></div>
            ))}
        </div>
        <div className="bg-slate-200/50 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700 rounded-2xl p-5">
            <div className="h-12 bg-slate-300/50 dark:bg-slate-700/50 rounded-lg mb-5"></div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-300/50 dark:bg-slate-700/50 rounded-xl"></div>
                ))}
            </div>
        </div>
    </div>
);