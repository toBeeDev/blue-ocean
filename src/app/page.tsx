"use client";

import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Waves,
  Droplets,
  Star,
  TrendingUp,
  ArrowRight,
  Navigation,
} from "lucide-react";
import Link from "next/link";

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Mock Data ── */
const POPULAR_POOLS = [
  {
    id: 1,
    name: "잠실한강수영장",
    region: "서울 송파구",
    type: "공공",
    indoor: false,
    lanes: 8,
    rating: 4.6,
    reviews: 324,
    price: "6,000원",
    freeSwim: "06:00 – 08:00",
    safetyGrade: "A",
    tags: ["50m", "야외", "자유수영"],
    gradient: "from-ocean-400 to-ocean-600",
  },
  {
    id: 2,
    name: "강남스포츠문화센터",
    region: "서울 강남구",
    type: "공공",
    indoor: true,
    lanes: 10,
    rating: 4.8,
    reviews: 512,
    price: "8,000원",
    freeSwim: "06:00 – 09:00",
    safetyGrade: "A+",
    tags: ["25m", "실내", "강습"],
    gradient: "from-aqua-400 to-ocean-500",
  },
  {
    id: 3,
    name: "올림픽수영장",
    region: "서울 송파구",
    type: "공공",
    indoor: true,
    lanes: 10,
    rating: 4.7,
    reviews: 891,
    price: "5,000원",
    freeSwim: "12:00 – 13:00",
    safetyGrade: "A+",
    tags: ["50m", "실내", "다이빙"],
    gradient: "from-ocean-500 to-aqua-400",
  },
  {
    id: 4,
    name: "수원시민체육관 수영장",
    region: "경기 수원시",
    type: "공공",
    indoor: true,
    lanes: 8,
    rating: 4.4,
    reviews: 256,
    price: "4,500원",
    freeSwim: "07:00 – 09:00",
    safetyGrade: "A",
    tags: ["25m", "실내", "사우나"],
    gradient: "from-aqua-500 to-aqua-700",
  },
];

const REGIONS = [
  { name: "서울", count: 342, slug: "seoul" },
  { name: "경기", count: 298, slug: "gyeonggi" },
  { name: "부산", count: 87, slug: "busan" },
  { name: "인천", count: 76, slug: "incheon" },
  { name: "대구", count: 54, slug: "daegu" },
  { name: "대전", count: 48, slug: "daejeon" },
  { name: "광주", count: 42, slug: "gwangju" },
  { name: "울산", count: 38, slug: "ulsan" },
];

