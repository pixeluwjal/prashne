"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { FiCpu } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "../ui/UserNav";

export function Navbar() {
  const { user, isLoading, logout } = useAuth(); // Get user, loading state, and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
  ];

  // Effect for scroll detection and scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
      let currentSection = "";
      navLinks.forEach((link) => {
        const sectionId = link.href.split('#')[1];
        if (!sectionId) return;
        const section = document.getElementById(sectionId) as HTMLElement;
        if (section && section.offsetTop <= window.scrollY + 100) {
          currentSection = link.href;
        }
      });
      setActiveLink(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white",
        hasScrolled ? "shadow-md" : "shadow-none"
      )}
    >
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50"></div>

      <nav className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Prashne</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "font-medium transition-all duration-300 px-4 py-1.5 rounded-full",
                  activeLink === link.href
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <UserNav />
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 w-10 h-10 flex flex-col justify-center items-center rounded-md focus:outline-none z-20 relative text-gray-800"
              aria-label="Toggle menu"
            >
              <span className={cn("block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out", isMenuOpen ? "rotate-45 translate-y-[5px]" : "")}></span>
              <span className={cn("block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out my-1", isMenuOpen ? "opacity-0" : "opacity-100")}></span>
              <span className={cn("block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out", isMenuOpen ? "-rotate-45 -translate-y-[5px]" : "")}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 font-medium py-2 text-lg hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
            {user ? (
               <div className="flex items-center justify-between w-full">
                <Link href={user.role === 'hr' ? '/dashboard/hr' : '/dashboard/candidate'} onClick={() => setIsMenuOpen(false)}>
                  <p className="font-semibold text-gray-800">Hi, {user.username}</p>
                </Link>
                <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }}>
                  Log Out
                </Button>
               </div>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-lg py-3 rounded-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full text-lg py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}