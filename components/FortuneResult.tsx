"use client";

import { useEffect, useState } from "react";
import { Heart, Briefcase, DollarSign, Palette, Gift, Lightbulb, RefreshCw } from "lucide-react";
import type { FortuneResult } from "@/lib/schemas";

function useCountUp(target: number, duration = 1400, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return count;
}

interface ScoreBarProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  barGradient: string;
  glowColor: string;
  delay: number;
}

function ScoreBar({ label, score, icon, barGradient, glowColor, delay }: ScoreBarProps) {
  const [width, setWidth] = useState(0);
  const animatedScore = useCountUp(score, 1200, delay);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 80);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "rgba(240,235,227,0.6)" }}
        >
          {icon}
          {label}
        </div>
        <span
          className="font-cinzel text-sm font-bold tabular-nums"
          style={{ color: "var(--gold-bright)" }}
        >
          {animatedScore}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: barGradient,
            transition: "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: `0 0 10px ${glowColor}`,
          }}
        />
      </div>
    </div>
  );
}

interface FortuneResultProps {
  result: FortuneResult & { zodiac: { sign: string; emoji: string; englishName: string } };
  name: string;
  onReset: () => void;
}

export default function FortuneResult({ result, name, onReset }: FortuneResultProps) {
  const avg = Math.round((result.scores.love + result.scores.work + result.scores.money) / 3);
  const animatedAvg = useCountUp(avg, 1800, 350);

  const scoreColor = (s: number) => {
    if (s >= 80) return "#F0D090";
    if (s >= 60) return "#86EFAC";
    if (s >= 40) return "#93C5FD";
    return "#FDA4AF";
  };

  const scoreLabel = (s: number) => {
    if (s >= 90) return "최상";
    if (s >= 75) return "좋음";
    if (s >= 55) return "보통";
    if (s >= 35) return "주의";
    return "조심";
  };

  return (
    <div className="space-y-4">
      {/* Zodiac header */}
      <div className="text-center py-3 animate-fade-up">
        <div
          className="text-7xl mb-3 inline-block animate-zodiac-reveal"
          style={{
            filter: "drop-shadow(0 0 24px rgba(200,170,126,0.55)) drop-shadow(0 0 60px rgba(157,78,221,0.3))",
          }}
        >
          {result.zodiac.emoji}
        </div>
        <div
          className="font-cinzel text-xs tracking-[0.35em] uppercase mb-1.5"
          style={{ color: "var(--gold-dim)" }}
        >
          {result.zodiac.englishName}
        </div>
        <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
          {result.zodiac.sign}
        </div>
        <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
          {name}님의 오늘 운세
        </h2>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span style={{ color: "var(--gold-dim)", fontSize: "0.55rem" }}>✦</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* Total score */}
      <div
        className="glass rounded-2xl p-5 text-center animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div
          className="font-cinzel text-6xl font-black tabular-nums"
          style={{ color: scoreColor(avg) }}
        >
          {animatedAvg}
        </div>
        <div
          className="font-cinzel text-xs mt-2 tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          종합 운세 &nbsp;&middot;&nbsp;
          <span style={{ color: scoreColor(avg), fontWeight: 700 }}>{scoreLabel(avg)}</span>
        </div>
      </div>

      {/* Summary */}
      <div
        className="glass rounded-2xl p-5 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "rgba(240,235,227,0.75)" }}>
          {result.summary}
        </p>
      </div>

      {/* Scores */}
      <div
        className="glass rounded-2xl p-5 space-y-4 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <ScoreBar
          label="연애운"
          score={result.scores.love}
          icon={<Heart size={13} style={{ color: "#F472B6" }} />}
          barGradient="linear-gradient(90deg, #EC4899, #F9A8D4)"
          glowColor="rgba(244,114,182,0.5)"
          delay={360}
        />
        <ScoreBar
          label="업무운"
          score={result.scores.work}
          icon={<Briefcase size={13} style={{ color: "#60A5FA" }} />}
          barGradient="linear-gradient(90deg, #3B82F6, #93C5FD)"
          glowColor="rgba(96,165,250,0.5)"
          delay={520}
        />
        <ScoreBar
          label="금전운"
          score={result.scores.money}
          icon={<DollarSign size={13} style={{ color: "#FBB847" }} />}
          barGradient="linear-gradient(90deg, #F59E0B, #FDE68A)"
          glowColor="rgba(251,184,71,0.5)"
          delay={680}
        />
      </div>

      {/* Lucky items */}
      <div
        className="grid grid-cols-2 gap-3 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="glass rounded-2xl p-4 text-center">
          <Palette
            size={18}
            className="mx-auto mb-2"
            style={{ color: "var(--violet-light)" }}
          />
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            행운의 색
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {result.luckyColor}
          </div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Gift
            size={18}
            className="mx-auto mb-2"
            style={{ color: "var(--gold)" }}
          />
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            행운의 아이템
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {result.luckyItem}
          </div>
        </div>
      </div>

      {/* Advice */}
      <div
        className="glass rounded-2xl p-5 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase mb-3"
          style={{ color: "var(--gold)" }}
        >
          <Lightbulb size={12} />
          오늘의 조언
        </div>
        <p className="text-sm italic" style={{ color: "rgba(240,235,227,0.78)" }}>
          &ldquo;{result.advice}&rdquo;
        </p>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="btn-cosmic-sweep w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 animate-fade-up"
        style={{
          animationDelay: "0.35s",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border-hover)";
          el.style.color = "var(--text)";
          el.style.background = "rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.color = "var(--text-muted)";
          el.style.background = "rgba(255,255,255,0.03)";
        }}
      >
        <RefreshCw size={13} />
        <span className="font-cinzel tracking-wider text-xs">다시 보기</span>
      </button>
    </div>
  );
}
