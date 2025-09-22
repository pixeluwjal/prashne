// components/landing/Hero.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// NEW: Imported FaCheckCircle icon
import { FaRobot, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

// You can add a particle background for a more dynamic feel.
// For example, using a library like `react-tsparticles`.
// For simplicity, this example focuses on CSS enhancements.

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 transform -skew-y-3 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-l from-blue-500/5 to-indigo-500/5 transform skew-y-3 translate-y-16"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className={`transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
              {/* ENHANCEMENT: Added a subtle glow and backdrop blur for a glassmorphism effect */}
              <Card className="p-4 shadow-lg border-0 bg-white/30 backdrop-blur-sm max-w-max rounded-full">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-md">
                    <FaRobot className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-blue-900 text-sm">AI-Powered Interview Platform</span>
                </div>
              </Card>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className={`inline-block transition-all duration-700 delay-200 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>Revolutionize Hiring</span>{' '}
              <span className={`inline-block transition-all duration-700 delay-400 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Interviewers</span>
              </span>
            </h1>

            <p className={`text-xl text-gray-600 max-w-2xl leading-relaxed transition-all duration-700 delay-600 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Automate screening, conduct natural conversations, and get deep insights into candidate potential — all while saving 70% of your hiring time.
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-800 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link href="/signup">
                {/* ENHANCEMENT: Added 'group' for hover effect on the arrow icon */}
                <Button size="lg" className="group text-lg px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Get Started Free 
                  {/* ENHANCEMENT: Arrow now moves on hover */}
                  <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
                  See Live Demo
                </Button>
              </Link>
            </div>
            
            <div className={`flex items-center gap-6 pt-8 text-gray-500 transition-opacity duration-700 delay-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
              {/* ENHANCEMENT: Replaced pulsing dots with clearer checkmark icons */}
              <div className="flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className={`flex-1 flex justify-center transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full max-w-lg aspect-square">
              {/* ENHANCEMENT: Added a subtle, glowing background element for the robot */}
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full"></div>
              <img
                src="/robot.svg"
                alt="AI Interviewer Robot Illustration"
                // ENHANCEMENT: Added the floating animation class
                className="relative w-full h-full object-contain animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}