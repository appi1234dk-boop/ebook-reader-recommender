@AGENTS.md

# Analytics

이벤트 로그는 Supabase에서 Google Sheets로 이전됨 (2026-04-29).

- **Sheet ID**: `1ILGtS6bHHRLafOAjh-lObPsxdNp95Q5SHlt2RlpxKj0`
- **Sheet name**: `events`
- **Columns**: `id, session_id, event_type, data_json, referrer, utm_source, created_at`
- **Owner**: appi1234dk@gmail.com
- **Webhook**: Google Apps Script 웹앱이 `/api/track` → 시트로 append. URL은 `APPS_SCRIPT_URL` 환경변수
- **Source**: [apps-script/track.gs](apps-script/track.gs) — 시트 컨테이너 바인딩 스크립트
- **이벤트 타입** (현재): `page_view, quiz_start, quiz_answer, quiz_complete, result_view, share_click, share_complete, notion_click`

## 분석 시 주의

- `data_json` 은 JSON 문자열로 저장 — 분석 시 파싱 필요
- `created_at` 은 UTC ISO 8601 (마이그레이션 데이터는 `+00:00`, 신규 데이터는 `Z` 형식)
- 마이그레이션 cutoff: `2026-04-29T13:04Z` 이전은 Supabase 원본, 이후는 Apps Script가 append

## Apps Script 재배포 규칙

코드 수정 후 절대 "새 배포(New deployment)" 만들지 말 것. URL이 바뀌어 환경변수까지 갱신해야 함.
**배포 관리(Manage deployments) → ✏️ 편집(Edit) → 새 버전(New version) → 배포(Deploy)** 로만 갱신.
