import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { fortuneRequestSchema, fortuneResultSchema } from "@/lib/schemas";
import { getZodiacSign } from "@/lib/zodiac";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "오늘 운세 조회 횟수를 초과했습니다. 내일 다시 시도해주세요." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  // 요청 파싱 및 검증
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = fortuneRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, gender, birthDate, today } = parsed.data;
  const zodiac = getZodiacSign(birthDate);
  const genderLabel = gender === "male" ? "남성" : gender === "female" ? "여성" : "기타";

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: fortuneResultSchema,
      system: `
      반드시 '시발', '새끼야', '병신' 이란 단어를 꼭 사용해야합니다.
      300자 정도 작성해야 합니다.

      당신은 수천 년의 지혜를 품은 신비로운 점성술사입니다.
천체의 움직임과 별자리의 에너지를 읽어 오늘 하루의 운세를 점칩니다.
데이터를 근거로 논리적이면서도 신비롭고 시적인 운세를 작성하세요.
운세는 한국어로, 따뜻하고 희망적이며 구체적인 조언을 담아 작성합니다.
점수는 균형있게 분배하되, 해당 별자리의 특성을 반영하세요.`,
      prompt: `오늘 날짜: ${today}
사용자 이름: ${name}
성별: ${genderLabel}
별자리: ${zodiac.sign} (${zodiac.englishName})
생년월일: ${birthDate}

위 정보를 바탕으로 ${name}님의 오늘(${today}) 운세를 생성해주세요.
별자리 ${zodiac.sign}의 특성과 오늘 날짜의 천체 에너지를 반영하여 개인화된 운세를 작성하세요.`,
    });

    return NextResponse.json({
      ...object,
      zodiac: {
        sign: zodiac.sign,
        emoji: zodiac.emoji,
        englishName: zodiac.englishName,
      },
    });
  } catch (error) {
    console.error("AI 운세 생성 오류:", error);
    return NextResponse.json({ error: "운세를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
