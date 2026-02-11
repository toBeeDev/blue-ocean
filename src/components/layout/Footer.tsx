import Link from "next/link";

const FOOTER_LINKS = {
  서비스: [
    { label: "수영장 찾기", href: "/pools" },
    { label: "자유수영 시간표", href: "/free-swim" },
    { label: "내 주변 수영장", href: "/near-me" },
    { label: "수영장 비교", href: "/compare" },
    { label: "지도", href: "/map" },
  ],
  가이드: [
    { label: "수영 시작하기", href: "/guide/beginner/getting-started" },
    { label: "영법 가이드", href: "/guide/stroke" },
    { label: "수영용품 추천", href: "/guide/gear" },
  ],
  지역별: [
    { label: "서울 수영장", href: "/pools/seoul" },
    { label: "경기 수영장", href: "/pools/gyeonggi" },
    { label: "부산 수영장", href: "/pools/busan" },
    { label: "인천 수영장", href: "/pools/incheon" },
    { label: "대전 수영장", href: "/pools/daejeon" },
  ],
  정보: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "문의하기", href: "/contact" },
    { label: "데이터 출처", href: "/data-sources" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 sm:py-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-ocean-500 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ocean-500 to-aqua-500 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-5 h-5" fill="none">
                <path
                  d="M8 20c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">
              블루오션
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            공공데이터포털 제공 데이터를 활용합니다. &copy;{" "}
            {new Date().getFullYear()} BlueOcean. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
