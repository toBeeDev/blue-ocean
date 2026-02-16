export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";
import PoolCard from "@/components/pool/PoolCard";
import SearchInput from "./SearchInput";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    return {
      title: `"${q}" 검색 결과 — 블루오션`,
      description: `${q} 관련 수영장 검색 결과. 전국 수영장 정보를 한눈에.`,
    };
  }
  return {
    title: "수영장 검색 — 블루오션",
    description: "전국 수영장을 이름, 지역으로 검색하세요.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let results: Awaited<ReturnType<typeof db.query.pools.findMany>> = [];

  if (query) {
    results = await db.query.pools.findMany({
      where: and(
        eq(pools.isOperating, true),
        ilike(pools.name, `%${query}%`)
      ),
      orderBy: [desc(pools.updatedAt)],
      limit: 40,
    });

    // 이름 검색에 결과가 적으면 지역명으로도 검색
    if (results.length < 5) {
      const regionResults = await db.query.pools.findMany({
        where: and(
          eq(pools.isOperating, true),
          ilike(pools.address, `%${query}%`)
        ),
        orderBy: [desc(pools.updatedAt)],
        limit: 40,
      });

      // 중복 제거 후 합치기
      const existingIds = new Set(results.map((r) => r.id));
      for (const pool of regionResults) {
        if (!existingIds.has(pool.id)) {
          results.push(pool);
        }
      }
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-ocean-50 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-ocean-500" />
            <span className="text-[13px] font-semibold text-ocean-500 uppercase tracking-wider">
              Search
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
            수영장 검색
          </h1>

          <SearchInput defaultValue={query} />
        </div>
      </section>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-10">
        {query && (
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
            {" "}검색 결과 {results.length}건
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {results.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground mb-2">
              검색 결과가 없습니다
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              다른 키워드로 검색해보세요
            </p>
            <Link
              href="/pools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-500 text-white text-sm font-semibold hover:bg-ocean-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              전체 수영장 보기
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground mb-2">
              수영장을 검색해보세요
            </p>
            <p className="text-sm text-muted-foreground">
              수영장 이름이나 지역명으로 검색할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
