import Link from "next/link";
import { MapPin, Droplets, Shield, ChevronRight } from "lucide-react";
import type { Pool } from "@/lib/db/schema";
import { getMapTileUrl } from "@/lib/utils/map";

interface PoolCardProps {
  pool: Pool;
}

export default function PoolCard({ pool }: PoolCardProps) {
  const href = `/pools/${pool.sidoSlug}/${pool.sigunguSlug}/${pool.slug}`;
  const isPublic = pool.type === "public";

  const mapTileUrl =
    pool.lat && pool.lng
      ? getMapTileUrl(Number(pool.lat), Number(pool.lng), 15)
      : null;

  return (
    <Link href={href} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-ocean-200 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(10,122,255,0.08)]">
        {/* Thumbnail area */}
        <div className="relative h-36 sm:h-40 overflow-hidden">
          {/* Map tile background */}
          {mapTileUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mapTileUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover scale-[1.8] opacity-70 group-hover:scale-[1.9] transition-transform duration-700"
              />
              {/* Gradient overlay on map */}
              <div
                className={`absolute inset-0 ${
                  isPublic
                    ? "bg-gradient-to-b from-ocean-500/60 via-ocean-500/40 to-ocean-600/80"
                    : "bg-gradient-to-b from-aqua-500/60 via-aqua-500/40 to-ocean-600/80"
                }`}
              />
            </>
          ) : (
            /* Fallback gradient when no coordinates */
            <div
              className={`absolute inset-0 ${
                isPublic
                  ? "bg-gradient-to-br from-ocean-400 to-ocean-600"
                  : "bg-gradient-to-br from-aqua-400 to-ocean-500"
              }`}
            />
          )}

          {/* Wave pattern */}
          <div className="absolute inset-0 opacity-15">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 160"
              preserveAspectRatio="none"
            >
              <path
                d="M0 100 C100 60, 200 140, 300 100 S400 60, 400 100 V160 H0Z"
                fill="white"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* Center icon */}
          {!mapTileUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplets className="w-12 h-12 text-white/25 group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-white/90 text-[11px] font-semibold text-ocean-700 backdrop-blur-sm">
              {isPublic ? "공공" : "민간"}
            </span>
            {pool.indoor !== null && (
              <span className="px-2 py-0.5 rounded-md bg-white/90 text-[11px] font-semibold text-ocean-700 backdrop-blur-sm">
                {pool.indoor ? "실내" : "실외"}
              </span>
            )}
          </div>

          {pool.safetyGrade && (
            <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-[11px] font-semibold text-white backdrop-blur-sm">
              <Shield className="w-2.5 h-2.5" />
              {pool.safetyGrade}
            </div>
          )}

          {/* Bottom location tag */}
          {mapTileUrl && (
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm text-[11px] text-white/90">
                <MapPin className="w-2.5 h-2.5" />
                {pool.sigungu}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-[15px] font-semibold text-foreground truncate group-hover:text-ocean-600 transition-colors">
            {pool.name}
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {pool.sido} {pool.sigungu}
            </span>
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
            <div className="flex gap-2">
              {pool.poolArea && (
                <span className="text-[12px] text-muted-foreground">
                  {Number(pool.poolArea).toLocaleString()}㎡
                </span>
              )}
              {pool.laneCount && (
                <span className="text-[12px] text-muted-foreground">
                  {pool.laneCount}레인
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-ocean-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
