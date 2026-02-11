/**
 * 공공데이터포털 API 클라이언트
 *
 * ① 전국체육시설 정보 — 수영장 기본 목록
 * ② 공공체육시설 상세 정보 — 레인 수, 면적 등
 * ③ 지방행정 인허가 데이터 — 민간 수영장 포함
 */

const API_KEY = process.env.PUBLIC_DATA_API_KEY!;
const BASE = "https://apis.data.go.kr";

/* ── Types ── */

export interface FacilityItem {
  /** 시설명 */
  facltNm: string;
  /** 시설구분명 (ex: 수영장) */
  fcltySeCdNm: string;
  /** 업종명 */
  indutyNm: string;
  /** 시도명 */
  ctprvnNm: string;
  /** 시군구명 */
  signguNm: string;
  /** 도로명주소 */
  rdnmadr: string;
  /** 지번주소 */
  lnmadr: string;
  /** 우편번호 */
  zip: string;
  /** 전화번호 */
  telNo: string;
  /** 홈페이지 */
  hmpgAddr: string;
  /** 위도 */
  fcltyLa: string;
  /** 경도 */
  fcltyLo: string;
}

export interface FacilityDetailItem {
  /** 시설명 */
  facltNm: string;
  /** 시설구분 */
  fcltySe: string;
  /** 시설유형 */
  fcltyTy: string;
  /** 시설종류 */
  fcltyKnd: string;
  /** 시도명 */
  ctprvnNm: string;
  /** 시군구명 */
  signguNm: string;
  /** 수영조 면적 */
  swmplSmr: string;
  /** 레인 수 */
  laneCo: string;
  /** 수영장 길이 */
  swmplLt: string;
  /** 관람석 수 */
  seatCo: string;
  /** 실내외 구분 */
  indoorOutdoorGb: string;
}

export interface LocalDataItem {
  /** 사업장명 */
  bplcNm: string;
  /** 영업상태 */
  dtlStateNm: string;
  /** 도로명 전체주소 */
  rdnWhlAddr: string;
  /** 지번 전체주소 */
  siteWhlAddr: string;
  /** 위도 */
  y: string;
  /** 경도 */
  x: string;
  /** 전화번호 */
  siteTel: string;
  /** 인허가일자 */
  apvPermYmd: string;
  /** 폐업일자 */
  dcbYmd: string;
  /** 지도자 수 */
  jidoSu: string;
  /** 회원모집 인원 */
  hoewonMojibInwon: string;
}

/* ── API Fetchers ── */

async function fetchApi<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T[]> {
  const url = new URL(endpoint, BASE);
  url.searchParams.set("serviceKey", API_KEY);
  url.searchParams.set("type", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // 공공데이터 API는 응답 구조가 다양 — 유연하게 추출
  const body = json.response?.body;
  if (body?.items?.item) {
    return Array.isArray(body.items.item)
      ? body.items.item
      : [body.items.item];
  }
  if (body?.items) {
    return Array.isArray(body.items) ? body.items : [body.items];
  }

  // 지방행정 인허가 데이터 형태
  if (json.data) {
    return Array.isArray(json.data) ? json.data : [json.data];
  }

  return [];
}

/**
 * ① 전국체육시설 정보 — 수영장만 필터링
 */
export async function fetchNationalFacilities(
  page = 1,
  perPage = 1000
): Promise<FacilityItem[]> {
  return fetchApi<FacilityItem>(
    "/B551014/SRVC_OD_API_FACIL_MNG/todz_api_facil_mng_i",
    {
      pageNo: String(page),
      numOfRows: String(perPage),
    }
  );
}

/**
 * ② 공공체육시설 상세 정보
 */
export async function fetchFacilityDetails(
  page = 1,
  perPage = 1000
): Promise<FacilityDetailItem[]> {
  return fetchApi<FacilityDetailItem>(
    "/B551014/SRVC_SFMS_FACIL_INFO/TODZ_SFMS_FACIL_INFO",
    {
      pageNo: String(page),
      numOfRows: String(perPage),
    }
  );
}

/**
 * 수영장 관련 시설만 필터링
 */
export function isSwimmingPool(item: FacilityItem): boolean {
  const keywords = ["수영", "풀", "pool", "swimming", "아쿠아"];
  const target =
    `${item.facltNm} ${item.fcltySeCdNm} ${item.indutyNm}`.toLowerCase();
  return keywords.some((kw) => target.includes(kw));
}
