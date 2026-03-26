"use client";

import { Heart, Briefcase, DollarSign, Palette, Gift, Lightbulb, RefreshCw } from "lucide-react";
import type { FortuneResult } from "@/lib/schemas";

interface FortuneResultProps {
  result: FortuneResult & {
    zodiac: { sign: string; emoji: string; englishName: string };
  };
  name: string;
  onReset: () => void;
}

function ScoreBar({ label, score, icon, color }: { label: string; score: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/70">
          {icon}
          {label}
        </div>
        <span className="text-sm font-bold text-white">{score}점</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function FortuneResult({ result, name, onReset }: FortuneResultProps) {
  const avgScore = Math.round((result.scores.love + result.scores.work + result.scores.money) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-yellow-400";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-blue-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "최상";
    if (score >= 75) return "좋음";
    if (score >= 55) return "보통";
    if (score >= 35) return "주의";
    return "조심";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 별자리 헤더 */}
      <div className="text-center py-4">
        <div className="text-6xl mb-2 animate-float inline-block">{result.zodiac.emoji}</div>
        <div className="text-white/50 text-sm">{result.zodiac.sign} · {result.zodiac.englishName}</div>
        <h2 className="text-xl font-bold text-white mt-1">
          {name}님의 오늘 운세
        </h2>
      </div>

      {/* 종합 점수 */}
      <div className="glass rounded-2xl p-5 text-center">
        <div className={`text-5xl font-black ${getScoreColor(avgScore)}`}>{avgScore}</div>
        <div className="text-white/50 text-sm mt-1">종합 운세 · <span className={`font-semibold ${getScoreColor(avgScore)}`}>{getScoreLabel(avgScore)}</span></div>
      </div>

      {/* 총평 */}
      <div className="glass rounded-2xl p-5">
        <p className="text-white/80 text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* 운세 점수 */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <ScoreBar
          label="연애운"
          score={result.scores.love}
          icon={<Heart size={14} className="text-pink-400" />}
          color="bg-gradient-to-r from-pink-500 to-rose-500"
        />
        <ScoreBar
          label="업무운"
          score={result.scores.work}
          icon={<Briefcase size={14} className="text-blue-400" />}
          color="bg-gradient-to-r from-blue-500 to-indigo-500"
        />
        <ScoreBar
          label="금전운"
          score={result.scores.money}
          icon={<DollarSign size={14} className="text-yellow-400" />}
          color="bg-gradient-to-r from-yellow-500 to-amber-500"
        />
      </div>

      {/* 행운 아이템 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <Palette size={20} className="text-purple-400 mx-auto mb-2" />
          <div className="text-white/50 text-xs mb-1">행운의 색</div>
          <div className="text-white font-semibold text-sm">{result.luckyColor}</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <Gift size={20} className="text-indigo-400 mx-auto mb-2" />
          <div className="text-white/50 text-xs mb-1">행운의 아이템</div>
          <div className="text-white font-semibold text-sm">{result.luckyItem}</div>
        </div>
      </div>

      {/* 오늘의 조언 */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold mb-2">
          <Lightbulb size={15} />
          오늘의 조언
        </div>
        <p className="text-white/80 text-sm italic">"{result.advice}"</p>
      </div>

      {/* 다시하기 버튼 */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl glass text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <RefreshCw size={15} />
        다시 보기
      </button>
    </div>
  );
}
