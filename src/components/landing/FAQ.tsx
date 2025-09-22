// components/landing/FAQ.tsx
'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useInView } from '@/hooks/useInView';
import { FiHelpCircle } from 'react-icons/fi';

export function FAQ() {
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  const faqs = [
    {
      id: "item-1",
      question: "How does the AI evaluate candidate responses?",
      answer: "Our AI uses natural language processing and machine learning algorithms to analyze responses based on predefined rubrics. It evaluates technical accuracy, communication skills, and problem-solving approach, providing consistent scoring across all candidates."
    },
    {
      id: "item-2",
      question: "Can I customize the interview questions?",
      answer: "Yes, HR teams can fully customize question banks, create role-specific assessments, and set scoring criteria. You can also upload your own questions or modify existing ones to match your company's needs."
    },
    {
      id: "item-3",
      question: "How secure is the interview process?",
      answer: "We employ end-to-end encryption, secure link generation, and compliance with data protection regulations. All candidate data is stored securely, and interviews are conducted in a protected environment with anti-cheating measures."
    },
    {
      id: "item-4",
      question: "What types of roles is Prashne suitable for?",
      answer: "Prashne works for technical roles (developers, data scientists), business roles (sales, marketing), and leadership positions. Our question libraries cover diverse domains, and you can create custom assessments for specialized roles."
    },
    {
      id: "item-5",
      question: "How quickly can we get started with Prashne?",
      answer: "You can set up your first interview in under 15 minutes. Our onboarding process is streamlined, and we provide templates for common roles. Support is available to help customize the platform for your specific hiring needs."
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-white relative overflow-hidden" 
      id="faq"
    >
      {/* Subtle background dot pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        style={{ opacity: 0.5 }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Header */}
          <div className={`
            lg:col-span-1 transition-all duration-700
            ${isSectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
          `}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our AI interviewing platform.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className={`
            lg:col-span-2 transition-all duration-700 delay-200
            ${isSectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
          `}>
            {/* CORRECTED: Single Accordion parent component */}
            <Accordion type="multiple" className="w-full bg-white rounded-xl border border-gray-200/80 shadow-sm p-2">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id} 
                  className={`
                    border-b 
                    ${index === faqs.length - 1 ? 'border-b-0' : 'border-gray-200/80'}
                  `}
                >
                  <AccordionTrigger className="p-4 text-left font-semibold text-gray-800 hover:no-underline data-[state=open]:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* "Still have questions?" CTA Card */}
        <div className={`
          max-w-3xl mx-auto mt-20 text-center
          transition-all duration-700 delay-400
          ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <div className="p-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
            <FiHelpCircle className="w-10 h-10 mx-auto text-white/50 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-indigo-100 mb-6">
              Our team is here to help you get started and answer any questions you may have.
            </p>
            <a href="/contact" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition-transform duration-300 hover:scale-105">
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}