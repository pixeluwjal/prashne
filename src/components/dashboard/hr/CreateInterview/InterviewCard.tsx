// components/dashboard/hr/CreateInterview/InterviewCard.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface InterviewCardProps {
  candidateName: string;
  jobTitle: string;
  status: 'Scheduled' | 'Draft';
}

export function InterviewCard({ candidateName, jobTitle, status }: InterviewCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{jobTitle}</CardTitle>
          <Badge variant={status === 'Scheduled' ? 'default' : 'outline'}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${candidateName.replace(' ', '+')}`} />
            <AvatarFallback>{getInitials(candidateName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800">{candidateName}</p>
            <p className="text-sm text-gray-500">Awaiting Interview</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon">
          <FiEdit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}