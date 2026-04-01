import { createServerClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

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

    const supabase = await createServerClient()
    const { error } = await supabase.from('analytics_events').insert({
      session_id,
      event_type,
      data: data ?? {},
      referrer: referrer ?? null,
      utm_source: utm_source ?? null,
    })

    if (error) {
      console.error('[track] Supabase insert error:', error.message)
      return Response.json({ error: 'db error' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track] Unexpected error:', err)
    return Response.json({ error: 'unexpected error' }, { status: 500 })
  }
}
