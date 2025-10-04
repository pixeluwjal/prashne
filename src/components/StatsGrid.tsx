// StatsGrid.tsx

import React, { FC, ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiUsers, FiAward, FiBriefcase } from "react-icons/fi";

// --- FRAMER MOTION VARIANTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Controls the delay between each card animating in
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
    },
  },
};

// --- TYPES & SUB-COMPONENT (StatCard) ---

const StatCard: FC<{
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string; // e.g., "from-cyan-500 to-blue-500"
  trend?: string;
}> = ({ title, value, icon, gradient, trend }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg border border-white/10"
    >
      {/* Decorative Gradient Glow on Hover */}
      <div
        className={`absolute -top-1/2 -right-1/2 h-[160%] w-[160%] bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-20 blur-3xl`}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Icon */}
        <div
          className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md shadow-gray-900/40`}
        >
          {/* Ensure icon passed is a ReactElement to add classes */}
          {React.cloneElement(icon as ReactElement, {
            className: "w-7 h-7 text-white",
          })}
        </div>

        {/* Text Content */}
        <div className="text-left">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="flex items-baseline gap-3 mt-1">
            <p className="text-4xl font-extrabold text-white">{value}</p>
            {trend && (
              <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/20">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

interface StatsGridProps {
  resumes: Resume[];
}

export const StatsGrid: FC<StatsGridProps> = ({ resumes }) => {
  const totalSkills = Array.from(
    new Set(resumes.flatMap((r) => r.skills))
  ).length;

  const totalExperience = resumes.reduce(
    (total, r) => total + r.experience.length,
    0
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
    >
      <StatCard
        title="Total Resumes"
        value={resumes.length}
        icon={<FiFileText />}
        gradient="from-cyan-500 to-blue-500"
        trend="+12%"
      />
      <StatCard
        title="Unique Candidates"
        value={resumes.length}
        icon={<FiUsers />}
        gradient="from-purple-500 to-indigo-500"
      />
      <StatCard
        title="Skills Found"
        value={totalSkills}
        icon={<FiAward />}
        gradient="from-amber-500 to-orange-500"
      />
      <StatCard
        title="Experience Entries"
        value={totalExperience}
        icon={<FiBriefcase />}
        gradient="from-teal-500 to-green-500"
      />
    </motion.div>
  );
};