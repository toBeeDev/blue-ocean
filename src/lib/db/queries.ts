import { eq, and, ilike, sql, desc, asc, count } from "drizzle-orm";
import { db } from ".";
import { pools, freeSwimSchedules, poolPrices, reviews } from "./schema";

/* ── 수영장 목록 ── */

export async function getPoolsBySido(sidoSlug: string) {
  return db.query.pools.findMany({
    where: and(eq(pools.sidoSlug, sidoSlug), eq(pools.isOperating, true)),
    orderBy: [desc(pools.updatedAt)],
  });
}

export async function getPoolsBySigungu(
  sidoSlug: string,
  sigunguSlug: string
) {
  return db.query.pools.findMany({
    where: and(
      eq(pools.sidoSlug, sidoSlug),
      eq(pools.sigunguSlug, sigunguSlug),
      eq(pools.isOperating, true)
    ),
    orderBy: [desc(pools.updatedAt)],
  });
}

/* ── 수영장 상세 ── */

export async function getPoolBySlug(slug: string) {
  return db.query.pools.findFirst({
    where: eq(pools.slug, slug),
    with: {
      schedules: true,
      prices: true,
      reviews: {
        orderBy: [desc(reviews.createdAt)],
        limit: 20,
      },
    },
  });
}

/* ── 검색 ── */

export async function searchPools(query: string, limit = 20) {
  return db.query.pools.findMany({
    where: and(
      ilike(pools.name, `%${query}%`),
      eq(pools.isOperating, true)
    ),
    limit,
  });
}

/* ── 지역별 수영장 수 ── */

export async function getPoolCountBySido() {
  return db
    .select({
      sidoSlug: pools.sidoSlug,
      sido: pools.sido,
      count: count(),
    })
    .from(pools)
    .where(eq(pools.isOperating, true))
    .groupBy(pools.sidoSlug, pools.sido)
    .orderBy(desc(count()));
}

/* ── 인기 수영장 (리뷰 많은 순) ── */

export async function getPopularPools(limit = 8) {
  return db.query.pools.findMany({
    where: eq(pools.isOperating, true),
    with: {
      reviews: true,
    },
    limit,
  });
}

/* ── 자유수영 가능 수영장 ── */

export async function getPoolsWithFreeSwim(sidoSlug?: string) {
  const conditions = [eq(pools.isOperating, true)];
  if (sidoSlug) {
    conditions.push(eq(pools.sidoSlug, sidoSlug));
  }

  return db.query.pools.findMany({
    where: and(...conditions),
    with: {
      schedules: {
        orderBy: [asc(freeSwimSchedules.dayOfWeek), asc(freeSwimSchedules.startTime)],
      },
    },
  });
}
