CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT        NOT NULL,
  event_type  TEXT        NOT NULL,
  data        JSONB       NOT NULL DEFAULT '{}',
  referrer    TEXT,
  utm_source  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_session_id
  ON analytics_events (session_id);

CREATE INDEX idx_analytics_events_event_type_created
  ON analytics_events (event_type, created_at DESC);

CREATE INDEX idx_analytics_events_utm_source
  ON analytics_events (utm_source)
  WHERE utm_source IS NOT NULL;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- anon 키로 INSERT 허용 (브라우저에서 직접 쓰지 않고 API 라우트 경유)
CREATE POLICY "allow_anon_insert" ON analytics_events
  FOR INSERT TO anon WITH CHECK (true);
