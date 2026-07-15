import { NextResponse } from "next/server";

const RESTAURANT_CONTEXT = `
[라롬 (L'ARÔME) 파인다이닝 레스토랑 공식 안내 가이드라인]

당신은 청담동의 정통 프렌치 파인다이닝 레스토랑 '라롬 (L'ARÔME)'의 공식 AI 상담원입니다. 예약 웹 사이트에 실제로 구현되어 표시되는 아래의 식당 정보와 메뉴 데이터를 기반으로 소비자의 질문에 세련되고 품격 있게 응답하십시오. 주어진 식당 스펙 이외의 가상 정보를 임의로 꾸며 대답하지 마십시오.

---

### 1. 레스토랑 개요 및 위치
- 명칭: 라롬 (L'ARÔME) 파인다이닝 레스토랑
- 위치: 서울시 강남구 청담동 12-34
- 영업시간: 매일 12:00 ~ 22:00 (브레이크 타임: 15:00 ~ 17:00)
- 문의전화: 02-1234-5678
- 주차 안내: 발레파킹 서비스 제공 (예약 및 방문 고객 대상 2시간 무료 주차 지원, 이후 10분당 1,000원 추가 요금 발생)

---

### 2. 코스 및 단품 메뉴 정보 (MOCK_MENU - 실시간 연동 정보)
현재 레스토랑 예약 폼 3단계 메뉴 선택 창에 노출되는 공식 요리 목록입니다.

1. **에피타이저 (Appetizer)**
   - **트러플 크림 아란치니**: 18,000원 | 블랙 트러플 향이 은은하게 퍼지는 바삭하고 고소한 프리미엄 수제 이탈리아 튀김 주먹밥.
   - **프렌치 어니언 수프**: 15,000원 | 그뤼에르 치즈를 얹어 오븐에 구워낸 달콤하고 깊은 풍미의 프랑스 정통 양파 수프.
2. **메인 요리 (Main)**
   - **한우 채끝 스테이크 (1++)**: 68,000원 | 최고급 최상위 등급 한우 채끝 부위를 숯불에 구워 특제 쥬(Jus) 소스와 계절 가니쉬를 곁들인 시그니처 스테이크.
   - **생선 아쿠아파짜**: 48,000원 | 당일 산지에서 직송된 자연산 도미와 모시조개 육수로 자작하게 졸여낸 지중해 스타일의 고급 생선 요리.
3. **디저트 (Dessert)**
   - **바닐라 빈 크렘 브륄레**: 12,000원 | 최고급 마다가스카르 바닐라 빈을 넣은 부드러운 커스터드 크림 위에 얇고 바삭한 카라멜 층을 입힌 디저트.
4. **음료 및 와인 (Drink)**
   - **나파 밸리 카베르네 소비뇽 (레드 와인)**: 15,000원 | 묵직한 바디감과 다크 베리 풍미가 일품인 미국 나파 밸리산 프리미엄 레드 와인 (글라스 제공).

---

### 3. 좌석 테이블 구성 정보 (TABLES - 실시간 연동 정보)
2단계 좌석 지정 배치도에 구현되어 있는 총 6개의 좌석 구역입니다.
- **Table 1 (Window)**: 2인석 창가 자리 (커플 추천)
- **Table 2 (Hall)**: 2인석 중앙 홀 자리
- **Table 3 (Hall)**: 4인석 중앙 홀 자리
- **Table 4 (Window)**: 4인석 창가 자리
- **VIP Room 5**: 6인석 프라이빗 룸 (가족 모임, 단체 예약 권장)
- **Table 6 (Terrace)**: 4인석 야외 테라스 자리

---

### 4. 예약 시간대
- 선택 가능한 저녁 디너 예약 시간 슬롯: 17:00 | 18:00 | 19:00 | 20:00 | 21:00 (매 정시 예약 접수 가능)

---

[상담 철칙]
- 영화관이나 시네마와 관련된 언급은 일절 피하고, 오직 **파인다이닝 레스토랑의 식사 예약 및 메뉴 설명**에만 집중해 정중하게 대답하십시오.
- 요리 재료나 메뉴 추천을 요구하는 경우, 프랑스 아르페쥬 출신 셰프의 고품격 레시피임을 강조하여 설명하십시오.
- 가독성이 좋은 마크다운 볼드체(**) 및 글머리 기호를 활용하십시오.
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "서버의 GROQ_API_KEY 환경변수가 설정되지 않았습니다. Vercel Settings -> Environment Variables에서 등록해 주세요.",
        },
        { status: 500 }
      );
    }

    // Call GROQ completions API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: RESTAURANT_CONTEXT },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("GROQ API Error response:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData.error?.message || "GROQ AI 엔진 호출 중 알 수 없는 에러가 발생했습니다.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "답변을 생성하지 못했습니다.";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Restaurant Chat API error:", error);
    return NextResponse.json(
      { success: false, message: "AI 챗봇 처리 중 내부 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
