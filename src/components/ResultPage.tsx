'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'
import type { RecommendationResult } from '@/lib/types'
import { DeviceCard } from './DeviceCard'


interface ResultPageProps {
  result: RecommendationResult
  onRestart: () => void
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [secretVisible, setSecretVisible] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{ isDown: boolean; startX: number; startScroll: number; moved: boolean }>({
    isDown: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  })

  // 마운트 후 캐러셀이 살짝 우측으로 움직였다가 돌아오는 nudge — "스와이프 가능" 시각 힌트
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const t1 = setTimeout(() => {
      el.scrollTo({ left: 120, behavior: 'smooth' })
    }, 900)
    const t2 = setTimeout(() => {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    }, 1700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // PC 마우스 클릭 드래그로 캐러셀 스와이프
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    // 카드 내부의 버튼·링크 위에서 시작된 클릭은 드래그로 가로채지 않음
    if ((e.target as HTMLElement).closest('button, a')) return
    const el = carouselRef.current
    if (!el) return
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    }
    el.style.cursor = 'grabbing'
    el.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current
    if (!s.isDown) return
    const el = carouselRef.current
    if (!el) return
    const walk = e.clientX - s.startX
    if (Math.abs(walk) > 10) s.moved = true
    el.scrollLeft = s.startScroll - walk
  }, [])

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStateRef.current
    if (!s.isDown) return
    const el = carouselRef.current
    s.isDown = false
    if (el) {
      el.style.cursor = ''
      try { el.releasePointerCapture(e.pointerId) } catch { /* noop */ }
      // 드래그 거리에 따라 가장 가까운 카드로 snap
      const walk = e.clientX - s.startX
      if (s.moved && Math.abs(walk) > 40) {
        const cardWidth = el.clientWidth * 0.88 + 12 // 카드 88% + gap 12px
        const targetIndex = walk < 0 ? 1 : 0
        el.scrollTo({ left: targetIndex * cardWidth, behavior: 'smooth' })
      } else if (s.moved) {
        // 작은 움직임은 원위치
        const cardWidth = el.clientWidth * 0.88 + 12
        const currentIndex = Math.round(el.scrollLeft / cardWidth)
        el.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' })
      }
    }
  }, [])

  // 드래그 후 click 이벤트를 무시 (카드 내부 "자세히 보기" 등이 드래그 끝에서 트리거되는 것 방지)
  const handleClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.moved) {
      e.stopPropagation()
      e.preventDefault()
      dragStateRef.current.moved = false
    }
  }, [])

  const getShareUrl = useCallback(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const params = new URLSearchParams({
      ref: 'share',
      rate: String(result.probability),
      type: result.readingType.code,
    })
    return `${base}?${params.toString()}`
  }, [result.probability, result.readingType.code])

  const handleShare = useCallback(() => {
    track('share_click', {
      type: result.resultType,
      reading_type: result.readingType.code,
      rate: result.probability,
      primary_score: result.primaryScore,
      max_score: result.maxScore,
    })

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
    <div className="min-h-screen flex flex-col" style={{ background: '#EDECE8' }}>
      {/* 스크롤되는 콘텐츠 영역 */}
      <div className="flex-1 w-full max-w-md mx-auto px-5 pt-8 pb-4">
        {/* 공유용 헤더 카드 */}
        <div
          className="rounded-2xl border overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)',
            borderColor: '#DDDCD8',
          }}
        >
          <div className="px-5 pt-6 pb-6 text-center">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
              style={{ background: '#1C1B18', color: '#FFFFFF' }}
            >
              📖 당신의 독서 유형
            </div>
            <h2 className="text-[1.7rem] font-black leading-tight mb-2.5" style={{ color: '#1C1B18' }}>
              {result.readingType.name}
            </h2>
            <p className="text-sm leading-relaxed px-2" style={{ color: '#6B6A66' }}>
              {result.readingType.subtitle}
            </p>
          </div>
        </div>

        {/* 점수가 너무 낮을 때 — 라인업에 딱 맞는 기기가 없음을 안내 */}
        {result.isLowMatch && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl border flex gap-3 items-start"
            style={{ background: '#FFF8EC', borderColor: '#F0DCA8' }}
          >
            <span className="text-lg leading-none mt-0.5">💡</span>
            <div className="flex-1">
              <p className="text-sm font-bold leading-snug mb-0.5" style={{ color: '#8A6500' }}>
                조건에 딱 맞는 기기가 없어요
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#A38033' }}>
                선택하신 조건을 모두 충족하는 기기는 없지만, 가장 가까운 기기를 추천드려요.
              </p>
            </div>
          </div>
        )}

        {/* peek 캐러셀 — 1·2위 카드 */}
        <div className="mb-2">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-5 px-5 pb-4 scrollbar-hide select-none"
            style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
          >
            <DeviceCard
              device={result.primary}
              rank={1}
              score={result.primaryScore}
              maxScore={result.maxScore}
              matchCount={result.primaryMatchCount}
              matchedKeywords={result.primaryMatchedKeywords}
              aiReason={result.aiContent?.reason}
              fallbackReasons={result.primaryReasons}
              isLowMatch={result.isLowMatch}
            />
            <DeviceCard
              device={result.secondary}
              rank={2}
              score={result.secondaryScore}
              maxScore={result.maxScore}
              matchCount={result.secondaryMatchCount}
              matchedKeywords={result.secondaryMatchedKeywords}
              aiReason={undefined}
              fallbackReasons={result.secondaryReasons}
              isLowMatch={result.isLowMatch}
            />
          </div>
        </div>

        {/* 다시하기 */}
        <button
          onClick={onRestart}
          className="w-full py-3 text-sm font-medium transition-colors"
          style={{ color: '#9A9994' }}
        >
          다시 테스트하기
        </button>
      </div>

      {/* 하단 고정 CTA: 말풍선 + 공유 버튼 */}
      <div
        className="sticky bottom-0 px-5 pt-8 pb-6"
        style={{
          background:
            'linear-gradient(to top, #EDECE8 0%, #EDECE8 55%, rgba(237,236,232,0) 100%)',
        }}
      >
        <div className="w-full max-w-md mx-auto">
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
              무료 다운로드
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
