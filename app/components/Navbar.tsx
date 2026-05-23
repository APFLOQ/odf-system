"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  isMember: boolean;
  isAdmin: boolean;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/education", label: "Education" },
  { href: "/glossary", label: "Glossary" },
  { href: "/brain", label: "Brain" },
];

const dailyInsights = [
  "Discipline is doing the boring thing when your emotions scream for action.",
  "Master the auction before you master the trade.",
  "Volume reveals what price cannot.",
  "Your edge is fragile. Your mind protects it.",
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % dailyInsights.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(16, 16, 16, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="relative max-w-[1500px] mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="ODF Home">
            <div className="relative w-8 h-8 transition-transform duration-500 ease-out group-hover:scale-105">
              <img
                src="/favicon.svg"
                alt="ODF Logo"
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight hidden sm:block">ODF</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-full p-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-1.5 text-[13px] font-medium tracking-[-0.005em] rounded-full transition-all duration-300"
                style={{
                  color: pathname === link.href ? "#F3F3F3" : "#949494",
                  background: pathname === link.href ? "rgba(255, 255, 255, 0.06)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Search + User */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "#949494",
              }}
              aria-label="Search"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[12px] font-medium">Search</span>
              <span className="ml-2 flex items-center gap-0.5">
                <kbd className="flex items-center justify-center w-5 h-5 rounded-[5px] bg-white/[0.04] border border-white/[0.06] text-[9px] font-mono text-[#949494]">
                  ⌘
                </kbd>
                <kbd className="flex items-center justify-center w-5 h-5 rounded-[5px] bg-white/[0.04] border border-white/[0.06] text-[9px] font-mono text-[#949494]">
                  K
                </kbd>
              </span>
            </button>

            {/* User Avatar with Click Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/[0.1] hover:border-white/[0.2] transition-all focus:outline-none"
                  aria-label="Account menu"
                >
                  <img
                    src={user.avatar || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </button>
                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-xl z-[9999]"
                      style={{
                        background: "rgba(16, 16, 16, 0.98)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={user.avatar || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-[14px] font-medium text-white">{user.username}</p>
                            {user.email && (
                              <p className="text-[12px] text-[#949494]">{user.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-white/[0.06] pt-3 space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-3 py-2 text-[13px] text-[#949494] hover:text-white rounded-lg hover:bg-white/[0.03] transition-all"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/education"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-3 py-2 text-[13px] text-[#949494] hover:text-white rounded-lg hover:bg-white/[0.03] transition-all"
                          >
                            Education
                          </Link>
                          <a
                            href="/api/auth/logout"
                            className="block px-3 py-2 text-[13px] text-[#f87171] hover:text-[#ef4444] rounded-lg hover:bg-white/[0.03] transition-all"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/api/auth/login"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <svg className="w-4 h-4 text-[#949494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg transition-all duration-200 gap-[5px]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span className="block w-4 h-px bg-white/60" />
              <span className="block w-4 h-px bg-white/60" />
              <span className="block w-3 h-px bg-white/60 self-end mr-[6px]" />
            </button>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="border-t border-white/[0.06]" style={{ background: "rgba(16, 16, 16, 0.5)" }}>
          <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-9 flex items-center justify-center">
            <div className="flex items-center gap-3 leading-none">
              <span className="inline-flex items-center gap-2 shrink-0 leading-none">
                <span className="relative inline-block w-1.5 h-1.5 translate-y-[1px]">
                  <span className="absolute inset-0 rounded-full bg-[#8052ff] opacity-60 animate-ping" style={{ animationDuration: "3s" }} />
                  <span className="relative block w-1.5 h-1.5 rounded-full bg-[#8052ff]" />
                </span>
                <span className="font-mono text-[10px] text-[#8052ff] tracking-[0.22em] uppercase font-semibold leading-none">
                  Daily Insight
                </span>
              </span>
              <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-white/[0.08]" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentInsight}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[12px] text-[#949494] hidden sm:block tracking-[-0.005em] leading-none"
                >
                  {dailyInsights[currentInsight]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
            style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-[600px] mx-4 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(16, 16, 16, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
                <svg className="w-5 h-5 text-[#949494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search modules, topics, glossary..."
                  className="flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[#6d6d6d]"
                  autoFocus
                />
                <kbd className="flex items-center justify-center px-2 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-[#949494]">
                  ESC
                </kbd>
              </div>
              <div className="px-4 py-3">
                <p className="text-[11px] text-[#6d6d6d] uppercase tracking-wider mb-2">Quick Links</p>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-[#949494] hover:text-white hover:bg-white/[0.03] transition-all"
                    >
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-72 border-l border-white/[0.06]"
              style={{
                background: "rgba(16, 16, 16, 0.95)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <span className="font-primary font-bold text-[14px] tracking-[-0.01em] text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 text-[#949494]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col px-3 py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 text-[#949494] hover:text-white hover:bg-white/[0.03]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div style={{ height: "97px" }} />
    </>
  );
}
