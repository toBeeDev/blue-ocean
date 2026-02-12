/**
 * 공공데이터포털 API 클라이언트
 *
 * 서울올림픽기념국민체육진흥공단 — 전국체육시설 정보
 * End Point: https://apis.data.go.kr/B551014/SRVC_API_SFMS_FACI
 * 상세기능: /TODZ_API_SFMS_FACI
 */

const BASE = "https://apis.data.go.kr";
const ENDPOINT = "/B551014/SRVC_API_SFMS_FACI/TODZ_API_SFMS_FACI";

/* ── 실제 API 응답 타입 ── */

export interface FacilityItem {
  row_num: number;
  faci_cd: string;           // 시설 고유코드
  faci_nm: string;           // 시설명
  ftype_nm: string;          // 시설유형 (수영장, 체육관 등)
  fcob_nm: string;           // 업종명 (수영장, 수영장업 등)
  faci_gb_nm: string;        // 시설구분 (공공, 신고 등)
  faci_stat_nm: string;      // 시설상태 (정상운영, 폐업 등)
  addr_ctpv_nm: string;      // 시도명
  cpb_nm: string;            // 시군구명
  addr_cpb_nm: string;       // 시군구 전체명
  addr_emd_nm?: string;      // 읍면동
  faci_addr: string;         // 지번주소
  faci_road_addr: string;    // 도로명주소
  faci_zip: string;          // 우편번호
  faci_lat: string;          // 위도
  faci_lot: string;          // 경도
  faci_tel_no?: string;      // 전화번호
  faci_gfa?: number;         // 연면적 (㎡)
  inout_gbn_nm: string;      // 실내외 (실내, 실외, 없음)
  nation_yn: string;         // 국가시설 여부
  faci_mng_type_cd?: string; // 관리유형 (자체운영, 위탁운영 등)
  fmng_type_gb_nm?: string;  // 관리주체 (지자체 등)
  atnm_chk_yn: string;       // 안전점검 여부 (Y/N)
  ssm_dsn_yn?: string;       // 체육시설 안전관리 (Y/N/X)
  base_ymd: string;          // 기준일
  updt_dt: string;           // 업데이트일
}

interface ApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      pageNo: number;
      totalCount: number;
      numOfRows: number;
      items: {
        item: FacilityItem | FacilityItem[];
      };
    };
  };
}

/* ── Fetcher ── */

export async function fetchSwimmingPools(
  page = 1,
  perPage = 1000
): Promise<{ items: FacilityItem[]; totalCount: number }> {
  const apiKey = process.env.PUBLIC_DATA_API_KEY!;
  const url =
    `${BASE}${ENDPOINT}?serviceKey=${apiKey}` +
    `&resultType=json` +
    `&pageNo=${page}` +
    `&numOfRows=${perPage}` +
    `&ftype_nm=${encodeURIComponent("수영장")}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse = await res.json();

  if (json.response.header.resultCode !== "00") {
    throw new Error(
      `API error: ${json.response.header.resultCode} — ${json.response.header.resultMsg}`
    );
  }

  const body = json.response.body;
  const rawItems = body.items?.item;

  const items: FacilityItem[] = rawItems
    ? Array.isArray(rawItems)
      ? rawItems
      : [rawItems]
    : [];

  return { items, totalCount: body.totalCount };
}
