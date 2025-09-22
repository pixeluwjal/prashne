'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { getInterviews } from '@/lib/api/hr';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// The fetcher function for SWR, which calls our API service function
const fetcher = () => getInterviews();

export function PastInterviewsTable() {
  const { data, error, isLoading } = useSWR('/api/hr/interviews', fetcher);

  // Filter for interviews that are completed or expired to show in the "past" list
  const pastInterviews = useMemo(() => {
    if (!data?.interviews) return [];
    return data.interviews.filter(
      (interview: any) => interview.status === 'completed' || interview.status === 'expired'
    );
  }, [data]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Interviews</CardTitle>
        <CardDescription>A complete history of all interviews conducted.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Completed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
              </TableRow>
            ))}

            {!isLoading && error && (
              <TableRow><TableCell colSpan={4} className="text-center h-24 text-red-500">Failed to load interviews.</TableCell></TableRow>
            )}

            {!isLoading && !error && pastInterviews.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center h-24">No completed interviews found.</TableCell></TableRow>
            )}
            
            {!isLoading && !error && pastInterviews.map((interview: any) => (
              <TableRow key={interview._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="hidden sm:flex">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${interview.candidateName.replace(' ', '+')}`} />
                      <AvatarFallback>{interview.candidateName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {/* This link should go to a detailed report page */}
                    <Link href={`/dashboard/hr/reports/${interview._id}`} className="hover:underline">
                      {interview.candidateName}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{interview.jobTitle}</TableCell>
                <TableCell>{format(new Date(interview.updatedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge variant={interview.status === 'completed' ? 'secondary' : 'destructive'} className="capitalize">
                    {interview.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}