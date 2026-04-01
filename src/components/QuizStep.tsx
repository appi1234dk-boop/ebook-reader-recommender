'use client'

import { useState, useEffect } from 'react'

interface QuizOption {
  value: string
  label: string
}

interface QuizStepProps {
  questionNumber: number
  totalQuestions: number
  question: string
  options: readonly QuizOption[]
  onAnswer: (value: string) => void
  isExiting?: boolean
}

const ALPHABET = ['A', 'B', 'C', 'D', 'E']
const TIMER_SECONDS = 30

const ENCOURAGEMENTS = [
  '가볍게 골라보세요',
  '잘 하고 있어요',
  '거의 다 왔어요!',
]

export function QuizStep({
  questionNumber,
  totalQuestions,
  question,
  options,
  onAnswer,
  isExiting = false,
}: QuizStepProps) {
  const progressPct = (questionNumber / totalQuestions) * 100
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  useEffect(() => {
    if (isExiting || selectedValue !== null) return
    if (secondsLeft <= 0) {
      onAnswer(options[0].value)
      return
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, isExiting, selectedValue, onAnswer, options])

  const handleSelect = (value: string) => {
    if (isExiting || selectedValue !== null) return
    setSelectedValue(value)
    setTimeout(() => onAnswer(value), 380)
  }

  const isUrgent = secondsLeft <= 10
  const timerPct = (secondsLeft / TIMER_SECONDS) * 100
  const encouragement = ENCOURAGEMENTS[questionNumber - 1] ?? ENCOURAGEMENTS[0]

  return (
    <div className="flex items-center justify-center px-5" style={{ minHeight: '100dvh', background: '#EDECE8' }}>
      <div className={`max-w-md w-full py-10 ${isExiting ? 'quiz-card-exit' : 'quiz-card-enter'}`} style={{ marginBottom: '8dvh' }}>

        {/* 타이머 바 */}
        <div style={{ height: '2px', background: '#DDDCD8', borderRadius: '1px' }}>
          <div
            style={{
              height: '100%',
              width: `${timerPct}%`,
              background: isUrgent ? '#1C1B18' : '#9A9994',
              borderRadius: '1px',
              transition: 'width 1s linear, background 0.3s',
            }}
          />
        </div>

        {/* 타이머 숫자 — 중앙 강조 */}
        <div className="flex justify-center mt-3 mb-8">
          <p
            className={`tabular-nums font-bold${isUrgent ? ' alarm-shake' : ''}`}
            style={{
              fontSize: '28px',
              letterSpacing: '0.04em',
              color: isUrgent ? '#1C1B18' : '#DDDCD8',
              transition: 'color 0.3s',
            }}
          >
            0:{String(secondsLeft).padStart(2, '0')}
          </p>
        </div>

        {/* 질문 */}
        <h2 className="text-xl font-bold mb-6 leading-snug" style={{ color: '#1C1B18' }}>
          {question}
        </h2>

        {/* 선택지 패널 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDDCD8',
            borderRadius: '4px',
          }}
        >
          {options.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={isExiting || selectedValue !== null}
              className="w-full text-left flex items-center gap-3"
              style={{
                padding: '16px 18px',
                borderBottom: i < options.length - 1 ? '1px solid #DDDCD8' : 'none',
                transform: selectedValue === opt.value
                  ? 'scale(1.03)'
                  : selectedValue !== null
                    ? 'scale(0.98)'
                    : 'scale(1)',
                opacity: selectedValue !== null && selectedValue !== opt.value ? 0.3 : 1,
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
                position: 'relative',
                zIndex: selectedValue === opt.value ? 1 : 0,
              }}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center font-bold"
                style={{
                  width: '18px',
                  height: '18px',
                  background: '#1C1B18',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  borderRadius: '2px',
                }}
              >
                {ALPHABET[i]}
              </span>
              <span className="flex-1 font-medium text-sm" style={{ color: '#1C1B18' }}>
                {opt.label}
              </span>
              <span style={{ color: '#DDDCD8', fontSize: '18px', lineHeight: 1 }}>›</span>
            </button>
          ))}
        </div>

        {/* 하단: 진행률 바 + QUESTION X/X + 응원 메시지 */}
        <div className="mt-6">
          <div style={{ height: '2px', background: '#DDDCD8', borderRadius: '1px' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: '#1C1B18', borderRadius: '1px' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span
              className="font-semibold"
              style={{ color: '#9A9994', fontSize: '10px', letterSpacing: '0.1em' }}
            >
              QUESTION {questionNumber} / {totalQuestions}
            </span>
            <span
              className="font-medium"
              style={{ color: '#9A9994', fontSize: '10px' }}
            >
              {encouragement}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
