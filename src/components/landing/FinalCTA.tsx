// components/landing/FinalCTA.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import { FaArrowRight } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';

export function FinalCTA() {
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" 
      id="cta"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute -translate-x-[50%] -translate-y-[50%] w-[800px] h-[800px] bg-gradient-to-br from-blue-600/40 to-indigo-600/40 rounded-full blur-3xl animate-spin-slow"></div>
        <div className="absolute translate-x-[20%] translate-y-[20%] w-[600px] h-[600px] bg-gradient-to-tl from-pink-500/30 to-blue-500/30 rounded-full blur-3xl animate-spin-slow [animation-direction:reverse]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Glassmorphism Card */}
        <div className={`
          max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-lg border border-white/20 
          rounded-2xl shadow-2xl p-8 md:p-12
          transition-all duration-1000
          ${isSectionInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Revolutionize Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies using Prashne to make smarter, faster, and more equitable hiring decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              {/* Primary Button with Shimmer Effect */}
              <Button 
                size="lg" 
                className="group relative inline-flex items-center justify-center text-lg px-8 py-4 rounded-full shadow-lg overflow-hidden bg-white text-blue-700 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="absolute h-0 w-0 rounded-full bg-blue-100 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                <span className="relative flex items-center">
                  Get Started Free
                  <FaArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 rounded-full border-2 border-white/50 text-blue-700 hover:bg-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                Request a Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-blue-200 text-sm mt-8">
            <div className="flex items-center gap-2">
              <AiOutlineCheck />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <AiOutlineCheck />
              <span>Start in minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}