// src/components/ResumeTable.tsx

'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiSquare, FiEye, FiTrash2, FiMail, FiPhone, FiSearch, FiFileText, FiUpload, FiEdit, FiStar, FiUser, FiCalendar, FiAward, FiBriefcase } from 'react-icons/fi';
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
        className="inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm"
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
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-300/50 dark:border-slate-700/50 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Enhanced Header */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-900/80 border-b border-slate-300/50 dark:border-slate-700/50">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                                    <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        Resume Library
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
                                        {filteredResumes.length} {filteredResumes.length === 1 ? 'resume' : 'resumes'} found
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                                <div className="relative flex-1 lg:flex-none lg:w-80">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name, skills, or role..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white/60 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-600/50 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-slate-900 dark:text-white text-sm sm:text-base placeholder-slate-500 dark:placeholder-slate-400"
                                    />
                                </div>
                                
                                <div className="flex gap-2 sm:gap-3">
                                    {selectedResumes.size > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }} 
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-red-500/30 backdrop-blur-sm"
                                        >
                                            <span className="font-semibold text-red-600 dark:text-red-300 text-xs sm:text-sm">{selectedResumes.size} selected</span>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={openBulkDeleteConfirmation} 
                                                    className="flex items-center gap-1 sm:gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors text-xs sm:text-sm"
                                                >
                                                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" /> 
                                                    Delete
                                                </motion.button>
                                                <button 
                                                    onClick={handleClearSelection}
                                                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                                >
                                                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Table */}
                    <div className="overflow-x-auto">
                        {/* Mobile Cards */}
                        <div className="block lg:hidden">
                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                {filteredResumes.map((resume, index) => (
                                    <motion.div
                                        key={resume._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-white/50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border backdrop-blur-sm transition-all duration-300 ${
                                            selectedResumes.has(resume._id) ? 
                                            'border-blue-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 
                                            'border-slate-300/50 dark:border-slate-600/50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleSelectResume(resume._id)} 
                                                    className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                                >
                                                    {selectedResumes.has(resume._id) ? 
                                                        <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" /> : 
                                                        <FiSquare className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                                                    }
                                                </motion.button>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1">{resume.fullName}</h3>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                        {resume.experience[0]?.role || 'No role specified'}
                                                    </p>
                                                </div>
                                            </div>
                                            {resume.experience.length > 0 && (
                                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                                    <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 dark:text-yellow-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Info - Mobile */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                                    <FiMail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" />
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm truncate">
                                                    {resume.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-green-500/20 rounded-lg">
                                                    <FiPhone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                                                    {resume.phone}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom Section */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-300/30 dark:border-slate-600/50">
                                            <div className="text-slate-500 dark:text-slate-400 text-xs">
                                                {formatDate(resume.createdAt)} • {formatFileSize(resume.fileSize)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[
                                                    { 
                                                        icon: <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />, 
                                                        title: "View Details", 
                                                        onClick: () => setSelectedResume(resume), 
                                                        color: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                                                    },
                                                    { 
                                                        icon: <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />, 
                                                        title: "Edit", 
                                                        onClick: () => openEditor(resume), 
                                                        color: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300",
                                                    },
                                                    { 
                                                        icon: <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />, 
                                                        title: "Delete", 
                                                        onClick: () => openDeleteConfirmation(resume), 
                                                        color: "bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                                                    }
                                                ].map((action, index) => (
                                                    <motion.button
                                                        key={action.title}
                                                        whileHover={{ scale: 1.1, y: -1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={action.onClick}
                                                        className={`p-2 rounded-lg transition-all duration-300 ${action.color} backdrop-blur-sm border border-transparent hover:border-current/30`}
                                                        title={action.title}
                                                    >
                                                        {action.icon}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <table className="w-full hidden lg:table">
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
                                    <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                            Candidate
                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <FiBriefcase className="w-4 h-4 text-green-500 dark:text-green-400" />
                                            Role & Company
                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                            <FiMail className="w-4 h-4 text-green-500 dark:text-green-400" />
                                            Contact Info
                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-left min-w-[120px]">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                            Uploaded
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wide text-right w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300/30 dark:divide-slate-700/30">
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

                                        {/* Candidate Name */}
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{resume.fullName}</h3>
                                                    {resume.experience.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <FiStar className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
                                                            <span className="text-slate-500 dark:text-slate-400 text-xs">Experienced</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role & Company */}
                                        <td className="px-4 py-6">
                                            <div className="space-y-1">
                                                <p className="text-slate-900 dark:text-white font-medium text-sm">
                                                    {resume.experience[0]?.role || 'No role specified'}
                                                </p>
                                                {resume.experience[0]?.company && (
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                                                        {resume.experience[0].company}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Contact Info */}
                                        <td className="px-4 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <FiMail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                                    <span className="text-slate-700 dark:text-slate-300 text-sm truncate max-w-[160px]">
                                                        {resume.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiPhone className="w-4 h-4 text-green-500 dark:text-green-400" />
                                                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                                                        {resume.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Upload Info */}
                                        <td className="px-4 py-6">
                                            <div className="space-y-1">
                                                <div className="text-slate-900 dark:text-white font-semibold text-sm">
                                                    {formatDate(resume.createdAt)}
                                                </div>
                                                <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
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
                                className="text-center py-16 sm:py-20 px-6"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-slate-300/50 dark:border-slate-700/50">
                                    <FiFileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                                    {searchTerm ? 'No matching resumes' : 'No resumes yet'}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                                    {searchTerm ? 
                                        'Try adjusting your search terms to find what you\'re looking for.' : 
                                        'Your resume library is currently empty.'
                                    }
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
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