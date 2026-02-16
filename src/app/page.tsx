export const dynamic = "force-dynamic";

import {
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Waves,
  TrendingUp,
  ArrowRight,
  Navigation,
  Search,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import HeroSection from "@/components/home/HeroSection";
import {
  StaggerContainer,
  FadeUp,
  MotionDiv,
} from "@/components/home/AnimatedSection";
import PoolCard from "@/components/pool/PoolCard";

const FEATURES = [
  {
    icon: Search,
    title: "전국 수영장 통합 검색",
    desc: "공공데이터 기반 수영장 정보를 한눈에 비교",
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

export default async function Home() {
  // 시도별 수영장 수
  const regionStats = await db
    .select({
      sido: pools.sido,
      sidoSlug: pools.sidoSlug,
      count: count(),
    })
    .from(pools)
    .where(eq(pools.isOperating, true))
    .groupBy(pools.sido, pools.sidoSlug)
    .orderBy(desc(count()));

  // 인기 수영장 (최근 업데이트 기준)
  const popularPools = await db.query.pools.findMany({
    where: eq(pools.isOperating, true),
    orderBy: [desc(pools.updatedAt)],
    limit: 8,
  });

  const totalCount = regionStats.reduce((sum, r) => sum + r.count, 0);

  // 시도 이름을 짧게
  const shortSido = (name: string) =>
    name.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "");

  return (
    <div className="relative overflow-hidden">
      {/* ══ HERO ══ */}
      <HeroSection totalCount={totalCount} />

      {/* ══ POPULAR POOLS ══ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <StaggerContainer className="flex items-end justify-between mb-10">
            <FadeUp index={0}>
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
            </FadeUp>
            <FadeUp index={1}>
              <Link
                href="/pools"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-ocean-500 hover:text-ocean-600 transition-colors group"
              >
                전체 보기
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </FadeUp>
          </StaggerContainer>

          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            margin="-60px"
          >
            {popularPools.map((pool, i) => (
              <FadeUp key={pool.id} index={i}>
                <PoolCard pool={pool} />
              </FadeUp>
            ))}
          </StaggerContainer>

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

      {/* ══ REGIONS ══ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <StaggerContainer>
            <FadeUp index={0} className="mb-10">
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
            </FadeUp>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {regionStats.map((region, i) => (
                <FadeUp key={region.sidoSlug} index={i}>
                  <Link
                    href={`/pools/${region.sidoSlug}`}
                    className="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border border-border/60 hover:border-ocean-200 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(10,122,255,0.08)] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 to-aqua-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-ocean-600 transition-colors">
                        {shortSido(region.sido)}
                      </span>
                      <p className="mt-1.5 text-[13px] text-muted-foreground text-center">
                        {region.count}개 수영장
                      </p>
                    </div>
                    <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-muted-foreground/30 group-hover:text-ocean-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </FadeUp>
              ))}
            </StaggerContainer>
          </StaggerContainer>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <StaggerContainer>
            <FadeUp index={0} className="text-center mb-12 sm:mb-16">
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
            </FadeUp>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {FEATURES.map((feat, i) => (
                <FadeUp
                  key={feat.title}
                  index={i}
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
                </FadeUp>
              ))}
            </StaggerContainer>
          </StaggerContainer>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-600 via-ocean-500 to-aqua-500 p-8 sm:p-14 text-center"
          >
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
                  href="/pools"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-ocean-600 font-semibold text-sm hover:bg-ocean-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
                >
                  <MapPin className="w-4 h-4" />
                  전국 수영장 둘러보기
                </Link>
                <Link
                  href="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/20"
                >
                  <Search className="w-4 h-4" />
                  수영장 검색하기
                </Link>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
}
