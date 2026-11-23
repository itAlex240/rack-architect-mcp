export const UI_TELEMETRY_EVENTS = [
  'stl_download',
  'bracket_stl_download',
  'labels_download',
  'file_import',
  'share_card_export',
  'custom_blueprint_register',
] as const;

export type UiEventName = (typeof UI_TELEMETRY_EVENTS)[number];

/**
 * Fires a privacy-first, zero-PII same-origin UI event ping (`POST /api/ui-event`).
 * Skips static GitHub Pages builds, `file:` URLs, and headless test runners.
 */
export function trackUiEvent(event: UiEventName): void {
  if (typeof window === 'undefined' || typeof fetch !== 'function') {
    return;
  }
  const { protocol, hostname } = window.location;
  if (protocol !== 'http:' && protocol !== 'https:') {
    return;
  }
  if (hostname.endsWith('github.io')) {
    return;
  }
  if (
    typeof navigator !== 'undefined' &&
    (navigator.userAgent.includes('jsdom') ||
      navigator.userAgent.includes('HappyDOM'))
  ) {
    return;
  }

  try {
    void fetch('/api/ui-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Telemetry is strictly best-effort and must never interrupt user actions
  }
}
