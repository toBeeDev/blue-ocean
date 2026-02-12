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
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PoolCard from "@/components/pool/PoolCard";
import ShareButton from "@/components/pool/ShareButton";
import { buildPoolJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
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

  const desc = `${pool.sido} ${pool.sigungu} ${pool.name}. ${pool.indoor ? "실내" : "실외"} ${pool.type === "public" ? "공공" : "민간"} 수영장. 주소, 시설 정보, 자유수영 시간표를 확인하세요.`;

  return {
    title: `${pool.name} — 블루오션`,
    description: desc,
    openGraph: {
      title: `${pool.name} — 블루오션`,
      description: desc,
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

  // 같은 시군구의 다른 수영장
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

  const infoItems = [
    {
      icon: Building2,
      label: "유형",
      value: `${pool.type === "public" ? "공공" : "민간"}${pool.indoor !== null ? (pool.indoor ? " · 실내" : " · 실외") : ""}`,
    },
    pool.poolArea && {
      icon: Ruler,
      label: "면적",
      value: `${Number(pool.poolArea).toLocaleString()}㎡`,
    },
    pool.laneCount && {
      icon: Waves,
      label: "레인",
      value: `${pool.laneCount}레인`,
    },
    pool.poolLength && {
      icon: Ruler,
      label: "길이",
      value: `${pool.poolLength}m`,
    },
    pool.safetyGrade && {
      icon: Shield,
      label: "안전점검",
      value: pool.safetyGrade,
    },
  ].filter(Boolean) as { icon: typeof Building2; label: string; value: string }[];

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

      <div className="min-h-screen pt-20 pb-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-ocean-50 to-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
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
              <Link
                href={`/pools/${sidoSlug}/${sigunguSlug}`}
                className="hover:text-ocean-500 transition-colors"
              >
                {pool.sigungu}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{pool.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-ocean-50 text-[13px] font-semibold text-ocean-600 border border-ocean-100">
                    {pool.type === "public" ? "공공" : "민간"}
                  </span>
                  {pool.indoor !== null && (
                    <span className="px-2.5 py-1 rounded-lg bg-muted text-[13px] font-medium text-muted-foreground">
                      {pool.indoor ? "실내" : "실외"}
                    </span>
                  )}
                  {pool.safetyGrade && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[13px] font-semibold text-emerald-600 border border-emerald-100 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {pool.safetyGrade}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {pool.name}
                </h1>

                <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ocean-500 shrink-0" />
                  {pool.address || `${pool.sido} ${pool.sigungu}`}
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {pool.phone && (
                  <a
                    href={`tel:${pool.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-500 text-white text-sm font-semibold hover:bg-ocean-600 transition-colors shadow-[0_2px_12px_rgba(10,122,255,0.3)]"
                  >
                    <Phone className="w-4 h-4" />
                    전화하기
                  </a>
                )}
                {pool.website && (
                  <a
                    href={pool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    홈페이지
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                )}
                <ShareButton
                  title={pool.name}
                  description={`${pool.sido} ${pool.sigungu} ${pool.name}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Facility Info */}
              <section className="rounded-2xl border border-border/60 bg-white p-6">
                <h2 className="text-lg font-bold text-foreground mb-5">
                  시설 정보
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
                    >
                      <div className="w-9 h-9 rounded-lg bg-ocean-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-ocean-500" />
                      </div>
                      <div>
                        <p className="text-[12px] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Map + Map Links */}
              {pool.lat && pool.lng && (
                <section className="rounded-2xl border border-border/60 bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground">위치</h2>
                    <div className="flex gap-2">
                      {kakaoMapUrl && (
                        <a
                          href={kakaoMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835] transition-colors"
                        >
                          <Map className="w-3.5 h-3.5" />
                          카카오맵
                        </a>
                      )}
                      <a
                        href={naverMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        네이버지도
                      </a>
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/30 h-64 sm:h-80 flex items-center justify-center border border-border/40 overflow-hidden">
                    {/* 정적 지도 이미지 placeholder */}
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-ocean-300" />
                      <p className="text-sm text-muted-foreground">
                        {pool.address}
                      </p>
                      <div className="flex justify-center gap-2 mt-3">
                        {kakaoMapUrl && (
                          <a
                            href={kakaoMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-ocean-500 hover:underline"
                          >
                            카카오맵에서 보기 &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact */}
              <div className="rounded-2xl border border-border/60 bg-white p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  연락처 & 위치
                </h3>
                <div className="space-y-3">
                  {pool.address && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pool.address}
                      </p>
                    </div>
                  )}
                  {pool.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${pool.phone}`}
                        className="text-sm text-ocean-500 hover:underline"
                      >
                        {pool.phone}
                      </a>
                    </div>
                  )}
                  {pool.website && (
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a
                        href={pool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ocean-500 hover:underline truncate"
                      >
                        {pool.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Map quick links */}
              <div className="rounded-2xl border border-border/60 bg-white p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  길찾기
                </h3>
                <div className="space-y-2">
                  {kakaoMapUrl && (
                    <a
                      href={kakaoMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FEE500] flex items-center justify-center">
                        <Map className="w-4 h-4 text-[#3C1E1E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          카카오맵
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          지도에서 보기
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
                    </a>
                  )}
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#03C75A] flex items-center justify-center">
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        네이버지도
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        길찾기
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
                  </a>
                </div>
              </div>

              {/* Data source */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                <p className="text-[12px] text-muted-foreground">
                  데이터 출처: 공공데이터포털 (전국체육시설 정보)
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  마지막 업데이트:{" "}
                  {pool.updatedAt
                    ? new Date(pool.updatedAt).toLocaleDateString("ko-KR")
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Nearby Pools */}
          {nearbyPools.length > 0 && (
            <section className="mt-16">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {pool.sigungu} 다른 수영장
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    근처에 있는 수영장을 둘러보세요
                  </p>
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
