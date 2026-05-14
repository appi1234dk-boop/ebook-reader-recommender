'use client'

import { useState } from 'react'
import type { Device } from '@/lib/types'

interface DeviceCardProps {
  device: Device
  rank: 1 | 2
  score: number
  maxScore: number
  matchCount: number
  matchedKeywords: string[]
  aiReason?: string
  fallbackReasons: string[]
  isLowMatch?: boolean
}

export function DeviceCard({
  device,
  rank,
  score,
  maxScore,
  matchCount,
  matchedKeywords,
  aiReason,
  fallbackReasons,
  isLowMatch = false,
}: DeviceCardProps) {
  const gaugePct = Math.max(0, Math.min(100, (score / maxScore) * 100))
  const [expanded, setExpanded] = useState(false)

  const rankEmoji = rank === 1 ? '🥇' : '🥈'
  const rankLabel = rank === 1 ? '1순위' : '2순위'

  const fullReason = aiReason ?? fallbackReasons.join(' ')
  const keywordLine = matchedKeywords.length > 0
    ? matchedKeywords.slice(0, 3).join(' · ')
    : null

  return (
    <div
      className="snap-center shrink-0 rounded-2xl border overflow-hidden"
      style={{ background: '#FFFFFF', borderColor: '#DDDCD8', width: '88%' }}
    >
      {/* 순위 뱃지 */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: '#1C1B18', color: '#FFFFFF' }}
        >
          {rankEmoji} {rankLabel} 추천
        </span>
        <span className="text-xs font-medium" style={{ color: '#9A9994' }}>
          {device.size} · {device.releaseYear}
        </span>
      </div>

      {/* 제품 이미지 */}
      <div className="relative w-full bg-[#F3F2EF] mt-3" style={{ aspectRatio: '4 / 3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={device.imageUrl}
          alt={device.name}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* 기본 정보 */}
      <div className="px-4 pt-4 pb-1">
        <p className="text-lg font-black leading-snug" style={{ color: '#1C1B18' }}>
          {device.brand} {device.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#9A9994' }}>
          {device.priceRange}
        </p>
      </div>

      {/* 추천 점수 게이지 (일반) 또는 매칭 카운트 강조 (low match) */}
      {isLowMatch ? (
        <div className="px-4 pt-4">
          <p className="text-base font-bold leading-snug" style={{ color: '#1C1B18' }}>
            6개 답변 중,{' '}
            <span style={{ color: '#5B4EFF' }}>{matchCount}개</span>
            {' '}조건이 일치해요
          </p>
        </div>
      ) : (
        <div className="px-4 pt-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: '#6B6A66' }}>
              추천 점수
            </span>
            <span className="font-black tabular-nums" style={{ color: '#5B4EFF' }}>
              <span className="text-lg">{score}</span>
              <span className="text-xs" style={{ color: '#9A9994' }}> / {maxScore}점</span>
            </span>
          </div>
          <div
            className="relative w-full h-2 rounded-full overflow-hidden"
            style={{ background: '#F3F2EF' }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{ width: `${gaugePct}%`, background: '#5B4EFF' }}
            />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: '#9A9994' }}>
            당신 답변 6개 중 <strong style={{ color: '#1C1B18' }}>{matchCount}개</strong>와 매칭됐어요
          </p>
        </div>
      )}

      {/* 객관 매칭 키워드 */}
      {keywordLine && (
        <div
          className="mx-4 mt-4 px-3 py-2.5 rounded-xl"
          style={{ background: '#EEF0FF' }}
        >
          <p className="text-[11px] mb-0.5" style={{ color: '#6B6A66' }}>
            일치하는 조건
          </p>
          <p className="text-sm font-semibold leading-snug" style={{ color: '#5B4EFF' }}>
            {keywordLine}
          </p>
        </div>
      )}

      {/* 펼침 토글 */}
      {fullReason && (
        <div className="px-4 mt-3 pb-4">
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold"
            style={{ color: '#6B6A66' }}
          >
            <span>{expanded ? '간단히 보기' : 'AI 추천 이유 자세히 보기'}</span>
            <span
              className="transition-transform"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▾
            </span>
          </button>
          <div
            className="grid transition-all duration-300"
            style={{
              gridTemplateRows: expanded ? '1fr' : '0fr',
            }}
          >
            <div className="overflow-hidden">
              <div className="pt-2 border-t" style={{ borderColor: '#F3F2EF' }}>
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold mb-2"
                  style={{ background: '#EEF0FF', color: '#5B4EFF' }}
                >
                  🤖 북덕살롱 AI 추천
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6A66' }}>
                  {fullReason}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
