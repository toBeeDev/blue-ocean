"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchInputProps {
  defaultValue: string;
}

export default function SearchInput({ defaultValue }: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative flex items-center bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] transition-all duration-300 focus-within:shadow-[0_4px_32px_rgba(10,122,255,0.1),0_0_0_1px_rgba(10,122,255,0.08)]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="수영장 이름, 지역으로 검색"
        className="flex-1 px-5 py-4 text-[15px] bg-transparent outline-none placeholder:text-muted-foreground/60 rounded-l-2xl"
        autoFocus
      />
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 m-2 px-5 py-2.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-semibold transition-all duration-200 shadow-[0_2px_12px_rgba(10,122,255,0.35)]"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">검색</span>
      </button>
    </div>
  );
}
