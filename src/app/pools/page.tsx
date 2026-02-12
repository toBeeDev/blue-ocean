import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { Waves, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import PoolCard from "@/components/pool/PoolCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전국 수영장 목록 — 블루오션",
  description:
    "전국 587개 수영장 정보를 한눈에. 지역별, 실내외, 공공/민간 필터로 나에게 맞는 수영장을 찾아보세요.",
};

export default async function PoolsPage() {
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

  // 최근 업데이트된 수영장 (전체 목록)
  const allPools = await db.query.pools.findMany({
    where: eq(pools.isOperating, true),
    orderBy: [desc(pools.updatedAt)],
    limit: 24,
  });

  const totalCount = regionStats.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-ocean-50 to-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-ocean-500" />
            <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
              All Pools
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            전국 수영장
          </h1>
          <p className="mt-2 text-muted-foreground">
            전국 {totalCount.toLocaleString()}개 수영장 정보를 한눈에
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-10">
        {/* Region Grid */}
        <div className="mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
            지역별 수영장
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {regionStats.map((region) => (
              <Link
                key={region.sidoSlug}
                href={`/pools/${region.sidoSlug}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-white border border-border/60 hover:border-ocean-200 hover:shadow-[0_4px_24px_rgba(10,122,255,0.06)] transition-all duration-200"
              >
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground group-hover:text-ocean-600 transition-colors">
                    {region.sido.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "")}
                  </span>
                  <p className="text-[12px] text-muted-foreground">
                    {region.count}개
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-ocean-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Pool Cards */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
            전체 수영장
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {allPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
