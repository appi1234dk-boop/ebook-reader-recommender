export interface ReadingType {
  code: string
  name: string
  subtitle: string
}

type Genre = 'webnovel' | 'nonfiction' | 'academic' | 'comic'
type Place = 'commute' | 'bed' | 'desk'

const GENRES: Genre[] = ['webnovel', 'nonfiction', 'academic', 'comic']
const PLACES: Place[] = ['commute', 'bed', 'desk']

export const READING_TYPE_TABLE: Record<string, { name: string; subtitle: string }> = {
  webnovel_commute: {
    name: '지옥철 속 현실도피형',
    subtitle: '현실은 9호선에 끼인 몸이지만 영혼은 이미 판타지 세계관 최강자',
  },
  webnovel_bed: {
    name: '내일 출근 어떡형',
    subtitle: '분명 한 장만 더 보려 했는데 정신 차리면 눈앞에 해 뜨는 광경 목격함',
  },
  webnovel_desk: {
    name: '소설 과몰입러',
    subtitle: '카페 구석 명당 잡고 경건하게 최애캐의 서사를 정주행하는 진심 모드',
  },
  nonfiction_commute: {
    name: '틈새 공략 갓생러',
    subtitle: '1분도 허투루 사용하지 않는 극강의 효율충',
  },
  nonfiction_bed: {
    name: '내일부터 갓생러',
    subtitle: '자기 전 자기계발서 보며 게을렀던 오늘을 반성하는 회고의 달인',
  },
  nonfiction_desk: {
    name: '인사이트 풀충전기',
    subtitle: '카페 명당 잡고 하이라이트 쫙쫙 치며 지식 주워 담는 이 시대의 지성인',
  },
  academic_commute: {
    name: '얼마나 성공할지 감도 안잡힘',
    subtitle: '사람에 치여도 꿋꿋하게 전문 용어 읽어내는 광기의 지식 갈구 메이커',
  },
  academic_bed: {
    name: '최면 학습형',
    subtitle: '자면서도 공부하고 싶은 마음으로 어려운 책 폈다가 그대로 기절 수면',
  },
  academic_desk: {
    name: '대학원생 (진)',
    subtitle: '키보드 앞에 앉아 레퍼런스 뒤지는 폼이 이미 학위 하나 딴 것 같은 포스',
  },
  comic_commute: {
    name: '입꼬리 씰룩형',
    subtitle: '사람들 틈에서 만화 보다 피식거려서 옆 사람 시선 강탈하는 프로 웃참러',
  },
  comic_bed: {
    name: '이불 밖은 위험형',
    subtitle: '옆으로 누워 팔 저릴 때까지 스크롤 내리는 행복 지수 200%의 만화 덕후',
  },
  comic_desk: {
    name: '쿠키 탕진형',
    subtitle: '책상 앞에 각 잡고 앉아 한 순간에 쿠키를 소진해버리는 진정한 만덕후',
  },
}

function pickGenre(vals: string[]): Genre {
  const g = vals.find(v => (GENRES as string[]).includes(v))
  return (g as Genre) ?? 'webnovel'
}

function pickPlace(vals: string[]): Place {
  const p = vals.find(v => (PLACES as string[]).includes(v))
  return (p as Place) ?? 'commute'
}

export function classifyReadingType(answers: Record<number, string>): ReadingType {
  const vals = Object.values(answers)
  const genre = pickGenre(vals)
  const place = pickPlace(vals)
  const code = `${genre}_${place}`
  const entry = READING_TYPE_TABLE[code]
  return { code, name: entry.name, subtitle: entry.subtitle }
}
