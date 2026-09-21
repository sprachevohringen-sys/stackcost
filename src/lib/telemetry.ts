'use client';

export interface TelemetryEventPayload {
  type: 'pageview' | 'calculation' | 'affiliate_click' | 'budget_summary_copied';
  referrer?: string;
  metadata?: Record<string, any>;
}

// Generate or retrieve persistent anonymous session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = sessionStorage.getItem('sc_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('sc_session_id', sid);
    }
    return sid;
  } catch {
    return 'sess_fallback';
  }
}

export const trackEvent = (type: TelemetryEventPayload['type'], metadata?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const payload = {
    type,
    sessionId: getSessionId(),
    referrer: document.referrer || 'Doğrudan / Organik',
    metadata: metadata || {},
  };

  try {
    const raw = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', raw);
    } else {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
        keepalive: true,
      });
    }
  } catch (err) {
    console.debug('Telemetry logging silently failed', err);
  }
};
