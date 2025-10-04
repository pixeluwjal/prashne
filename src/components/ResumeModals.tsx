// src/components/ResumeModals.tsx

'use client';

import React, { FC, ReactNode, useState, ReactElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiAlertTriangle, FiLoader, FiUploadCloud, FiFile, FiAlertCircle, FiDownload, FiMail, FiPhone, FiAward, FiBriefcase, FiBookOpen, FiCalendar, FiStar, FiUser, FiMapPin, FiClock, FiCheck, FiShield } from 'react-icons/fi';
import { Resume, Experience, Education } from './types';

// --- SUB-COMPONENTS FOR DETAIL MODAL ---

const SkillTag: FC<{ skill: string; index: number }> = ({ skill, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 + 0.5 }}
    whileHover={{ y: -3, scale: 1.05, boxShadow: "0 8px 25px -8px rgba(59, 130, 246, 0.4)" }}
    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-blue-600 dark:text-blue-300 border border-blue-400/30 backdrop-blur-sm cursor-default shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl sm:rounded-2xl"
  >
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2 sm:mr-3 shadow-sm"></div>
    {skill}
  </motion.span>
);

const TimelineCard: FC<{ 
  title: string; 
  subtitle: string; 
  badgeText: string | number; 
  icon: ReactNode; 
  gradient: string;
  index: number;
}> = ({ title, subtitle, badgeText, icon, gradient, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 100 }}
    className="relative pl-8 sm:pl-12 py-2 group"
  >
    {/* Enhanced Timeline Line */}
    <div className="absolute top-6 -left-1 w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-purple-500/50 group-last:via-transparent group-last:to-transparent"></div>
    
    {/* Enhanced Timeline Dot */}
    <div className={`absolute top-6 -left-2 sm:-left-3 w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${gradient} shadow-lg border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform duration-300`}>
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
    </div>

    {/* Enhanced Card */}
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/80 dark:bg-slate-800/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2">{title}</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">{subtitle}</p>
        </div>
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold bg-slate-100/50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-slate-300/50 dark:border-slate-600/50 sm:ml-4 flex-shrink-0 w-fit"
        >
          {icon}
          <span className="ml-1 sm:ml-2">{badgeText}</span>
        </motion.span>
      </div>
    </motion.div>
  </motion.div>
);

