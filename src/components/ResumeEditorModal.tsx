// src/components/ResumeEditorModal.tsx

'use client';

import React, { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Resume } from './types';
import { FiSave, FiX, FiPlus, FiTrash2, FiLoader, FiEdit3 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditorInput: FC<{ 
    label: string, 
    name: string, 
    value: string, 
    placeholder?: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}> = ({ label, ...props }) => (
    <div className="relative">
        <input 
            {...props} 
            className="w-full p-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-white transition-colors duration-200" 
        />
        <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 font-medium">
            {label}
        </label>
    </div>
);

interface ResumeEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Resume) => Promise<void>;
    initialData: Resume | null;
}

const ResumeEditorModal: FC<ResumeEditorModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(JSON.parse(JSON.stringify(initialData)));
        }
    }, [initialData]);

    if (!isOpen || !formData) return null;

    const handleFieldChange = (field: keyof Resume, value: any) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleDynamicListChange = (list: 'experience' | 'education' | 'skills', index: number, field: string, value: string) => {
        const newList = [...formData[list]];
        if (list === 'skills') {
            newList[index] = value;
        } else {
            (newList[index] as any)[field] = value;
        }
        handleFieldChange(list, newList);
    };

    const addDynamicListItem = (list: 'experience' | 'education' | 'skills') => {
        let newItem;
        if (list === 'experience') newItem = { role: '', company: '', years: '' };
        else if (list === 'education') newItem = { degree: '', college: '', year: '' };
        else newItem = '';
        handleFieldChange(list, [...formData[list], newItem]);
    };
    
    const removeDynamicListItem = (list: 'experience' | 'education' | 'skills', index: number) => {
        const newList = formData[list].filter((_, i) => i !== index);
        handleFieldChange(list, newList);
    };

    const handleSave = async () => {
        setLoading(true);
        const saveToast = toast.loading('Saving resume data...');
        try {
            await onSave(formData);
            toast.success('🎉 Resume saved successfully!', { id: saveToast });
            onClose();
        } catch (error: any) {
            toast.error(`❌ Save failed: ${error.message}`, { id: saveToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <header className="p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <FiEdit3 className="text-blue-500 dark:text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Resume</h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Review and update your resume information</p>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(148, 163, 184, 0.3)' }} 
                                whileTap={{ scale: 0.9 }} 
                                onClick={onClose}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </motion.button>
                        </header>
                        
                        {/* Main Content */}
                        <main className="flex-grow p-6 space-y-8 overflow-y-auto">
                            {/* Personal Information */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <EditorInput 
                                        label="Full Name" 
                                        name="fullName" 
                                        value={formData.fullName} 
                                        onChange={(e) => handleFieldChange('fullName', e.target.value)} 
                                        placeholder="e.g. John Doe" 
                                    />
                                    <EditorInput 
                                        label="Email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={(e) => handleFieldChange('email', e.target.value)} 
                                        placeholder="e.g. john.doe@email.com" 
                                    />
                                    <EditorInput 
                                        label="Phone" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={(e) => handleFieldChange('phone', e.target.value)} 
                                        placeholder="e.g. 9876543210" 
                                    />
                                </div>
                            </section>
                            
                            {/* Skills */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Skills
                                </h3>
                                <div className="space-y-3">
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input 
                                                value={skill} 
                                                onChange={e => handleDynamicListChange('skills', index, '', e.target.value)} 
                                                placeholder="e.g. JavaScript, React, Node.js"
                                                className="flex-grow p-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-white transition-colors duration-200"
                                            />
                                            <motion.button 
                                                type="button" 
                                                onClick={() => removeDynamicListItem('skills', index)} 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-3 text-red-500 dark:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <FiTrash2/>
                                            </motion.button>
                                        </div>
                                    ))}
                                    <motion.button 
                                        type="button" 
                                        onClick={() => addDynamicListItem('skills')} 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                    >
                                        <FiPlus/> Add Skill
                                    </motion.button>
                                </div>
                            </section>

                            {/* Experience */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Experience
                                </h3>
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border border-slate-300/50 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="md:col-span-3">
                                            <EditorInput 
                                                label="Role" 
                                                name="role" 
                                                value={exp.role} 
                                                onChange={e => handleDynamicListChange('experience', index, 'role', e.target.value)} 
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <EditorInput 
                                                label="Company" 
                                                name="company" 
                                                value={exp.company} 
                                                onChange={e => handleDynamicListChange('experience', index, 'company', e.target.value)} 
                                                placeholder="e.g. Google"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <EditorInput 
                                                label="Years" 
                                                name="years" 
                                                value={exp.years} 
                                                onChange={e => handleDynamicListChange('experience', index, 'years', e.target.value)} 
                                                placeholder="e.g. 3"
                                            />
                                        </div>
                                        <motion.button 
                                            type="button" 
                                            onClick={() => removeDynamicListItem('experience', index)} 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-3 text-red-500 dark:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors self-center"
                                        >
                                            <FiTrash2/>
                                        </motion.button>
                                    </div>
                                ))}
                                <motion.button 
                                    type="button" 
                                    onClick={() => addDynamicListItem('experience')} 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                >
                                    <FiPlus/> Add Experience
                                </motion.button>
                            </section>
                            
                            {/* Education */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    Education
                                </h3>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border border-slate-300/50 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="md:col-span-3">
                                            <EditorInput 
                                                label="Degree" 
                                                name="degree" 
                                                value={edu.degree} 
                                                onChange={e => handleDynamicListChange('education', index, 'degree', e.target.value)} 
                                                placeholder="e.g. B.Tech in CSE"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <EditorInput 
                                                label="College" 
                                                name="college" 
                                                value={edu.college} 
                                                onChange={e => handleDynamicListChange('education', index, 'college', e.target.value)} 
                                                placeholder="e.g. IIT Bombay"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <EditorInput 
                                                label="Year" 
                                                name="year" 
                                                value={edu.year} 
                                                onChange={e => handleDynamicListChange('education', index, 'year', e.target.value)} 
                                                placeholder="e.g. 2022"
                                            />
                                        </div>
                                        <motion.button 
                                            type="button" 
                                            onClick={() => removeDynamicListItem('education', index)} 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-3 text-red-500 dark:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors self-center"
                                        >
                                            <FiTrash2/>
                                        </motion.button>
                                    </div>
                                ))}
                                <motion.button 
                                    type="button" 
                                    onClick={() => addDynamicListItem('education')} 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300 transition-colors p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                >
                                    <FiPlus/> Add Education
                                </motion.button>
                            </section>
                        </main>

                        {/* Footer */}
                        <footer className="p-6 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 rounded-b-2xl">
                            <motion.button 
                                type="button" 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                onClick={onClose} 
                                className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-300/50 dark:border-slate-600 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                type="button" 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                onClick={handleSave} 
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/25"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                {loading ? 'Saving...' : 'Save & Finalize'}
                            </motion.button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResumeEditorModal;