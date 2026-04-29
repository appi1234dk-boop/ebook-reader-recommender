// Google Apps Script — analytics_events 시트에 쓰기 webhook
// 배포: 새 배포 → 유형: 웹 앱 → 액세스 권한: "모든 사용자"
// 수정 시: 배포 관리(Manage deployments) → 편집(Edit) → 새 버전 → URL 유지

const SHEET_ID = '1ILGtS6bHHRLafOAjh-lObPsxdNp95Q5SHlt2RlpxKj0';
const SHEET_NAME = 'events';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { session_id, event_type, data, referrer, utm_source } = body;

    if (!session_id || !event_type) {
      return _json({ error: 'invalid payload' });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      Utilities.getUuid(),
      String(session_id),
      String(event_type),
      JSON.stringify(data ?? {}),
      referrer ?? '',
      utm_source ?? '',
      new Date().toISOString(),
    ]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ error: String(err) });
  }
}

function doGet() {
  return _json({ ok: true, hint: 'POST events here' });
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
