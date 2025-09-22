'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function SettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal and company information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://ui-avatars.com/api/?name=HR+Manager&background=4f46e5&color=fff" />
              <AvatarFallback>HR</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <Input type="file" className="max-w-xs"/>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="HR Manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="hr@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="Prashne Inc." />
            </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}