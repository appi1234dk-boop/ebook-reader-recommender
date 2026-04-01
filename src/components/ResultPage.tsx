'use client'

import { useState, useCallback } from 'react'
import { track } from '@/lib/analytics'
import type { RecommendationResult } from '@/lib/types'


interface ResultPageProps {
  result: RecommendationResult
  onRestart: () => void
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [secretVisible, setSecretVisible] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  const toggleCard = useCallback((id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const getShareUrl = useCallback(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const params = new URLSearchParams({
      ref: 'share',
      rate: String(result.probability),
    })
    return `${base}?${params.toString()}`
  }, [result.probability])

  const handleShare = useCallback(() => {
    track('share_click', { type: result.resultType, rate: result.probability })

    const shareUrl = getShareUrl()
    const shareData = {
      url: shareUrl,
    }

    const copyFallback = () => {
      const execCopy = () => {
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (ok) {
          setShareState('copied')
          setTimeout(() => setShareState('idle'), 2500)
          setSecretVisible(true)
          track('share_complete', { method: 'execCommand' })
        }
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setShareState('copied')
          setTimeout(() => setShareState('idle'), 2500)
          setSecretVisible(true)
          track('share_complete', { method: 'clipboard' })
        }).catch(execCopy)
      } else {
        execCopy()
      }
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share(shareData).then(() => {
        track('share_complete', { method: 'native' })
        setSecretVisible(true)
      }).catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        copyFallback()
      })
    } else {
      copyFallback()
    }
  }, [result, getShareUrl])

  const handleNotionClick = useCallback(() => {
    track('notion_click', { type: result.resultType })
  }, [result.resultType])

  // E-ink 스타일: 확률에 따라 다크/미드/라이트 처리
  const badgeStyle =
    result.probability >= 70
      ? { background: '#1C1B18', color: '#FFFFFF' }
      : result.probability >= 50
      ? { background: '#E8E7E3', color: '#4A4946' }
      : { background: '#E8E7E3', color: '#9A9994' }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: '#EDECE8' }}>
      <div className="max-w-md w-full">
        {/* 결과 헤더 */}
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 tabular-nums"
            style={badgeStyle}
          >
            인생템일 확률 {result.probability}%
          </span>
          <h2 className="text-2xl font-black leading-snug mb-4 whitespace-pre-line" style={{ color: '#1C1B18' }}>
            {result.resultType}
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto whitespace-pre-line" style={{ color: '#6B6A66' }}>
            {result.description}
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px mb-6" style={{ background: '#DDDCD8' }} />

        {/* 추천 기기 */}
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: '#9A9994' }}>
          추천 기기
        </h3>
        <div className="flex gap-3 mb-8">
          {[
            { device: result.primary,   badge: '1순위', highlight: true,  reasons: result.primaryReasons   },
            { device: result.secondary, badge: '2순위', highlight: false, reasons: result.secondaryReasons },
          ].map(({ device, badge, highlight, reasons }) => {
            const isFlipped = flippedCards.has(device.id)
            return (
              <div
                key={device.id}
                className="flex-1 rounded-2xl border cursor-pointer select-none"
                style={{
                  perspective: '1000px',
                  height: '320px',
                  borderColor: highlight ? '#1C1B18' : '#DDDCD8',
                }}
                onClick={() => toggleCard(device.id)}
              >
                <div className={`device-card-inner${isFlipped ? ' flipped' : ''}`}>
                  {/* 앞면 */}
                  <div
                    className="device-card-face device-card-front rounded-2xl flex flex-col items-center text-center gap-2 p-4"
                    style={highlight
                      ? { background: '#1C1B18' }
                      : { background: '#FFFFFF' }
                    }
                  >
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={highlight
                        ? { background: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }
                        : { background: '#E8E7E3', color: '#6B6A66' }
                      }
                    >
                      {badge}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={device.imageUrl}
                      alt={device.name}
                      width={130}
                      height={170}
                      className="rounded-lg object-contain flex-1 min-h-0"
                      style={highlight ? { filter: 'brightness(0.9)' } : undefined}
                    />
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: highlight ? 'rgba(255,255,255,0.55)' : '#9A9994' }}>
                        {device.brand}
                      </p>
                      <p className="font-bold text-base leading-tight" style={{ color: highlight ? '#FFFFFF' : '#1C1B18' }}>
                        {device.name}
                      </p>
                    </div>
                  </div>

                  {/* 뒷면 */}
                  <div
                    className="device-card-face device-card-back rounded-2xl flex flex-col p-4 gap-2"
                    style={highlight
                      ? { background: '#1C1B18' }
                      : { background: '#FFFFFF' }
                    }
                  >
                    <p className="text-xs font-bold text-center mb-1" style={{ color: highlight ? 'rgba(255,255,255,0.55)' : '#9A9994' }}>
                      {device.name}
                    </p>
                    <div className="flex flex-col gap-1.5 flex-1 justify-center">
                      {[
                        { label: '화면', value: device.size },
                        { label: '물리버튼', value: device.physicalButton ? 'YES' : 'NO' },
                        { label: '가격대', value: device.priceRange },
                        { label: '출시', value: device.releaseYear },
                        { label: 'Android', value: device.androidVersion },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between gap-1">
                          <span
                            className="text-xs"
                            style={{ color: highlight ? 'rgba(255,255,255,0.45)' : '#9A9994' }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-xs font-semibold text-right"
                            style={{ color: highlight ? '#FFFFFF' : '#1C1B18' }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p
                      className="text-center text-xs mt-1"
                      style={{ color: highlight ? 'rgba(255,255,255,0.3)' : '#DDDCD8' }}
                    >
                      탭하면 돌아가요
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 말풍선 + 공유 버튼 */}
        <div className="relative mb-3">
          <div className="speech-bubble-float flex justify-center mb-3">
            <div
              className="relative inline-flex items-center px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: '#5B4EFF', color: '#FFFFFF' }}
            >
              ⭐️ 2026 이북리더기 최신자료가 무료
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '7px solid #5B4EFF',
                }}
              />
            </div>
          </div>
          <button
            onClick={handleShare}
            className="w-full py-4 text-white font-bold text-base rounded-2xl transition-all duration-150 active:scale-[0.98]"
            style={{ background: '#1C1B18' }}
          >
            {shareState === 'copied' ? '링크가 복사됐어요! ✓' : '친구에게 공유하기 →'}
          </button>
        </div>

        {/* 시크릿 팝업 */}
        {secretVisible && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setSecretVisible(false)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl p-6"
              style={{ background: '#FFFFFF', animation: 'fade-slide-in 0.3s ease both' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSecretVisible(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg font-medium"
                style={{ color: '#9A9994', background: '#F3F2EF' }}
              >
                ×
              </button>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: '#F3F2EF' }}
              >
                🔓
              </div>
              <h2 className="text-2xl font-black mb-2 leading-snug" style={{ color: '#1C1B18' }}>
                공유해주셔서 감사합니다🎉
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B6A66' }}>
                <strong style={{ color: '#1C1B18' }}>2024~2026년 출시된 이북리더기의 스펙</strong>과<br />{' '}
                <strong style={{ color: '#1C1B18' }}>&apos;제품의 장/단점이 상세히 적힌&apos;</strong>자료를 <strong style={{ color: '#1C1B18' }}>무료</strong>로 받아가세요
              </p>
              
              <a
                href="http://bit.ly/4dVhha4"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNotionClick}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-base"
                style={{ background: '#5B4EFF' }}
              >
                31종 이북리더기 자료 열람하기 ↗
              </a>
            </div>
          </div>
        )}

        {/* 다시하기 */}
        <button
          onClick={onRestart}
          className="w-full py-3 text-sm font-medium transition-colors"
          style={{ color: '#9A9994' }}
        >
          다시 테스트하기
        </button>
      </div>
    </div>
  )
}
