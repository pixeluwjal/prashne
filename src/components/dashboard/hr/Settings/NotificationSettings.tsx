'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function NotificationSettings() {
  const settings = [
    { id: 'interview-completed', label: 'Interview Completed', description: 'Get an email when a candidate finishes their interview.' },
    { id: 'report-ready', label: 'Report Ready', description: 'Notify me when the AI-generated report is available for review.' },
    { id: 'weekly-summary', label: 'Weekly Summary', description: 'Receive a summary of hiring activities every Monday.' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications from Prashne.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={setting.id} className="text-base">{setting.label}</Label>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <Switch id={setting.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}