/**
 * 시도/시군구 한글 ↔ URL 슬러그 변환
 */

const SIDO_SLUG_MAP: Record<string, string> = {
  서울특별시: "seoul",
  서울: "seoul",
  부산광역시: "busan",
  부산: "busan",
  대구광역시: "daegu",
  대구: "daegu",
  인천광역시: "incheon",
  인천: "incheon",
  광주광역시: "gwangju",
  광주: "gwangju",
  대전광역시: "daejeon",
  대전: "daejeon",
  울산광역시: "ulsan",
  울산: "ulsan",
  세종특별자치시: "sejong",
  세종: "sejong",
  경기도: "gyeonggi",
  경기: "gyeonggi",
  강원특별자치도: "gangwon",
  강원도: "gangwon",
  강원: "gangwon",
  충청북도: "chungbuk",
  충북: "chungbuk",
  충청남도: "chungnam",
  충남: "chungnam",
  전북특별자치도: "jeonbuk",
  전라북도: "jeonbuk",
  전북: "jeonbuk",
  전라남도: "jeonnam",
  전남: "jeonnam",
  경상북도: "gyeongbuk",
  경북: "gyeongbuk",
  경상남도: "gyeongnam",
  경남: "gyeongnam",
  제주특별자치도: "jeju",
  제주: "jeju",
};

const SLUG_SIDO_MAP: Record<string, string> = {};
for (const [kr, slug] of Object.entries(SIDO_SLUG_MAP)) {
  if (!SLUG_SIDO_MAP[slug]) SLUG_SIDO_MAP[slug] = kr;
}

export function sidoToSlug(sido: string): string {
  return SIDO_SLUG_MAP[sido.trim()] ?? toSlug(sido);
}

export function slugToSido(slug: string): string | undefined {
  return SLUG_SIDO_MAP[slug];
}

/**
 * 시군구명을 URL-safe 슬러그로 변환
 * ex: "강남구" → "gangnam-gu", "수원시" → "suwon-si"
 * 간단 매핑이 없으면 한글 그대로 encodeURIComponent 사용
 */
export function toSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣\-]/g, "");
}

/**
 * 수영장명을 URL 슬러그로 변환
 */
export function poolNameToSlug(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[()[\]]/g, "")
    .toLowerCase();
}
