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
  fetchSwimmingPools,
  type FacilityItem,
} from "../src/lib/api/public-data";
import { sidoToSlug, toSlug, poolNameToSlug } from "../src/lib/utils/region";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function main() {
  console.log("🏊 수영장 데이터 동기화 시작...\n");

  // 1) 전체 수영장 수 확인
  const first = await fetchSwimmingPools(1, 1);
  const totalCount = first.totalCount;
  console.log(`📊 전체 수영장 ${totalCount}건 확인\n`);

  // 2) 페이지별로 수집
  const allItems: FacilityItem[] = [];
  const perPage = 1000;
  const totalPages = Math.ceil(totalCount / perPage);

  for (let page = 1; page <= totalPages; page++) {
    const { items } = await fetchSwimmingPools(page, perPage);
    allItems.push(...items);
    console.log(`📡 페이지 ${page}/${totalPages}: ${items.length}건 (총 ${allItems.length}건)`);
    await sleep(300);
  }

  // 정상운영 수영장만
  const operating = allItems.filter((item) => item.faci_stat_nm === "정상운영");
  console.log(`\n✅ 정상운영 수영장: ${operating.length}건 / 전체 ${allItems.length}건\n`);

  // 3) DB에 저장
  console.log("💾 DB 저장 중...");
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const item of operating) {
    try {
      const name = item.faci_nm?.trim();
      const sido = item.addr_ctpv_nm?.trim();
      const sigungu = item.cpb_nm?.trim() || item.addr_cpb_nm?.trim();

      if (!name || !sido) continue;

      const slug = poolNameToSlug(`${name}-${sigungu}-${sidoToSlug(sido)}`);
      const sidoSlugVal = sidoToSlug(sido);
      const sigunguSlugVal = toSlug(sigungu || "");

      const isPublic = item.faci_gb_nm === "공공";
      const isIndoor =
        item.inout_gbn_nm === "실내"
          ? true
          : item.inout_gbn_nm === "실외"
          ? false
          : null;

      const poolData = {
        name,
        slug,
        type: isPublic ? ("public" as const) : ("private" as const),
        indoor: isIndoor,
        sido,
        sidoSlug: sidoSlugVal,
        sigungu: sigungu || "",
        sigunguSlug: sigunguSlugVal,
        address: item.faci_road_addr || item.faci_addr || null,
        lat: item.faci_lat || null,
        lng: item.faci_lot || null,
        phone: item.faci_tel_no || null,
        website: null,
        laneCount: null,
        poolArea: item.faci_gfa ? String(item.faci_gfa) : null,
        poolLength: null,
        safetyGrade: item.atnm_chk_yn === "Y" ? "점검완료" : null,
        isOperating: true,
        sourceApi: "B551014_SFMS_FACI",
        sourceId: item.faci_cd,
        updatedAt: new Date(),
      };

      // sourceId 기준 upsert
      const existing = await db
        .select({ id: pools.id })
        .from(pools)
        .where(eq(pools.sourceId, item.faci_cd))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(pools)
          .set(poolData)
          .where(eq(pools.sourceId, item.faci_cd));
        updated++;
      } else {
        await db.insert(pools).values(poolData);
        inserted++;
      }
    } catch (e: any) {
      if (e.code === "23505") {
        // unique slug conflict — append sourceId
        try {
          const name = item.faci_nm?.trim();
          const slug = poolNameToSlug(`${name}-${item.faci_cd.slice(0, 8)}`);
          const sido = item.addr_ctpv_nm?.trim();
          const sigungu = item.cpb_nm?.trim() || item.addr_cpb_nm?.trim();

          await db.insert(pools).values({
            name: name || "",
            slug,
            type: item.faci_gb_nm === "공공" ? "public" : "private",
            indoor: item.inout_gbn_nm === "실내" ? true : item.inout_gbn_nm === "실외" ? false : null,
            sido: sido || "",
            sidoSlug: sidoToSlug(sido || ""),
            sigungu: sigungu || "",
            sigunguSlug: toSlug(sigungu || ""),
            address: item.faci_road_addr || item.faci_addr || null,
            lat: item.faci_lat || null,
            lng: item.faci_lot || null,
            phone: item.faci_tel_no || null,
            poolArea: item.faci_gfa ? String(item.faci_gfa) : null,
            safetyGrade: item.atnm_chk_yn === "Y" ? "점검완료" : null,
            isOperating: true,
            sourceApi: "B551014_SFMS_FACI",
            sourceId: item.faci_cd,
            updatedAt: new Date(),
          });
          inserted++;
        } catch {
          errors++;
        }
      } else {
        errors++;
        if (errors <= 5) console.error(`  ⚠ ${item.faci_nm}: ${e.message}`);
      }
    }
  }

  console.log(`\n🎉 동기화 완료!`);
  console.log(`   신규: ${inserted}건`);
  console.log(`   업데이트: ${updated}건`);
  console.log(`   에러: ${errors}건\n`);

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
