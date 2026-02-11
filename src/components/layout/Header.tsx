"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "수영장 찾기", href: "/pools" },
  { label: "자유수영", href: "/free-swim" },
  { label: "내 주변", href: "/near-me" },
  { label: "가이드", href: "/guide" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_24px_rgba(10,122,255,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 sm:h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ocean-500 to-aqua-500 group-hover:scale-110 transition-transform duration-300" />
                <svg
                  viewBox="0 0 36 36"
                  className="relative w-full h-full"
                  fill="none"
                >
                  <path
                    d="M8 22c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                  <path
                    d="M8 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                블루오션
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-ocean-50/60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-all duration-200 border border-transparent hover:border-border">
                <Search className="w-4 h-4" />
                <span className="text-[13px]">수영장 검색</span>
                <kbd className="hidden lg:inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[11px] font-medium bg-background border border-border text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              <button className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-semibold transition-all duration-200 shadow-[0_2px_12px_rgba(10,122,255,0.3)] hover:shadow-[0_4px_20px_rgba(10,122,255,0.4)]">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[13px] sm:text-sm">내 주변</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted/60 transition-colors"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden glass border-b border-border"
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] font-medium text-foreground rounded-xl hover:bg-ocean-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
