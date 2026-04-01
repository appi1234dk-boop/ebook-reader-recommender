'use client'

import { useEffect, useState } from 'react'

const STAGES = [
  { pct: 0,   label: '설문 응답 수집중...',   delay: 0    },
  { pct: 15,  label: '독서 성향 분석중...',   delay: 350  },
  { pct: 30,  label: '독서 환경 분석중...',   delay: 750  },
  { pct: 50,  label: '맞춤 기기 탐색중...',   delay: 1200 },
  { pct: 75,  label: '최종 결과 정리중...',   delay: 2500 },
  { pct: 100, label: '분석 완료!',            delay: 3000 },
] as const

const TOTAL_DURATION = 3500

interface AnalyzingScreenProps {
  onComplete: () => void
}

export function AnalyzingScreen({ onComplete }: AnalyzingScreenProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STAGES.forEach((stage, i) => {
      if (i === 0) return
      timers.push(setTimeout(() => setCurrentStageIndex(i), stage.delay))
    })

    timers.push(setTimeout(onComplete, TOTAL_DURATION))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const currentStage = STAGES[currentStageIndex]

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#EDECE8' }}>
      <div className="max-w-xs w-full text-center">
        {/* 스피너 */}
        <div className="mb-8 flex justify-center">
          <div
            className="w-14 h-14 rounded-full border-[2px] animate-spin"
            style={{ borderColor: '#DDDCD8', borderTopColor: '#1C1B18' }}
          />
        </div>

        {/* 상태 메시지 */}
        <p
          key={currentStage.label}
          className="text-base font-medium mb-6 min-h-[1.5rem]"
          style={{ color: '#1C1B18', animation: 'fadeIn 0.3s ease both' }}
        >
          {currentStage.label}
        </p>

        {/* 진행률 바 */}
        <div className="h-0.5 rounded-full overflow-hidden mb-3" style={{ background: '#DDDCD8' }}>
          <div
            className="h-full rounded-full transition-all duration-[450ms] ease-out"
            style={{ width: `${currentStage.pct}%`, background: '#1C1B18' }}
          />
        </div>

        <p className="text-xs tabular-nums" style={{ color: '#9A9994' }}>{currentStage.pct}%</p>
      </div>
    </div>
  )
}
