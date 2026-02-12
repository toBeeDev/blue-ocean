"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    const url = window.location.href;
    // 카카오톡 공유 — Kakao SDK 없이 모바일 scheme 활용
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
    window.open(kakaoUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        공유
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl bg-white border border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
            <button
              onClick={() => {
                handleCopyLink();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Link2 className="w-4 h-4 text-muted-foreground" />
              )}
              {copied ? "복사됨!" : "링크 복사"}
            </button>
            <button
              onClick={() => {
                handleKakaoShare();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors border-t border-border/40"
            >
              <MessageCircle className="w-4 h-4 text-[#FEE500]" />
              카카오스토리 공유
            </button>
          </div>
        </>
      )}
    </div>
  );
}
