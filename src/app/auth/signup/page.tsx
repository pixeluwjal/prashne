'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser, verifyEmail } from '@/lib/api/auth';
import { FaUserTie, FaUserGraduate, FaSpinner, FaArrowLeft, FaCheck, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'form' | 'verify'>('role');
  const [role, setRole] = useState<'hr' | 'candidate' | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ username: false, email: false, password: false });

  const handleRoleSelect = (selectedRole: 'hr' | 'candidate') => {
    setRole(selectedRole);
    setStep('form');
  };

  const handleBack = () => setStep('role');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-100 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? <FaUserTie size={24} /> : i % 3 === 1 ? <FaUserGraduate size={24} /> : <FaUser size={24} />}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl w-full text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-2xl font-bold text-white">P</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Join Prashne
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Start your journey with us. First, tell us who you are.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {[
                  {
                    role: 'hr' as const,
                    icon: FaUserTie,
                    title: "I'm an HR Professional",
                    description: "I want to create interviews and hire top talent.",
                    gradient: "from-purple-500 to-blue-500",
                    features: ["Create Job Descriptions", "Manage Candidates", "Conduct Interviews"]
                  },
                  {
                    role: 'candidate' as const,
                    icon: FaUserGraduate,
                    title: "I'm a Candidate",
                    description: "I'm here to take interviews for potential jobs.",
                    gradient: "from-blue-500 to-cyan-500",
                    features: ["Take Interviews", "Showcase Skills", "Get Hired"]
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.role}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(item.role)}
                    className="relative group cursor-pointer"
                  >
                    <Card className="p-8 border-2 border-slate-200 dark:border-slate-700 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
                      <div className="text-center space-y-6">
                        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <item.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {item.features.map((feature, idx) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              className="flex items-center gap-3 text-slate-600 dark:text-slate-400"
                            >
                              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <FaCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${item.gradient} text-white rounded-xl font-semibold shadow-lg group-hover:shadow-xl transition-all`}
                        >
                          <span>Continue as {item.role === 'hr' ? 'HR' : 'Candidate'}</span>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full"
            >
              <Card className="p-8 border-0 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                <div className="relative mb-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBack}
                    className="absolute left-0 top-0 p-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FaArrowLeft />
                  </motion.button>
                  
                  <div className="space-y-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <FaUser className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Create Account
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      as a <span className="font-semibold text-slate-700 dark:text-slate-300">{role === 'hr' ? 'HR Professional' : 'Candidate'}</span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { name: 'username', label: 'Username', icon: FaUser, type: 'text' },
                    { name: 'email', label: 'Email Address', icon: FaEnvelope, type: 'email' },
                    { name: 'password', label: 'Password', icon: FaLock, type: 'password' },
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-3"
                    >
                      <Label htmlFor={field.name} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {field.label}
                      </Label>
                      <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                        <field.icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                          isFocused[field.name as keyof typeof isFocused] 
                            ? 'text-blue-500' 
                            : 'text-slate-400'
                        }`} />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus(field.name)}
                          onBlur={() => handleBlur(field.name)}
                          required
                          className={`pl-12 pr-4 h-14 text-lg transition-all duration-300 ${
                            isFocused[field.name as keyof typeof isFocused] 
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
                              : 'border-slate-300 dark:border-slate-600'
                          } bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border-2`}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      </motion.div>
                    </motion.div>
                  ))}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3"
                          >
                            <FaSpinner className="animate-spin" />
                            <span>Creating Account...</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <FaCheck />
                            Continue to Verification
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full"
            >
              <Card className="p-8 border-0 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <FaEnvelope className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-4 mb-8">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Verify Your Email
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold text-xl">
                    {formData.email}
                  </p>
                </div>

                <form onSubmit={handleVerification} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      name="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="text-center text-3xl tracking-[0.8em] font-mono h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      maxLength={6}
                      placeholder="000000"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3"
                          >
                            <FaSpinner className="animate-spin" />
                            <span>Verifying...</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <FaCheck />
                            Complete Registration
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-all duration-300"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </main>
  );
}