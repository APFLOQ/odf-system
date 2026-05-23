"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Expertise", href: "#expertise" },
  { label: "Studios", href: "#studios" },
  { label: "Feedback", href: "#feedback" },
];

const siteNav = [
  { label: "Education", href: "/education" },
  { label: "Glossary", href: "/glossary" },
  { label: "Brain", href: "/brain" },
  { label: "Dashboard", href: "/dashboard" },
];

const stats = [
  { value: "22", label: "MODULES\nCRAFTED" },
  { value: "140", label: "TERMS\nINDEXED" },
  { value: "4", label: "PHASES\nOF LEARNING" },
];

const easeBezier: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeBezier },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: easeBezier },
  }),
};

const headingSlide = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: 0,
    transition: { delay: 0.4 + i * 0.14, duration: 0.7, ease: easeBezier },
  }),
};

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Video Background - WIDER */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full w-auto h-auto object-cover"
        style={{ zIndex: 0, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 2 }}>
        {/* Navigation */}
        <motion.nav
          className="flex items-center justify-between px-5 sm:px-8 md:px-12 pt-5 md:pt-6"
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div
            custom={0}
            variants={fadeDown}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2"
            style={{ borderColor: "#5E0ED7" }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#5E0ED7" }} />
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                custom={i + 1}
                variants={fadeDown}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
              >
                {link.label}
              </motion.a>
            ))}
            {/* Dropdown for site navigation */}
            <motion.div
              custom={5}
              variants={fadeDown}
              className="relative"
            >
              <button
                onClick={() => setNavDropdownOpen(!navDropdownOpen)}
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
              >
                Menu
                <ChevronDown className={`w-4 h-4 transition-transform ${navDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {navDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {siteNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setNavDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Hamburger */}
          <motion.button
            custom={5}
            variants={fadeDown}
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full bg-black flex flex-col items-center justify-center gap-1"
            aria-label="Open menu"
          >
            <span className="w-4 h-0.5 bg-white" />
            <span className="w-4 h-0.5 bg-white" />
            <span className="w-4 h-0.5 bg-white" />
          </motion.button>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white z-50 flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 pt-5 md:pt-6">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2"
                  style={{ borderColor: "#5E0ED7" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#5E0ED7" }} />
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex flex-col gap-8 mt-16 px-5 sm:px-8 md:px-12">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-semibold uppercase tracking-widest text-black"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-black/10 pt-6 mt-2">
                  <p className="text-xs uppercase tracking-widest text-black/40 mb-4">Navigate</p>
                  {siteNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg font-semibold uppercase tracking-widest text-black/70 hover:text-black transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Menu CTA */}
              <div className="mt-auto px-5 sm:px-8 md:px-12 pb-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xl font-semibold"
                  style={{ color: "#5E0ED7" }}
                >
                  Work With Us
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <motion.div
          className="flex-1 flex items-center justify-end px-5 sm:px-8 md:px-12 py-8 md:py-0"
          initial="hidden"
          animate="visible"
        >
          <div className="flex gap-5 sm:gap-8 md:gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i + 2}
                variants={fadeUp}
                className="text-right"
              >
                <div
                  className="font-semibold leading-none"
                  style={{
                    fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
                    color: "#ffffff",
                  }}
                >
                  <span style={{ color: "#5E0ED7", fontSize: "0.5em", verticalAlign: "super", marginRight: "2px" }}>
                    +
                  </span>
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest text-white whitespace-pre-line leading-tight mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="px-5 sm:px-8 md:px-12 pb-6 md:pb-8 flex flex-col gap-4 md:gap-8">
          {/* Row A: Tagline + CTA */}
          <motion.div
            className="flex items-center justify-between gap-4"
            initial="hidden"
            animate="visible"
          >
            <motion.p
              custom={5}
              variants={fadeUp}
              className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest text-white leading-relaxed"
              style={{ maxWidth: "clamp(130px, 20vw, 320px)" }}
            >
              Shaping Bold
              <br />
              Visions Into Power
              <br />
              For Your Tribe
            </motion.p>

            <motion.div custom={6} variants={fadeUp}>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-white hover:opacity-80 transition-opacity"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  color: "#5E0ED7",
                }}
              >
                Work With Us
                <ArrowUpRight className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Row B: Description + Main Heading */}
          <motion.div
            className="flex items-end justify-between gap-3 sm:gap-4"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              custom={7}
              variants={fadeUp}
              className="shrink-0"
              style={{ width: "clamp(120px, 18vw, 280px)" }}
            >
              <p className="text-[9px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest text-white text-left md:text-right leading-relaxed">
                Creative Studios Built Around Elevating Your Vision Into Striking Reality
              </p>
            </motion.div>

            {/* Main Heading */}
            <div className="text-right">
              {["ORDER", "FLOW", "DELIVERED"].map((word, i) => (
                <div key={word} className="overflow-hidden">
                  <motion.div
                    custom={i}
                    variants={headingSlide}
                    initial="hidden"
                    animate="visible"
                    className="font-semibold uppercase text-white"
                    style={{
                      fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                      lineHeight: 0.95,
                    }}
                  >
                    {word}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
