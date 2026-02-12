import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { MapPin, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PoolCard from "@/components/pool/PoolCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ sido: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sido } = await params;
  const sidoName = await getSidoName(sido);
  if (!sidoName) return { title: "지역을 찾을 수 없습니다" };

  const shortName = sidoName.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "");
  return {
    title: `${shortName} 수영장 추천 — 블루오션`,
    description: `${sidoName} 수영장 목록. 자유수영 시간표, 가격 비교, 시설 정보를 한눈에 확인하세요.`,
  };
}

async function getSidoName(sidoSlug: string): Promise<string | null> {
  const result = await db
    .select({ sido: pools.sido })
    .from(pools)
    .where(eq(pools.sidoSlug, sidoSlug))
    .limit(1);
  return result[0]?.sido ?? null;
}

export default async function SidoPage({ params }: Props) {
  const { sido: sidoSlug } = await params;

  const sidoName = await getSidoName(sidoSlug);
  if (!sidoName) notFound();

  const shortName = sidoName.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, "");

  // 시군구별 수영장 수
  const sigunguStats = await db
    .select({
      sigungu: pools.sigungu,
      sigunguSlug: pools.sigunguSlug,
      count: count(),
    })
    .from(pools)
    .where(and(eq(pools.sidoSlug, sidoSlug), eq(pools.isOperating, true)))
    .groupBy(pools.sigungu, pools.sigunguSlug)
    .orderBy(desc(count()));

  // 해당 시도 수영장 전체
  const sidoPools = await db.query.pools.findMany({
    where: and(eq(pools.sidoSlug, sidoSlug), eq(pools.isOperating, true)),
    orderBy: [desc(pools.updatedAt)],
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-ocean-50 to-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <Link
              href="/pools"
              className="hover:text-ocean-500 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              전국 수영장
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{shortName}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-ocean-500" />
            <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
              {sidoSlug}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {shortName} 수영장
          </h1>
          <p className="mt-2 text-muted-foreground">
            {sidoName} 내 {sidoPools.length}개 수영장
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-10">
        {/* Sigungu Filter */}
        {sigunguStats.length > 1 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">
              시/군/구별
            </h2>
            <div className="flex flex-wrap gap-2">
              {sigunguStats.map((s) => (
                <Link
                  key={s.sigunguSlug}
                  href={`/pools/${sidoSlug}/${s.sigunguSlug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-border/60 hover:border-ocean-200 hover:bg-ocean-50/50 text-sm font-medium text-foreground hover:text-ocean-600 transition-all duration-200"
                >
                  {s.sigungu}
                  <span className="text-[12px] text-muted-foreground">
                    {s.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pool Cards */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-5">
            전체 {sidoPools.length}개 수영장
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {sidoPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
