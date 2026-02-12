import type { Pool } from "@/lib/db/schema";

/**
 * 수영장 상세 페이지용 JSON-LD (LocalBusiness + SportsActivityLocation)
 */
export function buildPoolJsonLd(pool: Pool, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    name: pool.name,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: pool.address || undefined,
      addressLocality: pool.sigungu,
      addressRegion: pool.sido,
      addressCountry: "KR",
    },
    geo:
      pool.lat && pool.lng
        ? {
            "@type": "GeoCoordinates",
            latitude: Number(pool.lat),
            longitude: Number(pool.lng),
          }
        : undefined,
    telephone: pool.phone || undefined,
    publicAccess: pool.type === "public",
    isAccessibleForFree: false,
  };
}

/**
 * BreadcrumbList JSON-LD
 */
export function buildBreadcrumbJsonLd(
  items: { name: string; href: string }[],
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };
}
