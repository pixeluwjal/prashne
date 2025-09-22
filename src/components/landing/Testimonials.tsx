// components/landing/Testimonials.tsx
'use client';

import { Card } from '@/components/ui/card';
import { useInView } from '@/hooks/useInView';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import Image from 'next/image';

// Define a type for our testimonial items
type Testimonial = {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl: string; // Using a URL for dynamic avatars
};

export function Testimonials() {
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Head of Talent Acquisition",
      company: "TechNova Inc.",
      content: "Prashne has completely transformed our hiring process. We've reduced time-to-hire by 40% and our hiring managers absolutely love the detailed, unbiased candidate reports. It's an indispensable tool for us now.",
      rating: 5,
      // Dynamic avatar generated from name
      avatarUrl: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4f46e5&color=fff&bold=true",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      company: "StartUpGrid",
      content: "The AI's technical questioning is impressively adaptive and deep. It feels like having another senior engineer on the interview panel, but one that's available 24/7. The quality of our technical hires has noticeably improved.",
      rating: 5,
      avatarUrl: "https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff&bold=true",
    },
    {
      name: "Priya Sharma",
      role: "HR Director",
      company: "GlobalSoft",
      content: "The bias reduction features were a huge selling point, and they've delivered. The structured scoring eliminates 'gut-feeling' decisions and has directly contributed to building a more diverse and qualified team.",
      rating: 5,
      avatarUrl: "https://ui-avatars.com/api/?name=Priya+Sharma&background=db2777&color=fff&bold=true",
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-gray-50" 
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">World-Class</span> Teams
          </h2>
          <p className={`text-xl text-gray-600 transition-all duration-700 delay-200 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            See why forward-thinking companies are choosing Prashne to revolutionize their hiring.
          </p>
        </div>

        {/* Staggered Grid Container */}
        <div className={`
          [column-count:1] md:[column-count:2] lg:[column-count:3] gap-8 space-y-8
          transition-all duration-700 delay-400
          ${isSectionInView ? 'opacity-100' : 'opacity-0'}
        `}>
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              // The 'break-inside-avoid' class prevents cards from splitting across columns
              className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 break-inside-avoid relative"
            >
              <FaQuoteRight className="absolute top-6 right-6 w-10 h-10 text-gray-100" />
              <div className="flex flex-col h-full relative z-10">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center">
                  <Image 
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}, <span className="font-medium text-blue-600">{testimonial.company}</span></p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}