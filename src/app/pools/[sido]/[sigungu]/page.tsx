import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { MapPin, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PoolCard from "@/components/pool/PoolCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ sido: string; sigungu: string }>;
}

async function getNames(sidoSlug: string, sigunguSlug: string) {
  const result = await db
    .select({ sido: pools.sido, sigungu: pools.sigungu })
    .from(pools)
    .where(
      and(eq(pools.sidoSlug, sidoSlug), eq(pools.sigunguSlug, sigunguSlug))
    )
    .limit(1);
  return result[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sido, sigungu } = await params;
  const names = await getNames(sido, sigungu);
  if (!names) return { title: "지역을 찾을 수 없습니다" };

  return {
    title: `${names.sigungu} 수영장 추천 — 블루오션`,
    description: `${names.sido} ${names.sigungu} 수영장 목록. 자유수영 시간표, 가격 비교, 시설 정보를 한눈에.`,
  };
}

export default async function SigunguPage({ params }: Props) {
  const { sido: sidoSlug, sigungu: sigunguSlug } = await params;

  const names = await getNames(sidoSlug, sigunguSlug);
  if (!names) notFound();

  const shortSido = names.sido.replace(
    /특별시|광역시|특별자치시|특별자치도|도$/g,
    ""
  );

  const sigunguPools = await db.query.pools.findMany({
    where: and(
      eq(pools.sidoSlug, sidoSlug),
      eq(pools.sigunguSlug, sigunguSlug),
      eq(pools.isOperating, true)
    ),
    orderBy: [desc(pools.updatedAt)],
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-ocean-50 to-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
            <Link
              href="/pools"
              className="hover:text-ocean-500 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              전국
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/pools/${sidoSlug}`}
              className="hover:text-ocean-500 transition-colors"
            >
              {shortSido}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">
              {names.sigungu}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-ocean-500" />
            <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
              {sidoSlug} / {sigunguSlug}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {names.sigungu} 수영장
          </h1>
          <p className="mt-2 text-muted-foreground">
            {names.sido} {names.sigungu} 내 {sigunguPools.length}개 수영장
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {sigunguPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>

        {sigunguPools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              해당 지역에 등록된 수영장이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
