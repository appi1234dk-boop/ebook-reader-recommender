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
      className="relative flex flex-col items-center justify-center overflow-hidden gap-10"
      style={{
        minHeight: '100dvh',
        backgroundImage: 'url(/ereader-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* 화이트 오버레이 — 이미지 위에 은은하게 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,1) 78%)',
        }}
      />

      {/* AI 오브 */}
      <div className="relative z-10 flex flex-col items-center" style={{ marginTop: '6dvh' }}>
        <div className="relative w-52 h-52 flex items-center justify-center">
          {/* 교차 파동 선들 */}
          <div className="absolute inset-0 border border-indigo-400 ai-wave-1 opacity-60" />
          <div className="absolute inset-0 border border-blue-400 ai-wave-2 opacity-60" />
          <div className="absolute inset-0 border border-purple-400 ai-wave-3 opacity-60" />
          <div className="absolute inset-0 border border-cyan-400 ai-wave-4 opacity-60" />

          {/* 중앙 글로우 */}
          <div className="absolute inset-4 bg-indigo-200 rounded-full blur-2xl opacity-20 animate-pulse" />

          {/* 중앙 텍스트 */}
          <div className="z-10 flex flex-col items-center px-4">
            <span
              className="text-[9px] font-mono tracking-widest mb-1.5"
              style={{ color: '#6366f1' }}
            >
              AI 추천
            </span>
            <div className="overflow-hidden w-full text-center" style={{ height: '1.8rem' }}>
              <span
                className={phase === 'exit' ? 'ticker-exit' : phase === 'enter' ? 'ticker-enter' : ''}
                style={{
                  display: 'inline-block',
                  color: '#1C1B18',
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: '1.8rem',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {MODELS[idx]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 컨텐츠 */}
      <div className="relative z-10 max-w-md w-full mx-auto px-6 pb-8 text-center" style={{ marginBottom: '4dvh' }}>
        {/* 태그 힌트 — 무한 스크롤 */}
        <div className="overflow-hidden w-full mb-8">
          <div className="marquee-track flex gap-2 w-max">
            {['6인치 vs 7인치', '흰둥이 vs 검둥이', '물리키 여부', '플랫 vs 논플랫', '스타일러스 펜 여부', '안드로이드 버전', '흑백 vs 컬러', '바형 이북리더기',
              '6인치 vs 7인치', '흰둥이 vs 검둥이', '물리키 여부', '플랫 vs 논플랫', '스타일러스 펜 여부', '안드로이드 버전', '흑백 vs 컬러', '바형 이북리더기'].map((tag, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full border whitespace-nowrap"
                style={{ color: '#6B6A66', borderColor: '#DDDCD8', background: 'rgba(255,255,255,0.85)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* 제목 */}
        <h1
          className="text-[2.1rem] font-bold leading-tight mb-4 tracking-tight"
          style={{ color: '#1C1B18' }}
        >
          이북리더기 살까말까?
        </h1>

        {/* 부제 */}
        <p className="font-medium mb-8" style={{ color: '#6B6A66', fontSize: '1.1rem' }}>
          북덕살롱 AI가 추천하는 인생 리더기
        </p>

        

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

        <p className="mt-4 text-xs" style={{ color: '#9A9994' }}>약 1분 소요 · 4가지 질문</p>
      </div>
    </div>
  )
}
