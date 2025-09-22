import { EmailForm } from "@/components/candidate/EmailForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JoinInterviewPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Prashne</CardTitle>
          <CardDescription>AI Interview Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailForm />
        </CardContent>
      </Card>
    </main>
  );
}