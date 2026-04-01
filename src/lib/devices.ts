import type { Device, RecommendationResult } from './types'

export const DEVICES: Record<string, Device> = {
  poke6: {
    id: 'poke6',
    name: '포크6',
    brand: '오닉스',
    size: '6인치',
    priceRange: '10~20만원',
    imageUrl: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/72ac/819e0cf6f284f2b06468a39639265f87d74c86a07b59417cc47177e6ca13.jpg',
    description: '스마트폰보다 가벼운 무게로 출퇴근 지하철에서도 한 손으로 편하게 읽을 수 있는 웹소설 독자들의 영원한 베스트셀러.',
    androidVersion: '안드로이드 11',
    physicalButton: false,
    hasColor: false,
    releaseYear: '2024년',
  },
  b6: {
    id: 'b6',
    name: 'B6',
    brand: '빅미',
    size: '6인치',
    priceRange: '20~30만원',
    imageUrl: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/2395/59c0921a9440f9049a30dbce8451667f012c0af423fe736f8fc81ea95223.png',
    description: '컬러 e-ink로 웹소설 표지와 삽화를 생생하게 즐길 수 있는 6인치 컴팩트 기기.',
    androidVersion: '안드로이드 14',
    physicalButton: false,
    hasColor: true,
    releaseYear: '2025년',
  },
  comma: {
    id: 'comma',
    name: '콤마',
    brand: '모안',
    size: '6인치',
    priceRange: '20~30만원',
    imageUrl: '/device/comma.jpg',
    description: '국내 감성으로 설계된 이북리더기. 자기 전 침대에서 편안하게 읽을 수 있는 최적의 크기와 밝기 조절.',
    androidVersion: '안드로이드 11',
    physicalButton: true,
    hasColor: false,
    releaseYear: '2025년',
  },
  sam7: {
    id: 'sam7',
    name: 'SAM7',
    brand: '교보문고',
    size: '7인치',
    priceRange: '20~30만원',
    imageUrl: '/device/sam7.jpg',
    description: '펀딩 10억을 달성한 화제의 기기. 물리 버튼과 7인치 화면으로 일반 도서를 읽기 가장 좋은 밸런스형.',
    androidVersion: '안드로이드 14',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2026년',
  },
  go7: {
    id: 'go7',
    name: 'GO7 2세대',
    brand: '오닉스',
    size: '7인치',
    priceRange: '30~40만원',
    imageUrl: 'https://innospaceone.com/web/product/extra/big/202505/2059f5885c9e78f0fb4b1ec1273981e0.png',
    description: '빠른 페이지 전환과 안드로이드 기반으로 다양한 앱 활용이 가능한 파워 유저를 위한 7인치 기기.',
    androidVersion: '안드로이드 13',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2025년',
  },
  leaf5: {
    id: 'leaf5',
    name: '리프5',
    brand: '오닉스',
    size: '7인치',
    priceRange: '30~40만원',
    imageUrl: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/image_audit/prod/db4e1eb3-0557-4726-b292-1ea43454eb89_fixing_v2.png',
    description: '나뭇잎처럼 가볍고 얇은 디자인. 침대에서 오래 들고 있어도 피로하지 않은 이상적인 독서 기기.',
    androidVersion: '안드로이드 13',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2025년',
  },
  palette: {
    id: 'palette',
    name: '팔레트',
    brand: '크레마',
    size: '7인치',
    priceRange: '30~40만원',
    imageUrl: '/device/palette.jpg',
    description: '컬러 e-ink로 만화와 잡지를 눈의 피로 없이 즐길 수 있는 국내 유일 컬러 이북리더기.',
    androidVersion: '안드로이드 14',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2025년',
  },
  ocean5pro: {
    id: 'ocean5pro',
    name: '오션5 프로',
    brand: '아이리더',
    size: '7인치',
    priceRange: '40~60만원',
    imageUrl: '/device/ocean5pro.jpg',
    description: '프리미엄 디스플레이와 정교한 전면 조명으로 눈의 피로를 최소화한 진지한 독서가를 위한 선택.',
    androidVersion: '안드로이드 14',
    physicalButton: true,
    hasColor: false,
    releaseYear: '2025년',
  },
  booksT10C: {
    id: 'booksT10C',
    name: '북스 T10C',
    brand: '오닉스',
    size: '10.3인치',
    priceRange: '60~90만원',
    imageUrl: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/0adb/55f96638df8e55b350a0e77704be2e9c54f884bdcb1a76d2ab09dce3ff53.jpg',
    description: 'PDF 전공서적과 만화책을 실제 책처럼 크게 볼 수 있는 대화면. 필기 기능으로 공부에도 최적.',
    androidVersion: '안드로이드 12',
    physicalButton: false,
    hasColor: true,
    releaseYear: '2024년',
  },
  b751c: {
    id: 'b751c',
    name: 'B751c',
    brand: '빅미',
    size: '7인치',
    priceRange: '20~30만원',
    imageUrl: '/device/b751c.jpg',
    description: '컬러 e-ink 7인치로 만화와 웹소설 표지를 생생하게 즐기면서 물리 버튼까지 갖춘 가성비 컬러 기기.',
    androidVersion: '안드로이드 11',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2024년',
  },
  cremaC: {
    id: 'cremaC',
    name: '크레마 C',
    brand: '크레마',
    size: '7인치',
    priceRange: '30~40만원',
    imageUrl: '/device/cremaC.jpg',
    description: '국내 크레마 브랜드의 컬러 e-ink 7인치. 한국 플랫폼 최적화와 컬러 화면을 동시에 누릴 수 있어요.',
    androidVersion: '안드로이드 14',
    physicalButton: true,
    hasColor: true,
    releaseYear: '2025년',
  },
  m103: {
    id: 'm103',
    name: 'M103',
    brand: '미북',
    size: '10.3인치',
    priceRange: '30~40만원',
    imageUrl: '/device/m103.jpg',
    description: '10인치급 중 가장 저렴한 선택지. 논문·원서 PDF를 실제 크기에 가깝게 볼 수 있어요.',
    androidVersion: '안드로이드 11',
    physicalButton: false,
    hasColor: false,
    releaseYear: '2024년',
  },
}

