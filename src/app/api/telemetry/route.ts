import { NextResponse } from 'next/server';
import { saveEvent, computeDeepAnalytics, getStoredEvents } from '@/lib/telemetryStorage';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract headers if available (country, user-agent)
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const userAgent = request.headers.get('user-agent') || '';
    const device = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';

    const saved = saveEvent({
      type: body.type || 'pageview',
      sessionId: body.sessionId || 'anon_' + Math.random().toString(36).substring(2, 8),
      country,
      device,
      referrer: body.referrer || 'Direct',
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, eventId: saved.id });
  } catch (error) {
    console.error('Telemetry POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed storing event' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode');

    // If AI export mode is requested, return raw clean JSON for agent analysis
    if (mode === 'ai-export') {
      const allEvents = getStoredEvents();
      const analytics = computeDeepAnalytics();
      return NextResponse.json({
        exportDate: new Date().toISOString(),
        systemName: 'StackCost Intelligence',
        totalEventsCount: allEvents.length,
        summary: analytics.metrics,
        funnel: analytics.funnel,
        migrationFlows: analytics.migrationFlows,
        topAffiliates: analytics.affiliateBreakdown,
        referrers: analytics.referrerBreakdown,
        countries: analytics.countryBreakdown,
        aiGrowthRecommendations: analytics.strategicInsights,
        rawEventsSample: allEvents.slice(0, 50),
      });
    }

    const analytics = computeDeepAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Telemetry GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed computing analytics' }, { status: 500 });
  }
}
