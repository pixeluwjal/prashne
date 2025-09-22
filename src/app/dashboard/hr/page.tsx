// app/dashboard/hr/page.tsx
import { OverviewCards } from '@/components/dashboard/hr/OverviewCards';
import { UpcomingInterviewsTable } from '@/components/dashboard/hr/UpcomingInterviewsTable';

export default function HRDashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <OverviewCards />
      <UpcomingInterviewsTable />
    </div>
  );
}