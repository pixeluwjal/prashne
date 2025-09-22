'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { format } from 'date-fns';
import { getInterviews } from '@/lib/api/hr';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Search } from 'lucide-react';
import { FiCopy, FiEye, FiClock, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

// The fetcher function for SWR, which calls our API service function
const fetcher = () => getInterviews();

export function UpcomingInterviewsTable() {
  const { data, error, isLoading } = useSWR('/api/hr/interviews', fetcher);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // useMemo will re-calculate the filtered interviews only when the data or filters change
  const filteredInterviews = useMemo(() => {
    if (!data?.interviews) return [];
    
    return data.interviews.filter((interview: any) => {
      const statusMatch = filterStatus === 'all' || interview.status === filterStatus;
      const searchMatch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [data, filterStatus, searchTerm]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Interview link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'expired': return <Badge variant="destructive">Expired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Management</CardTitle>
        <CardDescription>Search, filter, and manage all your interviews.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search by candidate name..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead className="hidden sm:table-cell">Job Title</TableHead>
                <TableHead className="hidden md:table-cell">Expires At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && error && (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-red-500">Failed to load interviews.</TableCell></TableRow>
              )}
              {!isLoading && !error && filteredInterviews.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center h-24">No interviews match your filters.</TableCell></TableRow>
              )}
              {!isLoading && !error && filteredInterviews.map((interview: any) => (
                <TableRow key={interview._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${interview.candidateName.replace(' ', '+')}`} />
                        <AvatarFallback>{interview.candidateName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{interview.candidateName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{interview.jobTitle}</TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(interview.expiresAt), 'PPp')}</TableCell>
                  <TableCell>{getStatusBadge(interview.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem onSelect={() => handleCopyLink(interview.interviewLink)}>
                                <FiCopy className="mr-2 h-4 w-4" /> Copy Link
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{interview.interviewLink}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DropdownMenuItem>
                          <FiEye className="mr-2 h-4 w-4" /> View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FiClock className="mr-2 h-4 w-4" /> Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          <FiTrash2 className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}