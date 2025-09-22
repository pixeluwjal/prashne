'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser, verifyEmail } from '@/lib/api/auth';
import { FaUserTie, FaUserGraduate, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'form' | 'verify'>('role');
  const [role, setRole] = useState<'hr' | 'candidate' | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: 'hr' | 'candidate') => {
    setRole(selectedRole);
    setStep('form');
  };

  const handleBack = () => setStep('role');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = registerUser({ ...formData, role });

    toast.promise(promise, {
      loading: 'Creating your account...',
      success: () => {
        setStep('verify');
        return 'Verification code sent! Please check your email.';
      },
      error: (err: any) => err.message,
      finally: () => setIsLoading(false),
    });
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = verifyEmail({ email: formData.email, code: verificationCode });

    toast.promise(promise, {
      loading: 'Verifying your code...',
      success: (data) => {
        router.push('/auth/login');
        return data.message;
      },
      error: (err: any) => err.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full">
        {step === 'role' && (
          <div className="text-center animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Prashne</h1>
            <p className="text-lg text-gray-600 mb-8">First, tell us who you are.</p>
            <div className="space-y-6">
              <Card onClick={() => handleRoleSelect('hr')} className="p-8 border-2 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer text-left">
                <div className="flex items-center gap-6">
                  <FaUserTie className="w-10 h-10 text-blue-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">I'm an HR Professional</h2>
                    <p className="text-gray-500">I want to create interviews and hire top talent.</p>
                  </div>
                </div>
              </Card>
              <Card onClick={() => handleRoleSelect('candidate')} className="p-8 border-2 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer text-left">
                <div className="flex items-center gap-6">
                  <FaUserGraduate className="w-10 h-10 text-blue-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">I'm a Candidate</h2>
                    <p className="text-gray-500">I'm here to take an interview for a potential job.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {step === 'form' && (
          <Card className="p-8 border-0 shadow-xl rounded-2xl animate-in fade-in duration-500">
            <div className="relative mb-6 text-center">
              <button onClick={handleBack} className="absolute left-0 top-1 text-gray-500 hover:text-gray-800 transition-colors">
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-gray-500">as a {role === 'hr' ? 'HR Professional' : 'Candidate'}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Continue'}
              </Button>
            </form>
          </Card>
        )}

        {step === 'verify' && (
           <Card className="p-8 border-0 shadow-xl rounded-2xl text-center animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
            <p className="text-gray-500 mb-6">Enter the 6-digit code sent to {formData.email}.</p>
            <form onSubmit={handleVerification} className="space-y-4">
              <Input
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-center text-2xl tracking-[0.8em] font-mono"
                maxLength={6}
                required
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                 {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Verify & Complete'}
              </Button>
            </form>
          </Card>
        )}
        
        <p className="mt-8 text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}