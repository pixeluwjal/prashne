// app/dashboard/hr/settings/page.tsx
import { SettingsForm } from '@/components/dashboard/hr/Settings/SettingsForm';
import { NotificationSettings } from '@/components/dashboard/hr/Settings/NotificationSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SettingsForm />
      <NotificationSettings />
    </div>
  );
}