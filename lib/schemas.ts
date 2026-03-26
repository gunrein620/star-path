import { z } from "zod";

export const fortuneRequestSchema = z.object({
  name: z.string().min(1).max(20),
  gender: z.enum(["male", "female", "other"]),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type FortuneRequest = z.infer<typeof fortuneRequestSchema>;

export const fortuneResultSchema = z.object({
  summary: z.string().describe("오늘의 운세 총평 (2-3문장)"),
  scores: z.object({
    love: z.number().int().min(1).max(100).describe("연애운 점수 (1-100)"),
    work: z.number().int().min(1).max(100).describe("업무운 점수 (1-100)"),
    money: z.number().int().min(1).max(100).describe("금전운 점수 (1-100)"),
  }),
  luckyColor: z.string().describe("오늘의 행운의 색상 (예: '로얄 블루', '산호빛 주황')"),
  luckyItem: z.string().describe("오늘의 행운의 아이템 (예: '은빛 목걸이', '라벤더 향초')"),
  advice: z.string().describe("오늘 하루를 위한 짧고 강렬한 조언 (1문장)"),
});

export type FortuneResult = z.infer<typeof fortuneResultSchema>;
