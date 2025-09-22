// src/components/dashboard/hr/OverviewCards.tsx
'use client';

import useSWR from 'swr';
import { getAnalytics } from '@/lib/api/hr';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'; // Import the new component
import { AiOutlineClockCircle, AiOutlineSchedule, AiOutlineFileText } from 'react-icons/ai';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

const fetcher = () => getAnalytics();

export function OverviewCards() {
  const { data, error, isLoading } = useSWR('/api/hr/analytics', fetcher);

  // Updated structure with only 3 cards and added color properties for the glow effect
  const cardMetrics = [
    { key: 'totalInterviews', title: 'Total Interviews', icon: AiOutlineClockCircle, color: 'blue' },
    { key: 'pendingInterviews', title: 'Pending Interviews', icon: AiOutlineSchedule, color: 'yellow' },
    { key: 'completedInterviews', title: 'Completed Interviews', icon: AiOutlineFileText, color: 'green' },
  ];
  
  const colorClasses = {
    blue: 'hover:shadow-blue-500/20 hover:border-blue-500',
    yellow: 'hover:shadow-yellow-500/20 hover:border-yellow-500',
    green: 'hover:shadow-green-500/20 hover:border-green-500',
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6"><Skeleton className="h-28 w-full" /></Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 col-span-full">Failed to load overview data.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardMetrics.map((item) => (
        <Card key={item.key} className={cn(
          "p-6 transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-2 border-transparent",
          "bg-gradient-to-br from-white via-white to-gray-50",
          "shadow-sm hover:shadow-2xl",
          colorClasses[item.color as keyof typeof colorClasses]
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <item.icon className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-700">{item.title}</h3>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            {/* Use the AnimatedNumber component */}
            <AnimatedNumber value={data ? data[item.key as keyof typeof data] : 0} />
            <div className="w-24 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyTrend}>
                  <Line type="monotone" dataKey="completed" stroke="#818cf8" strokeWidth={2.5} dot={false} />
                  <Tooltip 
                    cursor={{ stroke: '#a5b4fc', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2 bg-white rounded-md shadow-lg border">
                            <p className="text-sm">{`${payload[0].payload.month}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}