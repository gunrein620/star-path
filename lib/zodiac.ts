export type ZodiacSign =
  | "양자리"
  | "황소자리"
  | "쌍둥이자리"
  | "게자리"
  | "사자자리"
  | "처녀자리"
  | "천칭자리"
  | "전갈자리"
  | "사수자리"
  | "염소자리"
  | "물병자리"
  | "물고기자리";

export const ZODIAC_SIGNS: {
  sign: ZodiacSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  emoji: string;
  englishName: string;
}[] = [
  { sign: "염소자리", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, emoji: "♑", englishName: "Capricorn" },
  { sign: "물병자리", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, emoji: "♒", englishName: "Aquarius" },
  { sign: "물고기자리", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, emoji: "♓", englishName: "Pisces" },
  { sign: "양자리", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, emoji: "♈", englishName: "Aries" },
  { sign: "황소자리", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, emoji: "♉", englishName: "Taurus" },
  { sign: "쌍둥이자리", startMonth: 5, startDay: 21, endMonth: 6, endDay: 21, emoji: "♊", englishName: "Gemini" },
  { sign: "게자리", startMonth: 6, startDay: 22, endMonth: 7, endDay: 22, emoji: "♋", englishName: "Cancer" },
  { sign: "사자자리", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, emoji: "♌", englishName: "Leo" },
  { sign: "처녀자리", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, emoji: "♍", englishName: "Virgo" },
  { sign: "천칭자리", startMonth: 9, startDay: 23, endMonth: 10, endDay: 23, emoji: "♎", englishName: "Libra" },
  { sign: "전갈자리", startMonth: 10, startDay: 24, endMonth: 11, endDay: 21, emoji: "♏", englishName: "Scorpio" },
  { sign: "사수자리", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, emoji: "♐", englishName: "Sagittarius" },
];

export function getZodiacSign(birthDate: string): { sign: ZodiacSign; emoji: string; englishName: string } {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const zodiac of ZODIAC_SIGNS) {
    if (zodiac.startMonth === zodiac.endMonth) {
      if (month === zodiac.startMonth && day >= zodiac.startDay && day <= zodiac.endDay) {
        return { sign: zodiac.sign, emoji: zodiac.emoji, englishName: zodiac.englishName };
      }
    } else if (zodiac.startMonth > zodiac.endMonth) {
      // 연도를 넘기는 경우 (염소자리: 12/22 ~ 1/19)
      if (
        (month === zodiac.startMonth && day >= zodiac.startDay) ||
        (month === zodiac.endMonth && day <= zodiac.endDay)
      ) {
        return { sign: zodiac.sign, emoji: zodiac.emoji, englishName: zodiac.englishName };
      }
    } else {
      if (
        (month === zodiac.startMonth && day >= zodiac.startDay) ||
        (month > zodiac.startMonth && month < zodiac.endMonth) ||
        (month === zodiac.endMonth && day <= zodiac.endDay)
      ) {
        return { sign: zodiac.sign, emoji: zodiac.emoji, englishName: zodiac.englishName };
      }
    }
  }

  // 기본값 (이론상 도달 불가)
  return { sign: "염소자리", emoji: "♑", englishName: "Capricorn" };
}
