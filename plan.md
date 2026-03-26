# AstroPulse - AI 기반 별자리 운세 서비스 구현 계획서

## 프로젝트 개요
사용자의 이름, 성별, 생년월일을 입력받아 별자리를 자동 계산하고, AI가 실시간으로 오늘의 운세를 생성하는 웹 서비스.

---

## 기술 스택
| 항목 | 선택 |
|------|------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS + lucide-react |
| AI SDK | Vercel AI SDK (`generateObject`) |
| AI Provider | OpenAI (`gpt-4o-mini`) |
| Validation | Zod |
| Deployment | Vercel |

---

## 핵심 설계 결정

### 1. Structured Output (A안 채택)
- `streamText` 대신 `generateObject` 사용
- Zod 스키마로 응답 구조를 정의하여 JSON 형태 보장
- 운세 결과가 짧으므로 스트리밍 이점 없음, 데이터 정합성 우선

### 2. 별자리 자동 계산
- 사용자는 생년월일만 입력
- 클라이언트에서 날짜 기반으로 별자리(zodiac sign) 자동 계산
- 별자리를 모르는 사용자도 바로 이용 가능

### 3. 보안
- API Key는 `.env.local`에서 관리 (`OPENAI_API_KEY`)
- 모든 AI 호출은 서버 사이드(`app/api/fortune/route.ts`)에서만 처리
- 클라이언트에 API Key 절대 노출 안 함

### 4. Rate Limiting
- IP 기반 간단한 rate limiting (하루 10회)
- in-memory Map으로 구현 (MVP 단계)

---

## AI 프롬프트 설계

### System Prompt
- 페르소나: "데이터를 근거로 논리적이면서도 신비로운 운세를 점치는 점성술사"
- 입력: 오늘 날짜, 사용자 이름, 성별, 별자리
- 출력: Zod 스키마 기반 structured output

### 응답 스키마 (Zod)
```typescript
{
  summary: string,        // 오늘의 운세 총평
  scores: {
    love: number,         // 연애운 (1-100)
    work: number,         // 업무운 (1-100)
    money: number,        // 금전운 (1-100)
  },
  luckyColor: string,     // 행운의 색상
  luckyItem: string,      // 행운의 아이템
  advice: string,         // 오늘의 조언
}
```

---

## 구현 단계

### Phase 1: 프로젝트 초기 설정
- [ ] `npx create-next-app@latest` 실행 (TypeScript, Tailwind, App Router)
- [ ] 필요 패키지 설치: `ai`, `@ai-sdk/openai`, `zod`, `lucide-react`
- [ ] `.env.local` / `.env.example` 파일 생성
- [ ] `.gitignore`에 `.env.local` 포함 확인

### Phase 2: 백엔드 API 구현
- [ ] `app/api/fortune/route.ts` 생성
- [ ] 요청 body Zod 유효성 검사 (이름, 성별, 생년월일, 날짜)
- [ ] 별자리 계산 유틸 함수 (`lib/zodiac.ts`)
- [ ] System Prompt 작성 및 `generateObject` 호출
- [ ] 응답 스키마 정의 (`lib/schemas.ts`)
- [ ] Rate Limiting 미들웨어 (`lib/rate-limit.ts`)

### Phase 3: 프론트엔드 UI 구현
- [ ] 다크 모드 기반 레이아웃 (`app/layout.tsx`)
- [ ] 메인 페이지: 입력 폼 (이름, 성별, 생년월일) (`app/page.tsx`)
- [ ] 결과 카드 컴포넌트: 총평, 점수 바, 행운 아이템 표시
- [ ] 로딩 상태 / 에러 처리 UI
- [ ] 반응형 디자인

### Phase 4: 마무리
- [ ] 배포 가이드 (Vercel Environment Variables 설정 방법)
- [ ] 전체 테스트 및 버그 수정

---

## 파일 구조 (예상)
```
star-path/
├── app/
│   ├── api/
│   │   └── fortune/
│   │       └── route.ts          # AI 운세 생성 API
│   ├── layout.tsx                # 다크모드 레이아웃
│   ├── page.tsx                  # 메인 페이지 (폼 + 결과)
│   └── globals.css               # Tailwind 글로벌 스타일
├── components/
│   ├── FortuneForm.tsx           # 입력 폼 컴포넌트
│   └── FortuneResult.tsx         # 결과 카드 컴포넌트
├── lib/
│   ├── zodiac.ts                 # 별자리 계산 유틸
│   ├── schemas.ts                # Zod 스키마 (요청/응답)
│   └── rate-limit.ts             # Rate Limiting
├── .env.local                    # API 키 (gitignore)
├── .env.example                  # 환경 변수 템플릿
└── plan.md                       # 이 파일
```

---

## 환경 변수
| 변수명 | 설명 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |

## 배포 (Vercel)
1. GitHub 레포 연결
2. Vercel 대시보드 → Settings → Environment Variables
3. `OPENAI_API_KEY` 추가
4. Deploy
