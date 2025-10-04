// src/components/ResumeTable.tsx

'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiSquare, FiEye, FiDownload, FiTrash2, FiMail, FiPhone, FiSearch, FiFileText, FiUpload, FiEdit, FiStar, FiUser, FiCalendar, FiAward } from 'react-icons/fi';
import { Resume } from './types';

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const SkillChip: FC<{ skill: string }> = ({ skill }) => (
    <motion.span 
        whileHover={{ scale: 1.05 }}
        className="inline-block px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm"
    >
        {skill}
    </motion.span>
);

interface ResumeTableProps {
    resumes: Resume[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedResumes: Set<string>;
    handleSelectResume: (id: string) => void;
    handleSelectAll: () => void;
    openBulkDeleteConfirmation: () => void;
    setSelectedResume: (resume: Resume | null) => void;
    openDeleteConfirmation: (resume: Resume) => void;
    filteredResumes: Resume[];
    setIsUploadModalOpen: (isOpen: boolean) => void;
    openEditor: (resume: Resume) => void;
}

export const ResumeTable: FC<ResumeTableProps> = ({
    resumes, searchTerm, setSearchTerm, selectedResumes, handleSelectAll,
    handleSelectResume, openBulkDeleteConfirmation, setSelectedResume,
    openDeleteConfirmation, filteredResumes, setIsUploadModalOpen, openEditor,
}) => {
    const isAllSelected = selectedResumes.size === filteredResumes.length && filteredResumes.length > 0;
    const handleClearSelection = () => selectedResumes.forEach(id => handleSelectResume(id));

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Enhanced Header */}
            <div className="p-6 bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-900/80 border-b border-slate-300/50 dark:border-slate-700/50">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Resume Library
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                {filteredResumes.length} {filteredResumes.length === 1 ? 'resume' : 'resumes'} found
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none lg:w-80">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search by name, skills, or role..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            {selectedResumes.size > 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 px-4 py-3 rounded-xl border border-red-500/30 backdrop-blur-sm"
                                >
                                    <span className="font-semibold text-red-600 dark:text-red-300">{selectedResumes.size} selected</span>
                                    <div className="flex items-center gap-3">
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={openBulkDeleteConfirmation} 
                                            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" /> 
                                            Delete All
                                        </motion.button>
                                        <button 
                                            onClick={handleClearSelection}
                                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button 
                                    whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)" }} 
                                    whileTap={{ scale: 0.97 }} 
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                                >
                                    <FiUpload className="w-5 h-5" /> 
                                    Upload Resume
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-100/40 dark:bg-slate-800/40 backdrop-blur-sm border-b border-slate-300/50 dark:border-slate-700/50">
                        <tr>
                            <th scope="col" className="pl-6 pr-4 py-4 w-12">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSelectAll} 
                                    className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                >
                                    {isAllSelected ? 
                                        <FiCheckSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" /> : 
                                        <FiSquare className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    }
                                </motion.button>
                            </th>
                            <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[280px]">
                                <div className="flex items-center gap-2">
                                    <FiUser className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    Candidate Profile
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[200px] hidden xl:table-cell">
                                <div className="flex items-center gap-2">
                                    <FiMail className="w-4 h-4 text-green-500 dark:text-green-400" />
                                    Contact Info
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[300px] hidden lg:table-cell">
                                <div className="flex items-center gap-2">
                                    <FiAward className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                    Key Skills
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[140px]">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                    Uploaded
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-right w-48">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300/30 dark:divide-slate-800/30">
                        {filteredResumes.map((resume, index) => (
                            <motion.tr 
                                key={resume._id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                whileHover={{ backgroundColor: "rgba(148, 163, 184, 0.1) dark:rgba(30, 41, 59, 0.5)" }}
                                className={`transition-all duration-300 ${
                                    selectedResumes.has(resume._id) ? 
                                    'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-l-blue-500 dark:border-l-blue-400' : 
                                    'border-l-4 border-l-transparent'
                                }`}
                            >
                                {/* Selection Checkbox */}
                                <td className="pl-6 pr-4 py-6">
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleSelectResume(resume._id)} 
                                        className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                    >
                                        {selectedResumes.has(resume._id) ? 
                                            <FiCheckSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" /> : 
                                            <FiSquare className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                        }
                                    </motion.button>
                                </td>

                                {/* Candidate Profile */}
                                <td className="px-4 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <FiUser className="w-6 h-6 text-white" />
                                            </div>
                                            {resume.experience.length > 0 && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                                    <FiStar className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{resume.fullName}</h3>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm">
                                                {resume.experience[0]?.role || 'No role specified'}
                                            </p>
                                            {resume.experience[0]?.company && (
                                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                                                    {resume.experience[0].company}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Info */}
                                <td className="px-4 py-6 hidden xl:table-cell">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                <FiMail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium truncate max-w-[180px]">
                                                {resume.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 group">
                                            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                <FiPhone className="w-4 h-4 text-green-500 dark:text-green-400" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                                                {resume.phone}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Skills */}
                                <td className="px-4 py-6 hidden lg:table-cell">
                                    <div className="flex flex-wrap gap-2 max-w-[280px]">
                                        {resume.skills.slice(0, 4).map((skill, i) => (
                                            <SkillChip key={i} skill={skill} />
                                        ))}
                                        {resume.skills.length > 4 && (
                                            <span className="inline-flex items-center px-3 py-1.5 text-xs bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-full border border-slate-400 dark:border-slate-600">
                                                +{resume.skills.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Upload Info */}
                                <td className="px-4 py-6">
                                    <div className="space-y-1">
                                        <div className="text-slate-900 dark:text-white font-semibold text-sm">
                                            {formatDate(resume.createdAt)}
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                                            {formatFileSize(resume.fileSize)}
                                        </div>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-end gap-1">
                                        {[
                                            { 
                                                icon: <FiEye className="w-4 h-4" />, 
                                                title: "View Details", 
                                                onClick: () => setSelectedResume(resume), 
                                                color: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                                            },
                                            { 
                                                icon: <FiEdit className="w-4 h-4" />, 
                                                title: "Edit Resume", 
                                                onClick: () => openEditor(resume), 
                                                color: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300",
                                            },
                                            { 
                                                icon: <FiDownload className="w-4 h-4" />, 
                                                title: "Download", 
                                                onClick: () => window.open(resume.originalFileUrl, '_blank'), 
                                                color: "bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300",
                                            },
                                            { 
                                                icon: <FiTrash2 className="w-4 h-4" />, 
                                                title: "Delete", 
                                                onClick: () => openDeleteConfirmation(resume), 
                                                color: "bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                                            }
                                        ].map((action, index) => (
                                            <motion.button
                                                key={action.title}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + 0.3 }}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={action.onClick}
                                                className={`p-3 rounded-xl transition-all duration-300 ${action.color} backdrop-blur-sm border border-transparent hover:border-current/30`}
                                                title={action.title}
                                            >
                                                {action.icon}
                                            </motion.button>
                                        ))}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredResumes.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 px-6"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center border border-slate-300/50 dark:border-slate-700/50">
                            <FiFileText className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            {searchTerm ? 'No matching resumes' : 'No resumes yet'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                            {searchTerm ? 
                                'Try adjusting your search terms or filters to find what you\'re looking for.' : 
                                'Start building your resume library by uploading your first resume.'
                            }
                        </p>
                        {!searchTerm && (
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsUploadModalOpen(true)}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 text-lg shadow-2xl shadow-blue-500/25"
                            >
                                <FiUpload className="w-6 h-6" />
                                Upload Your First Resume
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Add missing FiX component
const FiX: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className={className}>
        <path d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);