// 각 답변이 해당 기기 추천에 얼마나 부합하는지를 나타내는 시그널
const DEVICE_REASON_SIGNALS: Record<string, string[]> = {
  poke6:     ['webnovel', 'commute', 'light'],
  b6:        ['webnovel', 'comic', 'color'],
  comma:     ['commute', 'light', 'button', 'bed'],
  sam7:      ['nonfiction', 'button', 'bed'],
  go7:       ['nonfiction', 'button', 'desk'],
  leaf5:     ['bed', 'button', 'color'],
  palette:   ['comic', 'color', 'button'],
  ocean5pro: ['nonfiction', 'button', 'desk'],
  booksT10C: ['academic', 'pen', 'color'],
  b751c:     ['comic', 'color', 'button'],
  cremaC:    ['comic', 'color', 'button'],
  m103:      ['academic', 'pen', 'desk'],
}

const REASON_FRAGMENTS: Record<string, string> = {
  webnovel:   '웹소설을 끊김 없이 빠르게 넘기기 좋아요',
  nonfiction: '비문학 하이라이트·메모에 최적화된 크기예요',
  academic:   '논문·원서를 실제 종이에 가까운 크기로 볼 수 있어요',
  comic:      '만화책을 위한 최적의 화면 크기와 해상도예요',
  commute:    '지하철 한 손 독서에 딱 맞는 크기와 무게예요',
  bed:        '가볍고 눈 편한 e-ink로 잠자리 독서에 최적이에요',
  desk:       '책상에서 집중해서 읽기 좋은 넓은 화면이에요',
  light:      '이 카테고리에서 가장 가벼운 기기 중 하나예요',
  button:     '물리 버튼으로 화면 터치 없이 한 손 페이지 넘기기가 돼요',
  color:      '컬러 e-ink로 표지와 삽화를 생생하게 즐길 수 있어요',
  pen:        'PDF에 직접 필기하며 공부·메모할 수 있어요',
}

function getDeviceReasons(deviceId: string, userAnswers: string[]): string[] {
  const signals = DEVICE_REASON_SIGNALS[deviceId] ?? []
  return signals
    .filter(s => userAnswers.includes(s))
    .slice(0, 2)
    .map(s => REASON_FRAGMENTS[s])
}

