import { db } from "@/lib/db";
import { pools } from "@/lib/db/schema";
import { eq, and, ne, desc } from "drizzle-orm";
import {
  MapPin,
  Phone,
  Globe,
  Shield,
  Ruler,
  Waves,
  Building2,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Navigation,
  Map,
  Droplets,
  SquareArrowOutUpRight,
  Copy,
  Info,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PoolCard from "@/components/pool/PoolCard";
import ShareButton from "@/components/pool/ShareButton";
import { buildPoolJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { getMapTileGrid } from "@/lib/utils/map";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ sido: string; sigungu: string; slug: string }>;
}

async function getPool(slug: string) {
  return db.query.pools.findFirst({
    where: eq(pools.slug, slug),
    with: {
      schedules: true,
      prices: true,
      reviews: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pool = await getPool(slug);
  if (!pool) return { title: "수영장을 찾을 수 없습니다" };

  const description = `${pool.sido} ${pool.sigungu} ${pool.name}. ${pool.indoor ? "실내" : "실외"} ${pool.type === "public" ? "공공" : "민간"} 수영장. 주소, 시설 정보, 자유수영 시간표를 확인하세요.`;

  return {
    title: `${pool.name} — 블루오션`,
    description,
    openGraph: {
      title: `${pool.name} — 블루오션`,
      description,
      type: "website",
      locale: "ko_KR",
    },
  };
}

export default async function PoolDetailPage({ params }: Props) {
  const { sido: sidoSlug, sigungu: sigunguSlug, slug } = await params;
  const pool = await getPool(slug);

  if (!pool) notFound();

  const shortSido = pool.sido.replace(
    /특별시|광역시|특별자치시|특별자치도|도$/g,
    ""
  );

  const nearbyPools = await db.query.pools.findMany({
    where: and(
      eq(pools.sidoSlug, sidoSlug),
      eq(pools.sigunguSlug, sigunguSlug),
      eq(pools.isOperating, true),
      ne(pools.id, pool.id)
    ),
    orderBy: [desc(pools.updatedAt)],
    limit: 4,
  });

  // JSON-LD
  const baseUrl = "https://blueoc.cloud";
  const pageUrl = `${baseUrl}/pools/${sidoSlug}/${sigunguSlug}/${slug}`;

  const poolJsonLd = buildPoolJsonLd(pool, pageUrl);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "전국 수영장", href: "/pools" },
      { name: shortSido, href: `/pools/${sidoSlug}` },
      { name: pool.sigungu, href: `/pools/${sidoSlug}/${sigunguSlug}` },
      { name: pool.name, href: `/pools/${sidoSlug}/${sigunguSlug}/${slug}` },
    ],
    baseUrl
  );

  // 지도 링크
  const kakaoMapUrl =
    pool.lat && pool.lng
      ? `https://map.kakao.com/link/map/${encodeURIComponent(pool.name)},${pool.lat},${pool.lng}`
      : null;
  const naverMapUrl =
    pool.lat && pool.lng
      ? `https://map.naver.com/p/search/${encodeURIComponent(pool.name)}?c=${pool.lng},${pool.lat},15,0,0,0,dh`
      : `https://map.naver.com/p/search/${encodeURIComponent(pool.name)}`;

  const isPublic = pool.type === "public";

  // 시설 정보 리스트 (값이 있는 것만)
  const facilityDetails = [
    { label: "유형", value: isPublic ? "공공 체육시설" : "민간 체육시설" },
    pool.indoor !== null && {
      label: "실내/외",
      value: pool.indoor ? "실내 수영장" : "실외 수영장",
    },
    pool.poolArea && {
      label: "시설 면적",
      value: `${Number(pool.poolArea).toLocaleString()}㎡`,
    },
    pool.laneCount && {
      label: "레인 수",
      value: `${pool.laneCount}레인`,
    },
    pool.poolLength && {
      label: "수영장 길이",
      value: `${pool.poolLength}m`,
    },
    pool.safetyGrade && {
      label: "안전점검 등급",
      value: pool.safetyGrade,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(poolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#f8fafb]">
        {/* ═══════════════════════════════════════
            HERO — immersive gradient header
        ═══════════════════════════════════════ */}
        <section className="relative pt-20 overflow-hidden">
          {/* Gradient background — aquatic palette */}
          <div
            className={`absolute inset-0 ${
              isPublic
                ? "bg-gradient-to-br from-ocean-600 via-ocean-500 to-aqua-600"
                : "bg-gradient-to-br from-aqua-600 via-ocean-500 to-ocean-600"
            }`}
          />

          {/* Layered wave patterns for depth */}
          <div className="absolute inset-0 opacity-[0.07]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1440 400"
              preserveAspectRatio="none"
              className="absolute bottom-0"
            >
              <path
                d="M0 280 C240 220, 480 340, 720 280 S1200 220, 1440 280 V400 H0Z"
                fill="white"
              />
              <path
                d="M0 320 C360 260, 600 380, 960 320 S1320 260, 1440 320 V400 H0Z"
                fill="white"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Floating orbs */}
          <div className="absolute top-16 right-[10%] w-64 h-64 rounded-full bg-white/[0.04] blur-[80px]" />
          <div className="absolute bottom-8 left-[5%] w-48 h-48 rounded-full bg-aqua-300/[0.08] blur-[60px]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pb-24 pt-8 sm:pt-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-8 flex-wrap">
              <Link
                href="/pools"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                전국
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/pools/${sidoSlug}`}
                className="hover:text-white transition-colors"
              >
                {shortSido}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/pools/${sidoSlug}/${sigunguSlug}`}
                className="hover:text-white transition-colors"
              >
                {pool.sigungu}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90 font-medium">{pool.name}</span>
            </nav>

            {/* Pool icon + badges */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white/80" />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/10">
                  {isPublic ? "공공" : "민간"}
                </span>
                {pool.indoor !== null && (
                  <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/10">
                    {pool.indoor ? "실내" : "실외"}
                  </span>
                )}
                {pool.safetyGrade && (
                  <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-400/20 text-emerald-100 backdrop-blur-sm border border-emerald-400/20 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {pool.safetyGrade}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {pool.name}
            </h1>

            {/* Address */}
            <p className="mt-3 text-white/70 flex items-center gap-2 text-[15px]">
              <MapPin className="w-4 h-4 shrink-0 text-white/50" />
              {pool.address || `${pool.sido} ${pool.sigungu}`}
            </p>
          </div>

          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 48"
              fill="none"
              className="w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 48h1440V24C1200 0 960 40 720 24S240 0 0 24v24Z"
                fill="#f8fafb"
              />
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FLOATING ACTION BAR
        ═══════════════════════════════════════ */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* 전화 */}
              {pool.phone && (
                <a
                  href={`tel:${pool.phone}`}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-ocean-500 text-white text-sm font-semibold hover:bg-ocean-600 transition-all duration-200 shadow-[0_2px_12px_rgba(10,122,255,0.3)] hover:shadow-[0_4px_20px_rgba(10,122,255,0.4)]"
                >
                  <Phone className="w-4 h-4" />
                  전화하기
                  <span className="text-white/60 text-[13px] font-normal hidden sm:inline">
                    {pool.phone}
                  </span>
                </a>
              )}

              {/* 길찾기 */}
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#03C75A] text-white text-sm font-semibold hover:bg-[#02b351] transition-colors"
              >
                <Navigation className="w-4 h-4" />
                네이버 길찾기
              </a>

              {kakaoMapUrl && (
                <a
                  href={kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FEE500] text-[#3C1E1E] text-sm font-semibold hover:bg-[#FDD835] transition-colors"
                >
                  <Map className="w-4 h-4" />
                  카카오맵
                </a>
              )}

              {/* 홈페이지 */}
              {pool.website && (
                <a
                  href={pool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  홈페이지
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              )}

              {/* 공유 — 오른쪽으로 밀기 */}
              <div className="sm:ml-auto">
                <ShareButton
                  title={pool.name}
                  description={`${pool.sido} ${pool.sigungu} ${pool.name}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════ */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ── Left column: main content ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* 시설 정보 */}
              <section className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.03] p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center">
                    <Info className="w-4 h-4 text-ocean-500" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    시설 정보
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facilityDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#f8fafb] border border-black/[0.02]"
                    >
                      <span className="text-[13px] text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-[14px] font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 위치 */}
              <section className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.03] p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-ocean-500" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">위치</h2>
                </div>

                {/* 주소 행 */}
                <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-[#f8fafb] border border-black/[0.02]">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-foreground leading-relaxed">
                      {pool.address || `${pool.sido} ${pool.sigungu}`}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      {pool.sido} {pool.sigungu}
                    </p>
                  </div>
                </div>

                {/* 지도 타일 */}
                {pool.lat && pool.lng && (
                  <div className="relative rounded-xl overflow-hidden border border-black/[0.04]">
                    {/* 2x2 OSM tile grid */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                        {getMapTileGrid(Number(pool.lat), Number(pool.lng), 15).map(
                          (tile) => (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              key={`${tile.col}-${tile.row}`}
                              src={tile.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )
                        )}
                      </div>

                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 pointer-events-none" />

                      {/* Center pin */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-ocean-500 shadow-[0_4px_20px_rgba(10,122,255,0.4)] flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        {kakaoMapUrl && (
                          <a
                            href={kakaoMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-white/95 text-ocean-600 hover:bg-white transition-colors shadow-sm border border-ocean-100/60"
                          >
                            카카오맵
                            <SquareArrowOutUpRight className="w-3 h-3" />
                          </a>
                        )}
                        <a
                          href={naverMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold bg-white/95 text-[#03C75A] hover:bg-white transition-colors shadow-sm border border-emerald-100/60"
                        >
                          네이버지도
                          <SquareArrowOutUpRight className="w-3 h-3" />
                        </a>
                      </div>

                      {/* OSM attribution */}
                      <div className="absolute top-2 right-2">
                        <span className="text-[9px] text-black/40 bg-white/70 px-1.5 py-0.5 rounded">
                          © OpenStreetMap
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ── Right column: sidebar ── */}
            <div className="space-y-6">
              {/* 연락처 카드 */}
              <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.03] p-6">
                <h3 className="text-[15px] font-bold text-foreground mb-5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-ocean-500" />
                  연락처
                </h3>
                <div className="space-y-4">
                  {pool.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ocean-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-ocean-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-muted-foreground">
                          전화번호
                        </p>
                        <a
                          href={`tel:${pool.phone}`}
                          className="text-[14px] font-medium text-ocean-600 hover:underline"
                        >
                          {pool.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {pool.website && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ocean-50 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-ocean-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-muted-foreground">
                          홈페이지
                        </p>
                        <a
                          href={pool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-medium text-ocean-600 hover:underline truncate block"
                        >
                          {pool.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}

                  {pool.address && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ocean-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-ocean-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-muted-foreground">
                          주소
                        </p>
                        <p className="text-[14px] text-foreground leading-snug">
                          {pool.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {!pool.phone && !pool.website && (
                    <p className="text-[13px] text-muted-foreground">
                      등록된 연락처 정보가 없습니다.
                    </p>
                  )}
                </div>
              </div>

              {/* 길찾기 카드 */}
              <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.03] p-6">
                <h3 className="text-[15px] font-bold text-foreground mb-5 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-ocean-500" />
                  길찾기
                </h3>
                <div className="space-y-2.5">
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-[#f8fafb] hover:bg-[#03C75A]/[0.06] border border-transparent hover:border-[#03C75A]/20 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#03C75A] flex items-center justify-center shadow-sm">
                      <Navigation className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-foreground">
                        네이버지도
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        길찾기 · 주변 정보
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-[#03C75A] transition-colors" />
                  </a>

                  {kakaoMapUrl && (
                    <a
                      href={kakaoMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-[#f8fafb] hover:bg-[#FEE500]/[0.12] border border-transparent hover:border-[#FEE500]/40 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FEE500] flex items-center justify-center shadow-sm">
                        <Map className="w-4.5 h-4.5 text-[#3C1E1E]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-foreground">
                          카카오맵
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          지도에서 보기
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-[#FDD835] transition-colors" />
                    </a>
                  )}
                </div>
              </div>

              {/* 데이터 출처 */}
              <div className="rounded-2xl bg-[#f8fafb] border border-black/[0.03] p-5">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      데이터 출처: 공공데이터포털
                      <br />
                      (전국 공공·민간 체육시설 현황 정보)
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-2">
                      마지막 업데이트:{" "}
                      {pool.updatedAt
                        ? new Date(pool.updatedAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              NEARBY POOLS
          ═══════════════════════════════════════ */}
          {nearbyPools.length > 0 && (
            <section className="mt-14">
              <div className="flex items-end justify-between mb-7">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Waves className="w-4 h-4 text-ocean-500" />
                    <span className="text-[12px] font-semibold text-ocean-500 uppercase tracking-wider">
                      Nearby
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {pool.sigungu} 다른 수영장
                  </h2>
                </div>
                <Link
                  href={`/pools/${sidoSlug}/${sigunguSlug}`}
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-ocean-500 hover:text-ocean-600 transition-colors"
                >
                  전체 보기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {nearbyPools.map((p) => (
                  <PoolCard key={p.id} pool={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
