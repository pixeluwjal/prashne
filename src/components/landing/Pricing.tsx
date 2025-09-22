// components/landing/Pricing.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component from shadcn/ui
import { useInView } from '@/hooks/useInView';
import { AiOutlineCheck } from 'react-icons/ai';
import { cn } from '@/lib/utils'; // Assuming you have a utility for merging class names

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [sectionRef, isSectionInView] = useInView<HTMLElement>();

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with AI interviews.",
      price: { monthly: '$49', annually: '$42' },
      billing: { monthly: 'per month', annually: 'per year' },
      features: [ "Up to 10 interviews/mo", "Basic technical questions", "Standard scoring rubrics", "Email support" ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For growing teams that need advanced features and collaboration.",
      price: { monthly: '$99', annually: '$83' },
      billing: { monthly: 'per month', annually: 'per year' },
      features: [ "Up to 30 interviews/mo", "Advanced technical questions", "Custom scoring rubrics", "Behavioral assessments", "Team collaboration", "Priority support" ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For organizations with complex, high-volume hiring needs.",
      price: { monthly: 'Custom', annually: 'Custom' },
      billing: { monthly: 'Contact us', annually: '' },
      features: [ "Unlimited interviews", "Custom question banks", "Advanced analytics", "Dedicated account manager", "SSO & API access", "SLA guarantee" ],
      cta: "Contact Sales",
      popular: false,
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-gray-50" 
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-xl text-gray-600 transition-all duration-700 delay-200 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Choose the plan that's right for you. No hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className={`
          flex items-center justify-center gap-4 mb-12
          transition-all duration-700 delay-300
          ${isSectionInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}>
          <span className={`font-medium ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
            Monthly
          </span>
          <Switch
            checked={billingCycle === 'annually'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
            aria-label="Toggle billing cycle"
          />
          <span className={`font-medium ${billingCycle === 'annually' ? 'text-blue-600' : 'text-gray-500'}`}>
            Annually
          </span>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            Save 15%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <Card key={index} className={cn(
              `p-8 h-full border rounded-2xl transition-all duration-300 flex flex-col`,
              plan.popular 
                ? 'bg-slate-900 border-blue-600 shadow-2xl shadow-blue-500/10 transform lg:-translate-y-4' 
                : 'bg-white border-gray-200 shadow-sm hover:shadow-lg',
              `transition-all duration-700 delay-500 ${isSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
            )} style={{ transitionDelay: `${400 + index * 100}ms` }}>

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={cn("text-2xl font-bold mb-2", plan.popular ? "text-white" : "text-gray-900")}>
                  {plan.name}
                </h3>
                <p className={cn("mb-4", plan.popular ? "text-gray-400" : "text-gray-600")}>
                  {plan.description}
                </p>
                <div>
                  <span className={cn("text-4xl font-bold transition-all duration-300", plan.popular ? "text-white" : "text-gray-900")}>
                    {plan.price[billingCycle]}
                  </span>
                  {plan.billing[billingCycle] && (
                    <span className={cn("transition-all duration-300", plan.popular ? "text-gray-400" : "text-gray-600")}>
                      /{plan.billing[billingCycle]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-grow mb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <AiOutlineCheck className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className={cn(plan.popular ? "text-gray-300" : "text-gray-600")}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                <Button size="lg" className={cn(
                  'w-full text-lg',
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                )}>
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}