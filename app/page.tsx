"use client";

import { useState } from "react";
import FortuneForm from "@/components/FortuneForm";
import FortuneResult from "@/components/FortuneResult";
import type { FortuneResult as FortuneResultType } from "@/lib/schemas";

type ResultWithZodiac = FortuneResultType & {
  zodiac: { sign: string; emoji: string; englishName: string };
};

// 배경 별 위치 (고정값으로 hydration 오류 방지)
const STARS = [
  { top: "8%", left: "12%", size: 2, duration: "3s", delay: "0s" },
  { top: "15%", left: "85%", size: 1, duration: "4s", delay: "1s" },
  { top: "22%", left: "45%", size: 3, duration: "2.5s", delay: "0.5s" },
  { top: "35%", left: "72%", size: 1, duration: "5s", delay: "2s" },
  { top: "48%", left: "8%", size: 2, duration: "3.5s", delay: "1.5s" },
  { top: "55%", left: "92%", size: 1, duration: "4.5s", delay: "0.8s" },
  { top: "62%", left: "30%", size: 2, duration: "3s", delay: "2.5s" },
  { top: "75%", left: "65%", size: 1, duration: "4s", delay: "0.3s" },
  { top: "82%", left: "18%", size: 3, duration: "2s", delay: "1.8s" },
  { top: "90%", left: "80%", size: 1, duration: "5s", delay: "0.6s" },
  { top: "5%", left: "55%", size: 1, duration: "3.8s", delay: "1.2s" },
  { top: "30%", left: "22%", size: 2, duration: "4.2s", delay: "2.2s" },
];

export default function Home() {
  const [result, setResult] = useState<ResultWithZodiac | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (data: { name: string; gender: string; birthDate: string }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSubmittedName(data.name);

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, today }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "운세 생성 중 오류가 발생했습니다.");
      }

      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-start justify-center py-12 px-4">
      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0a2e] to-[#1a0a2e]" />

      {/* 배경 오브 */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-900/20 blur-3xl" />

      {/* 별들 */}
      <div className="fixed inset-0 pointer-events-none">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              "--duration": star.duration,
              "--delay": star.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float inline-block">✨</div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Astro<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Pulse</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">AI가 읽어주는 오늘의 별자리 운세</p>
        </div>

        {/* 카드 */}
        <div className="glass rounded-3xl p-6 glow-purple">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {result ? (
            <FortuneResult result={result} name={submittedName} onReset={handleReset} />
          ) : (
            <FortuneForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </div>

        {/* 푸터 */}
        <p className="text-center text-white/20 text-xs mt-6">
          하루 10회 조회 가능 · AI 생성 콘텐츠
        </p>
      </div>
    </main>
  );
}
