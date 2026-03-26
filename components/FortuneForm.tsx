"use client";

import { useState } from "react";
import { Sparkles, User, Calendar, Users } from "lucide-react";

interface FortuneFormProps {
  onSubmit: (data: { name: string; gender: string; birthDate: string }) => void;
  isLoading: boolean;
}

export default function FortuneForm({ onSubmit, isLoading }: FortuneFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;
    onSubmit({ name: name.trim(), gender, birthDate });
  };

  const maxDate = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이름 입력 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-300">
          <User size={15} />
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          maxLength={20}
          required
          className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {/* 성별 선택 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-300">
          <Users size={15} />
          성별
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["female", "male", "other"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                gender === g
                  ? "bg-purple-600 text-white glow-purple"
                  : "glass text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {g === "female" ? "여성" : g === "male" ? "남성" : "기타"}
            </button>
          ))}
        </div>
      </div>

      {/* 생년월일 입력 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-300">
          <Calendar size={15} />
          생년월일
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          min={minDate}
          max={maxDate}
          required
          className="w-full px-4 py-3 rounded-xl glass text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
        />
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading || !name.trim() || !birthDate}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
          isLoading || !name.trim() || !birthDate
            ? "bg-purple-900/50 text-purple-300/50 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 glow-purple active:scale-95"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            별자리를 읽는 중...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            오늘의 운세 보기
          </>
        )}
      </button>
    </form>
  );
}
