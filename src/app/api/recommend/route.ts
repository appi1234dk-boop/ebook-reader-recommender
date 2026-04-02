import Anthropic from '@anthropic-ai/sdk'
import type { NextRequest } from 'next/server'

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  frequency: {
    addict:  '일주일에 1권 이상',
    casual:  '한 달에 1~2권',
    wannabe: '거의 못 읽음',
  },
  genre: {
    webnovel:   '소설/웹소설',
    nonfiction: '비문학',
    academic:   '논문/전문서적',
    comic:      '만화책',
  },
  location: {
    commute: '이동 중(지하철/버스)',
    bed:     '침대 눕독',
    desk:    '집/카페 책상',
  },
  feature: {
    light:  '가벼운 무게',
    button: '물리버튼',
    color:  '컬러 화면',
    pen:    '스타일러스 펜',
  },
  budget: {
    budget_under20: '20만원 미만',
    budget_30s:     '30만원대',
    budget_40s:     '40만원대',
    budget_over50:  '50만원 이상',
  },
  shipping: {
    import:   '해외직구 가능',
    domestic: '국내 배송 선호',
  },
}

const QUESTION_KEYS = ['frequency', 'genre', 'location', 'feature', 'budget', 'shipping'] as const

const TIER_ORDER = ['entry', 'mid', 'midHigh', 'high']
const BUDGET_MAX_TIER: Record<string, string> = {
  budget_under20: 'entry',
  budget_30s:     'mid',
  budget_40s:     'midHigh',
  budget_over50:  'high',
}

function buildPrompt(
  answers: Record<number, string>,
  device: {
    name: string
    brand: string
    size: string
    priceRange: string
    physicalButton: boolean
    hasColor: boolean
    releaseYear: string
    priceTier: string
    origin: string
  }
): string {
  const userProfile = QUESTION_KEYS.map((key, i) => {
    const val = answers[i] ?? ''
    const label = ANSWER_LABELS[key][val] ?? val
    const questionLabel = {
      frequency: '독서 빈도',
      genre:     '주로 읽는 장르',
      location:  '주로 읽는 장소',
      feature:   '원하는 기능',
      budget:    '예산',
      shipping:  '배송 선호',
    }[key]
    return `- ${questionLabel}: ${label}`
  }).join('\n')

  const deviceProfile = [
    `- 이름: ${device.brand} ${device.name}`,
    `- 화면 크기: ${device.size}`,
    `- 가격대: ${device.priceRange}`,
    `- 물리 버튼: ${device.physicalButton ? '있음' : '없음'}`,
    `- 컬러 e-ink: ${device.hasColor ? '있음' : '없음'}`,
    `- 출시년도: ${device.releaseYear}`,
  ].join('\n')

  // 예산 초과 여부 판단
  const answerVals = Object.values(answers)
  const budgetVal = answerVals.find(v => v?.startsWith('budget_'))
  const budgetWarning = (() => {
    if (!budgetVal) return ''
    const maxIdx = TIER_ORDER.indexOf(BUDGET_MAX_TIER[budgetVal])
    const deviceIdx = TIER_ORDER.indexOf(device.priceTier)
    if (deviceIdx > maxIdx) {
      const budgetLabel = ANSWER_LABELS.budget[budgetVal]
      return `\n⚠️ 예산 초과: 사용자 예산(${budgetLabel})보다 이 기기(${device.priceRange})가 비쌉니다. reason에서 "다만 예산보다 조금 비싸지만" 형식으로 솔직하게 언급하세요.`
    }
    return ''
  })()

  // 해외직구 불가 + 중국 기기 경고
  const shippingWarning = (() => {
    if (answerVals.includes('domestic') && device.origin === 'china') {
      return `\n⚠️ 배송 주의: 사용자가 국내 배송을 선호하지만 이 기기는 해외직구 상품입니다. reason에서 이 점을 솔직하게 언급하세요.`
    }
    return ''
  })()

  const warnings = budgetWarning + shippingWarning

  return `당신은 이북리더기 전문가입니다. 사용자의 독서 성향을 분석하고 추천 이유를 작성해주세요.

참고: 출시년도가 2026년으로 표기된 기기도 현재 이미 출시되어 구매 가능한 제품입니다. 출시 예정 제품이 아닙니다.

사용자 답변:
${userProfile}

추천 기기:
${deviceProfile}${warnings}

아래 JSON만 출력하세요. 마크다운, 코드블록, 설명 없이 JSON만:
{"readingType":"최대 5단어. 사용자 독서 유형을 밈·드라마·노래제목·유행어·인터넷 문화를 비틀어 표현. 직접적 설명 금지. 예: '침대 밖은 위험해', '책 한 권의 기적', '활자 도파민 중독자', '지식 FLEX 중', '오늘도 야근 중(독서)', '읽을 책만 늘어나는 삶'", "usage":"65자 이내 1문장. 독자 성향 + 이북리더기의 핵심 매칭 포인트 + 만족도 예측을 중복 없이 압축. 문장 종결은 '~거예요!' 또는 '~겠어요!' 형식. 예: '밤마다 웹소설 탐독하는 당신, 블루라이트 없는 e-ink 화면으로 눈 걱정 없이 밤새 읽을 수 있어요!'", "reason":"3문장. 1문장: 충족되는 조건을 구체적으로 나열하고 '~에 딱 맞는 제품이에요' 또는 '~를 모두 갖춘 제품이에요' 형식으로 마무리. 2문장: 충족 안 되는 조건이 있으면 '다만 ~는 없어요' 또는 '다만 예산보다 조금 비싸지만' 형식으로 솔직하게 (없으면 생략). 3문장: '그럼에도 ~라 추천드렸어요' 또는 '~이기에 추천드렸어요' 형식으로 마무리."}`
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const { answers, device } = body

    if (!answers || !device) {
      return Response.json({ error: 'missing required fields' }, { status: 400 })
    }

    const client = new Anthropic()

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: buildPrompt(answers, device),
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ aiContent: null }, { status: 200 })
    }

    const aiContent = JSON.parse(jsonMatch[0])
    return Response.json({ aiContent })
  } catch (err) {
    console.error('[recommend] Error:', err)
    return Response.json({ aiContent: null }, { status: 200 })
  }
}