const FEATURES = [
  {
    icon: Search,
    title: "전국 수영장 통합 검색",
    desc: "공공데이터 기반 2,000+ 수영장 정보를 한눈에 비교",
  },
  {
    icon: Clock,
    title: "자유수영 시간표",
    desc: "내가 갈 수 있는 시간, 가능한 수영장만 필터링",
  },
  {
    icon: Shield,
    title: "안전점검 등급",
    desc: "정부 공식 안전점검 결과로 안심하고 선택",
  },
  {
    icon: Navigation,
    title: "내 주변 수영장",
    desc: "현재 위치에서 가까운 수영장을 즉시 탐색",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-12">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-50 via-white to-white" />
          {/* Decorative blobs */}
          <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-ocean-200/30 blur-[120px] animate-float" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-aqua-200/25 blur-[100px] animate-float-delayed" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-ocean-100/20 blur-[80px]" />
          {/* Grid pattern */}
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
                  전국 2,000+ 수영장 정보
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                    placeholder="수영장 이름, 지역으로 검색"
                    className="flex-1 px-4 py-4 sm:py-5 text-[15px] bg-transparent outline-none placeholder:text-muted-foreground/60"
                  />
                  <button className="flex items-center gap-2 m-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-semibold transition-all duration-200 shadow-[0_2px_12px_rgba(10,122,255,0.35)]">
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">검색</span>
                  </button>
                </div>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["자유수영", "실내수영장", "25m", "50m", "강습"].map((tag) => (
                  <button
                    key={tag}
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
                { value: "2,000+", label: "등록 수영장" },
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

      {/* ════════════════════════════════════════════
          POPULAR POOLS — Catchtable-style cards
      ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex items-end justify-between mb-10"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-ocean-500" />
                <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                인기 수영장
              </h2>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                가장 많이 찾는 수영장을 만나보세요
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Link
                href="/pools"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-ocean-500 hover:text-ocean-600 transition-colors group"
              >
                전체 보기
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Pool Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {POPULAR_POOLS.map((pool, i) => (
              <motion.div key={pool.id} variants={fadeUp} custom={i}>
                <Link href={`/pools/seoul/${pool.id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-ocean-200 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(10,122,255,0.08)]">
                    {/* Image placeholder with gradient */}
                    <div
                      className={`relative h-44 sm:h-48 bg-gradient-to-br ${pool.gradient} overflow-hidden`}
                    >
                      {/* Water pattern overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 400 200"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0 100 C80 60, 160 140, 240 100 S400 60, 400 100 V200 H0Z"
                            fill="white"
                            opacity="0.3"
                          />
                          <path
                            d="M0 120 C100 80, 200 160, 300 120 S400 80, 400 120 V200 H0Z"
                            fill="white"
                            opacity="0.2"
                          />
                        </svg>
                      </div>

                      {/* Floating icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Droplets className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/90 text-[11px] font-semibold text-ocean-700 backdrop-blur-sm">
                          {pool.type}
                        </span>
                        {pool.safetyGrade && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-[11px] font-semibold text-white backdrop-blur-sm flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5" />
                            {pool.safetyGrade}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-semibold text-white">
                          {pool.rating}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-semibold text-foreground truncate group-hover:text-ocean-600 transition-colors">
                            {pool.name}
                          </h3>
                          <p className="mt-0.5 text-[13px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {pool.region}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {pool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Info row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                        <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <Clock className="w-3 h-3 text-ocean-400" />
                          <span>{pool.freeSwim}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {pool.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile CTA */}
          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/pools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-500"
            >
              전체 수영장 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          REGION SECTION
      ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-ocean-500" />
                <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
                  By Region
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                지역별 수영장
              </h2>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                우리 동네 수영장을 찾아보세요
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              {REGIONS.map((region, i) => (
                <motion.div key={region.slug} variants={fadeUp} custom={i}>
                  <Link
                    href={`/pools/${region.slug}`}
                    className="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border border-border/60 hover:border-ocean-200 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(10,122,255,0.08)] overflow-hidden"
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 to-aqua-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-ocean-600 transition-colors">
                        {region.name}
                      </span>
                      <p className="mt-1.5 text-[13px] text-muted-foreground text-center">
                        {region.count}개 수영장
                      </p>
                    </div>
                    <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-muted-foreground/30 group-hover:text-ocean-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                수영을 시작하는
                <br />
                <span className="text-gradient-ocean">가장 쉬운 방법</span>
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                공공데이터 기반의 정확한 정보로
                <br />
                나에게 딱 맞는 수영장을 찾아보세요
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  custom={i}
                  className="group relative p-6 sm:p-7 rounded-2xl bg-muted/30 border border-border/40 hover:border-ocean-200 hover:bg-ocean-50/30 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocean-500 to-aqua-500 flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(10,122,255,0.2)] group-hover:shadow-[0_4px_24px_rgba(10,122,255,0.3)] transition-shadow">
                    <feat.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-600 via-ocean-500 to-aqua-500 p-8 sm:p-14 text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 400"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 200 C160 120, 320 280, 480 200 S800 120, 800 200 V400 H0Z"
                  fill="white"
                />
                <path
                  d="M0 250 C200 170, 400 330, 600 250 S800 170, 800 250 V400 H0Z"
                  fill="white"
                  opacity="0.5"
                />
              </svg>
            </div>

            <div className="relative">
              <Waves className="w-10 h-10 mx-auto mb-5 text-white/60" />
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                지금 바로 시작하세요
              </h2>
              <p className="mt-3 text-base sm:text-lg text-white/80 max-w-md mx-auto">
                내 주변 수영장을 검색하고
                <br />
                자유수영 시간표를 확인해보세요
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/near-me"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-ocean-600 font-semibold text-sm hover:bg-ocean-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
                >
                  <MapPin className="w-4 h-4" />
                  내 주변 수영장 찾기
                </Link>
                <Link
                  href="/free-swim"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/20"
                >
                  <Clock className="w-4 h-4" />
                  자유수영 시간표 보기
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
