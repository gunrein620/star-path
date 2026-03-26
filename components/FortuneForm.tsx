"use client";

import { useState, useMemo } from "react";
import { User, Users, ChevronDown } from "lucide-react";

interface FortuneFormProps {
  onSubmit: (data: { name: string; gender: string; birthDate: string }) => void;
  isLoading: boolean;
}

const GENDERS = [
  { value: "female" as const, label: "여성", symbol: "♀" },
  { value: "male" as const, label: "남성", symbol: "♂" },
  { value: "other" as const, label: "기타", symbol: "◎" },
];

const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1923 }, (_, i) => CURRENT_YEAR - i);

function getDaysInMonth(year: number, month: number) {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

interface CosmicSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

function CosmicSelect({ value, onChange, options, placeholder }: CosmicSelectProps) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none py-3.5 px-4 pr-9 rounded-xl text-sm transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(200,170,126,0.14)",
          color: value ? "var(--text)" : "rgba(240,235,227,0.25)",
          outline: "none",
          cursor: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(200,170,126,0.58)";
          e.currentTarget.style.background = "rgba(255,255,255,0.065)";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(200,170,126,0.1), 0 0 25px rgba(200,170,126,0.07)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(200,170,126,0.14)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <option value="" disabled style={{ background: "#0a0520", color: "rgba(240,235,227,0.4)" }}>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#0a0520", color: "#F0EBE3" }}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--gold-dim)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function FortuneForm({ onSubmit, isLoading }: FortuneFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const daysInMonth = useMemo(
    () => getDaysInMonth(Number(year), Number(month)),
    [year, month]
  );

  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}일`,
      })),
    [daysInMonth]
  );

  // If selected day exceeds new daysInMonth, reset day
  const safeDay = day && Number(day) > daysInMonth ? "" : day;

  const birthDate =
    year && month && safeDay
      ? `${year}-${month.padStart(2, "0")}-${safeDay.padStart(2, "0")}`
      : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;
    onSubmit({ name: name.trim(), gender, birthDate });
  };

  const genderIndex = GENDERS.findIndex((g) => g.value === gender);
  const canSubmit = !isLoading && name.trim() && birthDate;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Name */}
      <div className="space-y-2.5 animate-fade-up">
        <label
          className="flex items-center gap-2 font-cinzel text-xs tracking-[0.28em] uppercase"
          style={{ color: "var(--gold-dim)" }}
        >
          <User size={11} />
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          maxLength={20}
          required
          className="input-cosmic w-full px-4 py-3.5 rounded-xl text-sm"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2.5 animate-fade-up" style={{ animationDelay: "0.06s" }}>
        <label
          className="flex items-center gap-2 font-cinzel text-xs tracking-[0.28em] uppercase"
          style={{ color: "var(--gold-dim)" }}
        >
          <Users size={11} />
          성별
        </label>
        <div
          className="relative grid grid-cols-3 rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,170,126,0.13)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "33.33%",
              left: `${genderIndex * 33.33}%`,
              transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              background: "linear-gradient(135deg, rgba(157,78,221,0.32), rgba(200,170,126,0.18))",
              border: "1px solid rgba(200,170,126,0.32)",
              borderRadius: "0.75rem",
              boxShadow: "0 0 18px rgba(157,78,221,0.2)",
            }}
          />
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGender(g.value)}
              className="relative py-3 text-sm font-medium transition-colors duration-200"
              style={{
                color: gender === g.value ? "var(--text)" : "var(--text-muted)",
                zIndex: 1,
              }}
            >
              <span className="mr-1 text-xs opacity-70">{g.symbol}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Birth date — three custom selects */}
      <div className="space-y-2.5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
        <label
          className="flex items-center gap-2 font-cinzel text-xs tracking-[0.28em] uppercase"
          style={{ color: "var(--gold-dim)" }}
        >
          <span style={{ fontSize: "0.65rem" }}>✦</span>
          생년월일
        </label>

        <div className="flex gap-2">
          {/* Year */}
          <CosmicSelect
            value={year}
            onChange={setYear}
            placeholder="년도"
            options={YEARS.map((y) => ({ value: String(y), label: `${y}년` }))}
          />

          {/* Month */}
          <CosmicSelect
            value={month}
            onChange={setMonth}
            placeholder="월"
            options={MONTHS.map((label, i) => ({ value: String(i + 1), label }))}
          />

          {/* Day */}
          <CosmicSelect
            value={safeDay}
            onChange={setDay}
            placeholder="일"
            options={dayOptions}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "0.18s" }}>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span style={{ color: "var(--gold-dim)", fontSize: "0.6rem" }}>✦</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* Submit button */}
      <div className="animate-fade-up" style={{ animationDelay: "0.22s" }}>
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-cosmic-sweep w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300"
          style={
            canSubmit
              ? {
                  background: "linear-gradient(135deg, #5B21B6 0%, #9D4EDD 50%, #6D28D9 100%)",
                  color: "#F0EBE3",
                  border: "1px solid rgba(200,170,126,0.28)",
                  boxShadow: "0 0 35px rgba(157,78,221,0.28), 0 4px 24px rgba(0,0,0,0.45)",
                  transform: "translateY(0)",
                }
              : {
                  background: "rgba(80,40,130,0.25)",
                  color: "rgba(240,235,227,0.28)",
                  border: "1px solid rgba(200,170,126,0.08)",
                  cursor: "not-allowed",
                }
          }
          onMouseEnter={(e) => {
            if (!canSubmit) return;
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 50px rgba(157,78,221,0.4), 0 8px 32px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            if (!canSubmit) return;
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 35px rgba(157,78,221,0.28), 0 4px 24px rgba(0,0,0,0.45)";
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-4">
              <div className="relative flex-shrink-0" style={{ width: 22, height: 22 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "1px solid rgba(200,170,126,0.22)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    animation: "star-spin 1.3s linear infinite",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--gold-bright)",
                      boxShadow: "0 0 6px var(--gold)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    animation: "star-spin 0.9s linear infinite reverse",
                    margin: 4,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "var(--violet-light)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
              <span className="font-cinzel tracking-widest text-xs">별자리를 읽는 중...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-3 font-cinzel tracking-widest text-xs uppercase">
              <span style={{ color: "var(--gold-bright)", fontSize: "0.9rem" }}>✦</span>
              오늘의 운세 보기
              <span style={{ color: "var(--gold-bright)", fontSize: "0.9rem" }}>✦</span>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
