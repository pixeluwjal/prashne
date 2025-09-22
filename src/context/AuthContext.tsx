// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logoutUser } from '@/lib/api/auth';
import { FaSpinner } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'hr' | 'candidate';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for an active session when the app loads
  const checkUserSession = useCallback(async () => {
    try {
      const { user: sessionUser } = await getMe();
      setUser(sessionUser || null);
    } catch (error) {
      setUser(null); // No valid session
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/'); // Redirect to homepage
  };

  // Show a global loader while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};