// components/landing/Benefits.tsx
'use client';

import { useInView } from '@/hooks/useInView';
import { 
  FaClock, 
  FaBalanceScale, 
  FaChartLine 
} from 'react-icons/fa';
import { AiOutlineBarChart } from 'react-icons/ai';
import { ReactNode } from 'react';

type Benefit = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function Benefits() {
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  // FIXED: Reverted to a simple, reliable solid color for the icons.
  const benefits: Benefit[] = [
    {
      icon: <FaClock className="w-8 h-8 text-blue-600" />,
      title: 'Save Critical Time',
      description: 'Reduce administrative overhead by 70%. Our automated system handles scheduling and logistics so you can focus on qualified candidates.'
    },
    {
      icon: <FaBalanceScale className="w-8 h-8 text-blue-600" />,
      title: 'Eliminate Hiring Bias',
      description: 'Ensure a fair and consistent process with standardized AI evaluation, minimizing unconscious bias for truly merit-based decisions.'
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: 'Scale Your Hiring Fast',
      description: 'Effortlessly handle any volume of interviews simultaneously. Our platform scales with your needs without compromising the candidate experience.'
    },
    {
      icon: <AiOutlineBarChart className="w-8 h-8 text-blue-600" />,
      title: 'Make Data-Driven Decisions',
      description: 'Move beyond gut feelings. Use detailed analytics and objective performance metrics to compare candidates and build a stronger team.'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      // REVERTED: Switched back to a light theme background.
      className="py-16 md:py-24 bg-gray-50" 
      id="benefits"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* REVERTED: Updated text colors for light theme. */}
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            An Unfair Advantage in Hiring
          </h2>
          <p className={`text-xl text-gray-600 transition-all duration-700 delay-200 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Transform your process with benefits that drive real-world results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`
                group flex items-start gap-6
                transition-all duration-700
                ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* UPDATED: Icon container styled for the light theme. */}
              <div className="
                flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center
                bg-white border border-gray-200 shadow-sm
                transition-all duration-300
                group-hover:bg-blue-50 group-hover:scale-110 group-hover:rotate-6 group-hover:border-blue-300
              ">
                {benefit.icon}
              </div>

              <div>
                {/* REVERTED: Updated text colors for light theme. */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}