// src/app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'oklch(0.205 0 0)',
                  color: 'oklch(0.985 0 0)',
                  borderRadius: 'var(--radius)',
                },
                success: {
                  style: {
                    background: 'oklch(0.398 0.07 227.392)',
                  },
                },
                error: {
                  style: {
                    background: 'oklch(0.577 0.245 27.325)',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}