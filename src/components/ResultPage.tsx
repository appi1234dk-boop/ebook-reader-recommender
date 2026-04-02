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

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: '#EDECE8' }}>
      <div className="max-w-md w-full">
        {/* 독서 유형 헤더 */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: '#1C1B18', color: '#FFFFFF' }}
          >
            📖 당신의 독서 유형
          </div>
          <h2 className="text-3xl font-black leading-snug mb-4" style={{ color: '#1C1B18' }}>
            {result.aiContent?.readingType ?? result.resultType}
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#6B6A66' }}>
            {result.aiContent?.usage ?? result.description}
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px mb-6" style={{ background: '#DDDCD8' }} />

        {/* 추천 기기 */}
        <div className="mb-8">
          {(() => {
            const device = result.primary
            const reasons = result.primaryReasons
            return (
              <div
                className="w-full rounded-2xl border overflow-hidden"
                style={{ background: '#FFFFFF', borderColor: '#DDDCD8' }}
              >
                {/* 제품 이미지 */}
                <div className="relative w-full bg-[#F3F2EF]" style={{ aspectRatio: '1 / 1' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={device.imageUrl}
                    alt={device.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>

                {/* 텍스트 정보 */}
                <div className="px-5 py-5 flex flex-col gap-1">
                  <p className="text-sm font-semibold" style={{ color: '#5B4EFF' }}>
                    {device.size} / {device.releaseYear} 출시
                  </p>
                  <p className="text-xl font-black leading-snug" style={{ color: '#1C1B18' }}>
                    {device.brand} {device.name}
                  </p>
                  <p className="text-sm" style={{ color: '#9A9994' }}>
                    {device.priceRange}
                  </p>
                  {(result.aiContent?.reason || reasons.length > 0) && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F3F2EF' }}>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold mb-2"
                        style={{ background: '#EEF0FF', color: '#5B4EFF' }}
                      >
                        🤖 북덕살롱 AI 추천
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B6A66' }}>
                        {result.aiContent?.reason ?? reasons.join(' ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
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
