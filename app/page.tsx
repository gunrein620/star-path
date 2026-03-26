"use client";

import { useState, useRef, useEffect } from "react";
import FortuneForm from "@/components/FortuneForm";
import FortuneResult from "@/components/FortuneResult";
import StarCanvas from "@/components/StarCanvas";
import type { FortuneResult as FortuneResultType } from "@/lib/schemas";

type ResultWithZodiac = FortuneResultType & {
  zodiac: { sign: string; emoji: string; englishName: string };
};

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.closest("button, input, a, [role='button'], select");
      dot.classList.toggle("hovered", !!isInteractive);
      ring.classList.toggle("hovered", !!isInteractive);
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

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
      {/* Canvas: twinkling stars + mouse sparkle trail */}
      <StarCanvas />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Nebula background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div
          className="nebula-1 absolute"
          style={{
            top: "5%", left: "10%",
            width: 700, height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(157,78,221,0.16) 0%, transparent 68%)",
          }}
        />
        <div
          className="nebula-2 absolute"
          style={{
            bottom: "10%", right: "5%",
            width: 550, height: 550,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(80,40,200,0.14) 0%, transparent 68%)",
          }}
        />
        <div
          className="nebula-3 absolute"
          style={{
            top: "45%", left: "55%",
            width: 480, height: 480,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(200,170,126,0.07) 0%, transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(4,5,15,0.4) 0%, transparent 30%, transparent 70%, rgba(4,5,15,0.6) 100%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="text-center mb-9 animate-fade-up">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div
              style={{
                height: 1,
                width: 60,
                background: "linear-gradient(to right, transparent, var(--gold-dim))",
              }}
            />
            <span
              className="font-cinzel text-xs tracking-[0.35em] uppercase"
              style={{ color: "rgba(200,170,126,0.55)" }}
            >
              Celestial Oracle
            </span>
            <div
              style={{
                height: 1,
                width: 60,
                background: "linear-gradient(to left, transparent, var(--gold-dim))",
              }}
            />
          </div>

          <h1 className="font-cinzel text-5xl font-black tracking-widest mb-4">
            <span className="text-shimmer">AstroPulse</span>
          </h1>

          <div className="flex items-center justify-center gap-1.5 mb-4">
            {["✦", "✦", "✦", "✦", "✦"].map((s, i) => (
              <span
                key={i}
                className={i === 2 ? "animate-float inline-block" : ""}
                style={{
                  color: "var(--gold-dim)",
                  fontSize: i === 2 ? "1.1rem" : "0.6rem",
                  opacity: i === 2 ? 1 : 0.5 + Math.abs(i - 2) * 0.1,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <p
            className="font-cinzel text-xs tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            AI가 읽어주는 오늘의 별자리 운세
          </p>
        </div>

        {/* Main card */}
        <div
          className="card-cosmic rounded-3xl p-7 animate-fade-up"
          style={{ animationDelay: "0.12s" }}
        >
          {/* Corner decorations */}
          <div style={{ position: "absolute", top: 14, left: 14, width: 18, height: 18, borderTop: "1px solid var(--gold-dim)", borderLeft: "1px solid var(--gold-dim)" }} />
          <div style={{ position: "absolute", top: 14, right: 14, width: 18, height: 18, borderTop: "1px solid var(--gold-dim)", borderRight: "1px solid var(--gold-dim)" }} />
          <div style={{ position: "absolute", bottom: 14, left: 14, width: 18, height: 18, borderBottom: "1px solid var(--gold-dim)", borderLeft: "1px solid var(--gold-dim)" }} />
          <div style={{ position: "absolute", bottom: 14, right: 14, width: 18, height: 18, borderBottom: "1px solid var(--gold-dim)", borderRight: "1px solid var(--gold-dim)" }} />

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.22)",
                color: "#FCA5A5",
              }}
            >
              {error}
            </div>
          )}

          {result ? (
            <FortuneResult result={result} name={submittedName} onReset={handleReset} />
          ) : (
            <FortuneForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6 font-cinzel tracking-widest animate-fade-up"
          style={{ color: "rgba(240,235,227,0.2)", animationDelay: "0.22s" }}
        >
          하루 10회 조회 가능 &nbsp;·&nbsp; AI 생성 콘텐츠
        </p>
      </div>
    </main>
  );
}
