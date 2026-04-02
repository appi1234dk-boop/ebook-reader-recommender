'use client'

import { useEffect, useState } from 'react'

const STAGES = [
  { pct: 0,   label: '설문 응답 수집중...',   delay: 0    },
  { pct: 15,  label: '독서 성향 분석중...',   delay: 500  },
  { pct: 30,  label: '독서 환경 분석중...',   delay: 900  },
  { pct: 50,  label: '31종 기기 매칭중...',   delay: 1500 },
  { pct: 75,  label: '최종 1개 추천중...',   delay: 3000 },
  { pct: 100, label: '추천 완료!',            delay: 4500 },
] as const

const TOTAL_DURATION = 5000

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
        {/* AI 파동 */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <div className="absolute inset-0 border border-indigo-400 ai-wave-1 opacity-60" />
            <div className="absolute inset-0 border border-blue-400 ai-wave-2 opacity-60" />
            <div className="absolute inset-0 border border-purple-400 ai-wave-3 opacity-60" />
            <div className="absolute inset-0 border border-cyan-400 ai-wave-4 opacity-60" />
            <div className="absolute inset-4 bg-indigo-200 rounded-full blur-2xl opacity-20 animate-pulse" />
            <span
              key={currentStage.label}
              className="z-10 text-sm font-semibold text-center px-3"
              style={{ color: '#1C1B18', animation: 'fadeIn 0.3s ease both', lineHeight: 1.4 }}
            >
              {currentStage.label}
            </span>
          </div>
        </div>

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
