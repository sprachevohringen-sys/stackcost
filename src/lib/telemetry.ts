'use client';

export interface TelemetryEventPayload {
  type: 'pageview' | 'calculation' | 'affiliate_click' | 'budget_summary_copied' | 'heartbeat';
  referrer?: string;
  metadata?: Record<string, any>;
}

// Generate or retrieve persistent anonymous session ID
export function getSessionId(): string {
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

export function getClientDetails() {
  if (typeof window === 'undefined') return {};
  const ua = navigator.userAgent;
  
  let device = 'Masaüstü (Desktop)';
  if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  else if (/mobile|iphone|android/i.test(ua)) device = 'Mobil (Mobile)';

  let os = 'Diğer';
  if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';

  let browser = 'Diğer';
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {}

  const language = navigator.language || 'tr';
  const screenResolution = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;

  return { device, os, browser, timezone, language, screenResolution };
}

export const trackEvent = (type: TelemetryEventPayload['type'], metadata?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const clientInfo = getClientDetails();

  const payload = {
    type,
    sessionId: getSessionId(),
    referrer: document.referrer || 'Doğrudan / Organik',
    ...clientInfo,
    metadata: {
      path: window.location.pathname,
      ...metadata,
    },
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

// Start a lightweight presence heartbeat that pings every 25 seconds while tab is active
export const startPresenceHeartbeat = (getActiveSection: () => string) => {
  if (typeof window === 'undefined') return () => {};

  const sendPing = () => {
    if (document.visibilityState === 'visible') {
      trackEvent('heartbeat', {
        activeSection: getActiveSection(),
        tab: getActiveSection(),
      });
    }
  };

  // Immediate initial heartbeat ping
  sendPing();

  const timer = setInterval(sendPing, 25000);
  return () => clearInterval(timer);
};
