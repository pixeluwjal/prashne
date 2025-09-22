// src/components/ui/ProgressBar.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have this utility for conditional classes

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="flex justify-between items-center mb-10 w-full max-w-xl mx-auto">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ease-in-out",
                currentStep === index + 1
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : currentStep > index + 1
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "bg-gray-200 text-gray-500"
              )}
            >
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            <p className={cn(
              "mt-2 text-sm text-center transition-colors duration-300 ease-in-out",
              currentStep === index + 1 ? "text-blue-600 font-semibold" : "text-gray-500"
            )}>
              {labels[index]}
            </p>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "flex-1 h-1 bg-gray-200 transition-colors duration-300 ease-in-out mx-2",
                currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};