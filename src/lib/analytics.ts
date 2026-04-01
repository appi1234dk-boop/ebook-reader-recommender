'use client'

import type { AnalyticsEventPayload } from './types'

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'ebook_quiz_session'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export function captureUTMParams(): { utm_source: string | null; referrer: string | null } {
  if (typeof window === 'undefined') return { utm_source: null, referrer: null }

  const storageKey = 'ebook_quiz_utm'
  const cached = sessionStorage.getItem(storageKey)
  if (cached) return JSON.parse(cached)

  const params = new URLSearchParams(window.location.search)
  const utm_source = params.get('utm_source') ?? params.get('ref') ?? null
  const referrer = document.referrer || null

  const value = { utm_source, referrer }
  sessionStorage.setItem(storageKey, JSON.stringify(value))
  return value
}

export async function track(
  event_type: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    const session_id = getOrCreateSessionId()
    const { utm_source, referrer } = captureUTMParams()

    const payload: AnalyticsEventPayload = {
      session_id,
      event_type,
      data,
      referrer,
      utm_source,
    }

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // 애널리틱스 오류는 앱 동작에 영향을 주지 않음
  }
}
