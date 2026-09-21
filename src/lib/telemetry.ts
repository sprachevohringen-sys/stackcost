'use client';

export interface TelemetryEvent {
  type: 'pageview' | 'model_calculated' | 'cloud_calculated' | 'gpu_calculated' | 'affiliate_clicked' | 'budget_summary_copied';
  timestamp?: number;
  referrer?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = (type: TelemetryEvent['type'], metadata?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const eventData: TelemetryEvent = {
    type,
    timestamp: Date.now(),
    referrer: document.referrer || 'Direct / Organic',
    metadata: metadata || {},
  };

  try {
    const payload = JSON.stringify(eventData);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', payload);
    } else {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  } catch (err) {
    // Telemetry errors should never interrupt user experience
    console.debug('Telemetry logging silently failed', err);
  }
};
