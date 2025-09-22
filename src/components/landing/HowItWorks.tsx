// components/landing/HowItWorks.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView'; // Assuming useInView hook from previous step
import { 
  AiOutlineSchedule, 
  AiOutlineMail, 
  AiOutlineFileText 
} from 'react-icons/ai';
import { FaRobot, FaArrowRight } from 'react-icons/fa';

export function HowItWorks() {
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  const steps = [
    {
      icon: <AiOutlineSchedule className="w-10 h-10" />,
      title: "1. Schedule Interview",
      description: "HR creates an interview, selects questions, and sets availability. The system generates a secure, unique link."
    },
    {
      icon: <AiOutlineMail className="w-10 h-10" />,
      title: "2. Candidate Gets Link",
      description: "The candidate receives an email with their interview link. No downloads or installations are required."
    },
    {
      icon: <FaRobot className="w-10 h-10" />,
      title: "3. AI Conducts Interview",
      description: "Our AI asks tailored questions, adapts follow-ups, and scores answers in real-time for unbiased evaluation."
    },
    {
      icon: <AiOutlineFileText className="w-10 h-10" />,
      title: "4. Receive Instant Report",
      description: "Get a detailed report with scores, transcripts, and key insights immediately after the interview concludes."
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-white" 
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Prashne</span> Works
          </h2>
          <p className={`text-xl text-gray-600 transition-all duration-700 delay-200 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            A simple, streamlined, and effective 4-step process.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200/70 transform -translate-y-1/2"></div>
          {/* Connecting Line (Mobile) */}
          <div className="lg:hidden absolute top-0 left-12 w-0.5 h-full bg-blue-200/70 transform -translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-16 lg:gap-x-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute top-0 left-12 lg:left-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full transform -translate-x-1/2 lg:-translate-y-1/2 z-10"></div>

                <Card className="p-6 h-full border rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 bg-white transition-all duration-300 hover:-translate-y-2 group ml-24 lg:ml-0">
                  <div className="flex flex-col items-start h-full">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-md mb-6 transition-transform duration-300 group-hover:scale-110">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-20">
            <Button 
                size="lg" 
                className={`
                    group text-lg px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                    transition-all duration-500 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2
                    ${isSectionInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}
                style={{ transitionDelay: '1000ms' }}
            >
                See Full Demo
                <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
        </div>
      </div>
    </section>
  );
}