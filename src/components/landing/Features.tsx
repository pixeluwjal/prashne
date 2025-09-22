// components/landing/Features.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { AiOutlineSchedule, AiOutlineFileText } from 'react-icons/ai';
import { FaRobot, FaLock } from 'react-icons/fa';
import { useInView } from '@/hooks/useInView'; // NEW: Import the custom hook

export function Features() {
  // NEW: Set up the hook to observe the section
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  const features = [
    {
      icon: <AiOutlineSchedule className="w-8 h-8 text-blue-800" />,
      title: 'Automated Scheduling',
      description: 'HR can schedule interviews in seconds. Candidates receive secure links automatically.',
    },
    {
      icon: <FaRobot className="w-8 h-8 text-blue-800" />,
      title: 'AI-Powered Interviewing',
      description: 'Our AI asks technical and behavioral questions, with adaptive follow-ups based on responses.',
    },
    {
      icon: <AiOutlineFileText className="w-8 h-8 text-blue-800" />,
      title: 'Instant Reports',
      description: 'Get structured candidate reports immediately after interviews with detailed scoring rubrics.',
    },
    {
      icon: <FaLock className="w-8 h-8 text-blue-800" />,
      title: 'Secure & Scalable',
      description: 'Enterprise-grade security with unlimited scalability for companies of all sizes.',
    },
  ];

  return (
    // NEW: Add ref to the section
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* ENHANCEMENT: Added animation and gradient text */}
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Powerful Features for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Modern Hiring
            </span>
          </h2>
          <p className={`text-xl text-gray-600 transition-all duration-700 delay-200 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Everything you need to streamline your hiring process with AI-powered interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Increased gap for more breathing room */}
          {features.map((feature, index) => (
            <Card
              key={index}
              // ENHANCEMENT: Added staggered animation, group for hover effects, and improved styling
              className={`
                p-6 h-full border rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 
                bg-white transition-all duration-300 hover:-translate-y-2 group
                ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              // ENHANCEMENT: Added dynamic transition delay for staggering effect
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center h-full">
                {/* ENHANCEMENT: Gradient background for the icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}