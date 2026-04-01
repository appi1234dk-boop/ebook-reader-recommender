'use client'

import { useState, useEffect } from 'react'

const MODELS = ['오닉스 포크6', '빅미 B6', '모안 콤마', '교보문고 SAM7', '오닉스 GO7 2세대', '오닉스 리프5', '크레마 팔레트', '아이리더 오션5 프로', '오닉스 북스 T10C']

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle')

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase('exit')
      setTimeout(() => {
        setIdx(i => (i + 1) % MODELS.length)
        setPhase('enter')
        setTimeout(() => setPhase('idle'), 400)
      }, 320)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="relative flex items-end justify-center overflow-hidden"
      style={{
        minHeight: '100dvh',
        backgroundImage: 'url(/ereader-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* 하단으로 갈수록 진해지는 오버레이 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(237,236,232,0) 0%, rgba(237,236,232,0.45) 38%, rgba(237,236,232,0.95) 62%, #EDECE8 100%)',
        }}
        aria-hidden="true"
      />

      {/* 컨텐츠 — 하단 고정 */}
      <div className="relative z-10 max-w-md w-full mx-auto px-6 pb-8 text-center" style={{ marginBottom: '8dvh' }}>

        {/* 배지 */}
        <span
          className="inline-block text-xs font-medium tracking-wide mb-5 px-3 py-1.5 rounded-full border"
          style={{ color: '#6B6A66', borderColor: '#DDDCD8', background: 'rgba(255,255,255,0.85)' }}
        >
          독서도 장비빨?
        </span>

        {/* 제목 */}
        <h1
          className="text-[2.1rem] font-bold leading-tight mb-4 tracking-tight"
          style={{ color: '#1C1B18' }}
        >
          이북리더기 지름신 판독기
        </h1>

        {/* 부제 + 모델명 티커 */}
        <div className="mb-8">
          <p className="font-medium mb-1" style={{ color: '#6B6A66', fontSize: '1.1rem' }}>
            구매하면 독서량이 정말 늘어날까요?
          </p>
          <div className="overflow-hidden" style={{ height: '2.6rem' }}>
            <span
              className={phase === 'exit' ? 'ticker-exit' : phase === 'enter' ? 'ticker-enter' : ''}
              style={{
                display: 'inline-block',
                color: '#1C1B18',
                fontWeight: 700,
                fontSize: '1.8rem',
                lineHeight: '2.6rem',
                letterSpacing: '-0.03em',
              }}
            >
              {MODELS[idx]}
            </span>
          </div>
        </div>

        {/* 태그 힌트 */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {['6인치 vs 7인치', '흰둥이 vs 검둥이', '물리키 여부'].map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full border"
              style={{ color: '#6B6A66', borderColor: '#DDDCD8', background: 'rgba(255,255,255,0.85)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={onStart}
          className="w-full py-4 px-8 text-white font-bold text-lg rounded-2xl transition-all duration-150 active:scale-95"
          style={{
            background: '#1C1B18',
            boxShadow: '0 4px 20px rgba(28,27,24,0.2)',
          }}
        >
          내 맞춤 기기 찾기 →
        </button>

        <p className="mt-4 text-xs" style={{ color: '#9A9994' }}>약 1분 소요 · 5가지 질문</p>
      </div>
    </div>
  )
}
