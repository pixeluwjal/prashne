// components/dashboard/hr/PastInterviews/PastInterviewCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PastInterviewCardProps {
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  status: 'Hired' | 'Rejected' | 'Offer Extended';
}

export function PastInterviewCard({ candidateName, jobTitle, interviewDate, status }: PastInterviewCardProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Offer Extended': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={`https://ui-avatars.com/api/?name=${candidateName.replace(' ', '+')}&background=EBF4FF&color=4299E1`} />
          <AvatarFallback>{candidateName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">
            <Link href="#" className="hover:underline">{candidateName}</Link>
          </CardTitle>
          <CardDescription>{jobTitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex justify-between items-center bg-gray-50/70">
        <p className="text-sm text-gray-500">Interviewed on {interviewDate}</p>
        <Badge className={cn("font-semibold", getStatusClasses(status))}>{status}</Badge>
      </CardContent>
    </Card>
  );
}