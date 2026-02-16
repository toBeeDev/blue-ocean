"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Waves } from "lucide-react";

const QUICK_TAGS = ["자유수영", "실내수영장", "25m", "50m", "강습"];

interface HeroSectionProps {
  totalCount: number;
}

export default function HeroSection({ totalCount }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTag = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-50 via-white to-white" />
        <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-ocean-200/30 blur-[120px] animate-float" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-aqua-200/25 blur-[100px] animate-float-delayed" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-ocean-100/20 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #0A7AFF 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-50 border border-ocean-100 mb-8">
              <Waves className="w-3.5 h-3.5 text-ocean-500" />
              <span className="text-[13px] font-medium text-ocean-700">
                전국 {totalCount.toLocaleString()}+ 수영장 정보
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl"
          >
            <span className="text-foreground">내 근처 수영장,</span>
            <br />
            <span className="text-gradient-ocean">한눈에 비교하고</span>
            <br />
            <span className="text-foreground">바로 가자</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            자유수영 시간표부터 가격 비교, 안전등급까지
            <br className="hidden sm:block" />
            수영을 시작하는 가장 쉬운 방법
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 w-full max-w-2xl"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-ocean-400/20 via-aqua-400/20 to-ocean-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_32px_rgba(10,122,255,0.1),0_0_0_1px_rgba(10,122,255,0.08)] transition-all duration-300">
                <div className="flex items-center gap-2 pl-5 pr-3 text-muted-foreground border-r border-border">
                  <MapPin className="w-4 h-4 text-ocean-500" />
                  <span className="text-sm whitespace-nowrap">지역</span>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="수영장 이름, 지역으로 검색"
                  className="flex-1 px-4 py-4 sm:py-5 text-[15px] bg-transparent outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 m-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-semibold transition-all duration-200 shadow-[0_2px_12px_rgba(10,122,255,0.35)]"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">검색</span>
                </button>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTag(tag)}
                  className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground bg-muted/50 hover:bg-ocean-50 hover:text-ocean-600 rounded-full transition-all duration-200 border border-transparent hover:border-ocean-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-14 flex items-center gap-8 sm:gap-12"
          >
            {[
              { value: `${totalCount.toLocaleString()}+`, label: "등록 수영장" },
              { value: "17개", label: "시도 전국 커버" },
              { value: "매일", label: "정보 업데이트" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs sm:text-[13px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 20 480 80 720 60C960 40 1200 80 1440 60V120H0V60Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
