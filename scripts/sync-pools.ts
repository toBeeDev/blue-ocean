/**
 * 공공데이터 API → Supabase DB 동기화 스크립트
 *
 * 실행: npx tsx scripts/sync-pools.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { pools } from "../src/lib/db/schema";
import {
  fetchNationalFacilities,
  fetchFacilityDetails,
  isSwimmingPool,
  type FacilityItem,
  type FacilityDetailItem,
} from "../src/lib/api/public-data";
import { sidoToSlug, toSlug, poolNameToSlug } from "../src/lib/utils/region";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

/* ── Main ── */

async function main() {
  console.log("🏊 수영장 데이터 동기화 시작...\n");

  // 1) 전국체육시설 정보에서 수영장 수집
  console.log("📡 [1/3] 전국체육시설 API 호출...");
  const allFacilities: FacilityItem[] = [];

  let page = 1;
  while (true) {
    try {
      const items = await fetchNationalFacilities(page, 1000);
      if (!items.length) break;
      allFacilities.push(...items);
      console.log(`  → 페이지 ${page}: ${items.length}건 수신 (총 ${allFacilities.length}건)`);
      page++;

      // API 부하 방지
      await sleep(300);
    } catch (e) {
      console.log(`  → 페이지 ${page} 에러, 수집 종료`);
      break;
    }
  }

  // 수영장만 필터
  const swimmingPools = allFacilities.filter(isSwimmingPool);
  console.log(`\n✅ 전체 ${allFacilities.length}건 중 수영장 ${swimmingPools.length}건 필터링\n`);

  // 2) 공공체육시설 상세 정보 수집 (레인 수, 면적 등)
  console.log("📡 [2/3] 공공체육시설 상세 API 호출...");
  const allDetails: FacilityDetailItem[] = [];

  page = 1;
  while (true) {
    try {
      const items = await fetchFacilityDetails(page, 1000);
      if (!items.length) break;
      allDetails.push(...items);
      console.log(`  → 페이지 ${page}: ${items.length}건 수신 (총 ${allDetails.length}건)`);
      page++;
      await sleep(300);
    } catch (e) {
      console.log(`  → 페이지 ${page} 에러, 수집 종료`);
      break;
    }
  }

  // 상세 정보를 이름으로 매핑
  const detailMap = new Map<string, FacilityDetailItem>();
  for (const d of allDetails) {
    if (d.facltNm) detailMap.set(d.facltNm.trim(), d);
  }

  console.log(`\n✅ 상세 정보 ${allDetails.length}건 수집\n`);

  // 3) DB에 upsert
  console.log("💾 [3/3] DB 저장 중...");
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const item of swimmingPools) {
    try {
      const sido = item.ctprvnNm?.trim() || "";
      const sigungu = item.signguNm?.trim() || "";
      const name = item.facltNm?.trim() || "";

      if (!name || !sido) continue;

      const slug = poolNameToSlug(name);
      const sidoSlug = sidoToSlug(sido);
      const sigunguSlug = toSlug(sigungu);

      // 상세 정보 매칭
      const detail = detailMap.get(name);

      const poolData = {
        name,
        slug,
        type: "public" as const,
        indoor: detail?.indoorOutdoorGb?.includes("실내") ?? null,
        sido,
        sidoSlug,
        sigungu,
        sigunguSlug,
        address: item.rdnmadr || item.lnmadr || null,
        lat: item.fcltyLa || null,
        lng: item.fcltyLo || null,
        phone: item.telNo || null,
        website: item.hmpgAddr || null,
        laneCount: detail?.laneCo ? parseInt(detail.laneCo) || null : null,
        poolArea: detail?.swmplSmr || null,
        poolLength: detail?.swmplLt ? parseInt(detail.swmplLt) || null : null,
        isOperating: true,
        sourceApi: "national_facility",
        sourceId: `nf_${slug}`,
        updatedAt: new Date(),
      };

      // slug 기준 upsert
      const existing = await db
        .select({ id: pools.id })
        .from(pools)
        .where(eq(pools.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        await db.update(pools).set(poolData).where(eq(pools.slug, slug));
        updated++;
      } else {
        await db.insert(pools).values(poolData);
        inserted++;
      }
    } catch (e: any) {
      // slug 중복 등 무시
      if (e.code === "23505") {
        // unique violation — skip
      } else {
        errors++;
        if (errors <= 5) console.error(`  ⚠ 에러: ${e.message}`);
      }
    }
  }

  console.log(`\n🎉 동기화 완료!`);
  console.log(`   신규: ${inserted}건`);
  console.log(`   업데이트: ${updated}건`);
  console.log(`   에러: ${errors}건`);

  await client.end();
  process.exit(0);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((e) => {
  console.error("❌ 동기화 실패:", e);
  process.exit(1);
});
