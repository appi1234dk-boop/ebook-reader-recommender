import type { NextRequest } from 'next/server'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const { session_id, event_type, data, referrer, utm_source } = body

    if (!session_id || typeof session_id !== 'string') {
      return Response.json({ error: 'invalid session_id' }, { status: 400 })
    }
    if (!event_type || typeof event_type !== 'string') {
      return Response.json({ error: 'invalid event_type' }, { status: 400 })
    }
    if (!APPS_SCRIPT_URL) {
      console.error('[track] APPS_SCRIPT_URL not configured')
      return Response.json({ error: 'not configured' }, { status: 500 })
    }

    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id,
        event_type,
        data: data ?? {},
        referrer: referrer ?? null,
        utm_source: utm_source ?? null,
      }),
      redirect: 'follow',
    })

    if (!res.ok) {
      console.error('[track] Apps Script error:', res.status, await res.text())
      return Response.json({ error: 'sheet error' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track] Unexpected error:', err)
    return Response.json({ error: 'unexpected error' }, { status: 500 })
  }
}