const InfoCard: FC<{ icon: ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    className="flex flex-col p-3 sm:p-4 md:p-5 bg-white/50 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${color} bg-opacity-20 border ${color.replace('text', 'border')} border-opacity-30`}>
        {React.cloneElement(icon as ReactElement, { className: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" })}
      </div>
      <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</span>
    </div>
    <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base md:text-lg truncate">{value}</p>
  </motion.div>
);

// --- MODAL DEFINITIONS ---

export const ResumeDetailModal: FC<{ resume: Resume | null; onClose: () => void }> = ({ resume, onClose }) => {
  if (!resume) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden mx-2 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full -translate-y-16 sm:-translate-y-24 translate-x-16 sm:translate-x-24 md:translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-12 sm:translate-y-20 -translate-x-12 sm:-translate-x-20"></div>
            
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-sm">
                    <FiUser className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 sm:border-4 border-white dark:border-slate-900 shadow-lg">
                    <FiStar className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-slate-900" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 truncate">{resume.fullName}</h2>
                  <p className="text-blue-100 text-sm sm:text-base md:text-lg opacity-90 truncate">
                    {resume.experience[0]?.role || 'Professional Candidate'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm self-end sm:self-start"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </motion.button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-[calc(95vh-180px)]">
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-12">
              {/* Contact Information Grid */}
              <section>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg sm:rounded-xl">
                    <FiUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <InfoCard 
                    icon={<FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400"/>} 
                    label="Email" 
                    value={resume.email}
                    color="text-blue-500 dark:text-blue-400"
                  />
                  <InfoCard 
                    icon={<FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400"/>} 
                    label="Phone" 
                    value={resume.phone}
                    color="text-green-500 dark:text-green-400"
                  />
                  <motion.a 
                    href={resume.originalFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl sm:rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group col-span-1 sm:col-span-2 lg:col-span-1"
                  >
                    <FiDownload className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 dark:text-blue-400 group-hover:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-300 font-bold text-sm sm:text-base md:text-lg group-hover:text-blue-500 dark:group-hover:text-blue-200 text-center">
                      Download Original
                    </span>
                  </motion.a>
                </div>
              </section>

              {/* Skills & Competencies */}
              <section>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg sm:rounded-xl">
                    <FiAward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500 dark:text-orange-400" />
                  </div>
                  Skills & Competencies
                </h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {resume.skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} index={index} />
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Work Experience */}
              <section>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg sm:rounded-xl">
                    <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  Work Experience
                </h3>
                {resume.experience.length > 0 ? (
                  <div className="relative space-y-1 sm:space-y-2">
                    {resume.experience.map((exp, index) => (
                      <TimelineCard 
                        key={index}
                        title={exp.role}
                        subtitle={exp.company}
                        badgeText={`${exp.years} years`}
                        icon={<FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                        gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-6 md:p-8 text-center bg-slate-100/50 dark:bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <FiBriefcase className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg">No work experience details extracted</p>
                  </motion.div>
                )}
              </section>

              {/* Education */}
              <section>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg sm:rounded-xl">
                    <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 dark:text-green-400" />
                  </div>
                  Education
                </h3>
                {resume.education.length > 0 ? (
                  <div className="relative space-y-1 sm:space-y-2">
                    {resume.education.map((edu, index) => (
                      <TimelineCard 
                        key={index}
                        title={edu.degree}
                        subtitle={edu.college}
                        badgeText={edu.year}
                        icon={<FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                        gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-6 md:p-8 text-center bg-slate-100/50 dark:bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <FiBookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg">No education details extracted</p>
                  </motion.div>
                )}
              </section>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ConfirmationModal: FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string;
  type?: 'delete' | 'warning' | 'info';
}> = ({ isOpen, onClose, onConfirm, title, message, type = 'delete' }) => {
  const getModalConfig = () => {
    switch (type) {
      case 'delete':
        return {
          icon: <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />,
          gradient: "from-red-500 to-orange-600",
          buttonColor: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700",
          iconBg: "bg-red-500/20 border-red-500/30"
        };
      case 'warning':
        return {
          icon: <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
          gradient: "from-yellow-500 to-amber-600",
          buttonColor: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700",
          iconBg: "bg-yellow-500/20 border-yellow-500/30"
        };
      default:
        return {
          icon: <FiShield className="w-5 h-5 sm:w-6 sm:h-6" />,
          gradient: "from-blue-500 to-cyan-600",
          buttonColor: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
          iconBg: "bg-blue-500/20 border-blue-500/30"
        };
    }
  };

  const config = getModalConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 overflow-hidden"
          >
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg mx-auto sm:mx-0`}>
                  {config.icon}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">{message}</p>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={onClose}
                  className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700 rounded-xl sm:rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-lg order-2 sm:order-1"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.5)" }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={onConfirm}
                  className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl ${config.buttonColor} order-1 sm:order-2`}
                >
                  Confirm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ResumeUploadModal: FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onUpload: (file: File) => Promise<Resume> 
}> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetState = () => { setFile(null); setIsUploading(false); setError(null); };
  const handleClose = () => { resetState(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    setIsUploading(true); setError(null);
    try {
      await onUpload(file);
      setTimeout(handleClose, 500);
    } catch (err: any) {
      setError(err.message);
      toast.error(`❌ Upload failed: ${err.message}`);
      setIsUploading(false);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) { 
        setError('Please select a PDF or DOCX file'); 
        return; 
      }
      if (selectedFile.size > 5 * 1024 * 1024) { 
        setError('File size must be less than 5MB'); 
        return; 
      }
      setFile(selectedFile); 
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsDragging(isEntering); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsDragging(false); 
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4" onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden mx-2 sm:mx-4" onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header */}
            <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-white/5 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 md:translate-x-24"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-10 sm:translate-y-14 -translate-x-10 sm:-translate-x-14"></div>
              
              <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                    <FiUploadCloud className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Upload Resume</h2>
                    <p className="text-blue-100 text-sm sm:text-base md:text-lg opacity-90">AI-powered resume parsing</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={handleClose}
                  className="text-white/80 hover:text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm self-end sm:self-auto"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {/* Enhanced Drag & Drop Area */}
                <motion.div
                  onDragEnter={(e) => handleDrag(e, true)} 
                  onDragLeave={(e) => handleDrag(e, false)} 
                  onDragOver={(e) => handleDrag(e, true)} 
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.02 }}
                  className={`relative border-2 sm:border-3 border-dashed rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-center transition-all duration-500 backdrop-blur-sm ${
                    isDragging 
                      ? 'border-purple-500 bg-purple-500/10 scale-105 ring-4 sm:ring-8 ring-purple-500/20 shadow-2xl' 
                      : 'border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/30 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 shadow-xl'
                  }`}
                >
                  <motion.div
                    animate={isDragging ? { y: [0, -8, 0] } : {}}
                    transition={{ duration: 1, repeat: isDragging ? Infinity : 0 }}
                  >
                    <FiUploadCloud className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 md:mb-6 transition-colors duration-300 ${
                      isDragging ? 'text-purple-500' : 'text-slate-400 dark:text-slate-500'
                    }`} />
                  </motion.div>
                  
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-2 sm:mb-3 font-semibold">
                    <label htmlFor="file-upload" className="font-bold text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 cursor-pointer transition-colors duration-300 underline decoration-2 underline-offset-4">
                      Click to upload
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept=".pdf,.doc,.docx" />
                    <span className="mx-1 sm:mx-2">or drag and drop</span>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg font-medium">PDF or DOCX (MAX. 5MB)</p>
                  
                  {file && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="mt-4 sm:mt-6 md:mt-8 bg-white/80 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-700/50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm sm:text-base shadow-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg sm:rounded-xl border border-green-500/30">
                          <FiFile className="text-green-500 dark:text-green-400 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base md:text-lg block truncate">{file.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <motion.button 
                        type="button" 
                        onClick={() => setFile(null)} 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-slate-500 dark:text-slate-500 hover:text-red-500 transition-colors duration-300 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-500/10 self-end sm:self-auto"
                      >
                        <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-sm sm:text-base bg-red-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-500/20 backdrop-blur-sm"
                  >
                    <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <span className="text-red-600 dark:text-red-300 font-medium">{error}</span>
                  </motion.div>
                )}
              </div>

              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
                <motion.button
                  whileHover={{ scale: file && !isUploading ? 1.03 : 1, boxShadow: file && !isUploading ? "0 20px 40px -10px rgba(99, 102, 241, 0.4)" : "none" }}
                  whileTap={{ scale: 0.97 }}
                  type="submit" 
                  disabled={isUploading || !file}
                  className="w-full flex justify-center items-center gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg md:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  {isUploading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {isUploading ? (
                      <FiLoader className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <FiUpload className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                    {isUploading ? 'AI Parsing Resume...' : 'Upload & Parse with AI'}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};