export function getRecommendation(answers: Record<number, string>): RecommendationResult {
  const vals = Object.values(answers)

  // 1. 이북리더기로 책 읽을 확률
  let probability = 50
  if (vals.includes('addict'))      probability = 98
  else if (vals.includes('casual')) probability = 60
  else if (vals.includes('wannabe'))probability = 25

  if (vals.includes('academic'))    probability += 20
  else                              probability += 10
  if (vals.includes('commute'))     probability += 5
  if (vals.includes('pen'))         probability += 10
  else                              probability += 5
  probability = Math.min(100, probability)

  // 2. 기기 점수 계산 (전체 기기 대상)
  const scores: Record<string, number> = Object.fromEntries(
    Object.keys(DEVICES).map(id => [id, 0])
  )

  // Q2 장르 시그널
  if (vals.includes('webnovel'))  { scores.poke6 += 4; scores.b6 += 3; scores.sam7 += 1 }
  if (vals.includes('nonfiction')){ scores.sam7 += 4; scores.go7 += 2; scores.ocean5pro += 1 }
  if (vals.includes('academic'))  {
    scores.booksT10C += 6; scores.m103 += 4
    scores.poke6 -= 5; scores.b6 -= 5; scores.comma -= 5
  }
  if (vals.includes('comic'))     {
    scores.palette += 5; scores.b751c += 3
    scores.leaf5 += 2; scores.b6 += 2; scores.cremaC += 2
  }

  // Q3 장소 시그널
  if (vals.includes('commute'))   { scores.poke6 += 3; scores.comma += 3 }
  if (vals.includes('bed'))       { scores.leaf5 += 3; scores.comma += 2; scores.sam7 += 1 }

  // Q4 기능 시그널 — 기기 속성 기반 동적 적용
  for (const [id, device] of Object.entries(DEVICES)) {
    if (vals.includes('button')) scores[id] += device.physicalButton ? 3 : -2
    if (vals.includes('color'))  scores[id] += device.hasColor ? 4 : -3
  }
  if (vals.includes('light')) {
    for (const [id, device] of Object.entries(DEVICES)) {
      const isSmall = device.size === '6인치' || device.size === '바형'
      scores[id] += isSmall ? 3 : -1
    }
  }
  if (vals.includes('pen')) {
    for (const [id, device] of Object.entries(DEVICES)) {
      const isLarge = device.size.includes('10') || device.size.includes('13')
      scores[id] += isLarge ? 4 : -10
    }
  }

  // 3. 상위 2개 → primary / secondary
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primary   = DEVICES[sorted[0][0]]
  const secondary = DEVICES[sorted[1][0]]

  // 4. 추천 이유 (답변 기반)
  const primaryReasons   = getDeviceReasons(primary.id, vals)
  const secondaryReasons = getDeviceReasons(secondary.id, vals)

  // 5. 확률 구간별 결과 타입
  let resultType: string, description: string
  if (probability >= 90) {
    resultType  = '도파민 대신 활자 풀충전!\n당장 결제 하세요 💳'
    description = '이북리더기가 제2의 심장이 될 당신.\n스마트폰 알림 없이, 눈 피로 없이 원 없이 읽어요.'
  } else if (probability >= 70) {
    resultType  = '본전 회수 쌉가능!\n독서량 폼 미칠 예정 📈'
    description = '어차피 읽을 거 e-ink로 읽어요.\n투자 대비 만족도 최상, 본전 걱정은 접어두세요.'
  } else if (probability >= 50) {
    resultType  = '장비빨로 갓생 살기?\n일단 담아봐 🛒'
    description = '좋은 도구가 습관을 만들기도 해요.\n이북리더기 하나가 독서 라이프를 바꿀 수도 있어요.'
  } else if (probability >= 35) {
    resultType  = '숨겨진 독서 세포 발견'
    description = '독서 세포가 살아있긴 해요.\n지금 읽고 싶은 책이 3권 이상이라면 도전해봐요.'
  } else {
    resultType  = '멈춰! 30만원짜리 고급 라면 받침대 살 뻔'
    description = '지금 당장은 조금 이른 타이밍이에요.\n하지만 장비빨에 끌린다면 한번 도전해봐도 좋아요!'
  }

  return { primary, secondary, primaryReasons, secondaryReasons, resultType, probability, description }
}
