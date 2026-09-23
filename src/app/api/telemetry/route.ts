import { NextResponse } from 'next/server';
import { saveEvent, computeDeepAnalytics, getStoredEvents } from '@/lib/telemetryStorage';
import { isAuthenticatedAdmin } from '@/lib/adminAuth';

function resolveLocationFromTimezone(tz?: string): { country: string; city: string; region: string } {
  if (!tz) return { country: 'TR', city: 'Yerel Ziyaretçi', region: '' };

  const map: Record<string, { country: string; city: string; region: string }> = {
    'America/Los_Angeles': { country: 'US', city: 'San Francisco', region: 'California' },
    'America/New_York': { country: 'US', city: 'New York', region: 'New York' },
    'America/Chicago': { country: 'US', city: 'Chicago', region: 'Illinois' },
    'America/Denver': { country: 'US', city: 'Denver', region: 'Colorado' },
    'America/Phoenix': { country: 'US', city: 'Phoenix', region: 'Arizona' },
    'America/Toronto': { country: 'CA', city: 'Toronto', region: 'Ontario' },
    'America/Vancouver': { country: 'CA', city: 'Vancouver', region: 'British Columbia' },
    'Europe/London': { country: 'GB', city: 'London', region: 'England' },
    'Europe/Berlin': { country: 'DE', city: 'Berlin', region: 'Berlin' },
    'Europe/Frankfurt': { country: 'DE', city: 'Frankfurt', region: 'Hesse' },
    'Europe/Paris': { country: 'FR', city: 'Paris', region: 'Île-de-France' },
    'Europe/Amsterdam': { country: 'NL', city: 'Amsterdam', region: 'North Holland' },
    'Europe/Istanbul': { country: 'TR', city: 'Istanbul', region: 'Marmara' },
    'Europe/Zurich': { country: 'CH', city: 'Zurich', region: 'Zurich' },
    'Asia/Tokyo': { country: 'JP', city: 'Tokyo', region: 'Kanto' },
    'Asia/Singapore': { country: 'SG', city: 'Singapore', region: 'Singapore' },
    'Asia/Kolkata': { country: 'IN', city: 'Bengaluru', region: 'Karnataka' },
    'Australia/Sydney': { country: 'AU', city: 'Sydney', region: 'New South Wales' },
  };

  if (map[tz]) return map[tz];

  // Heuristic based on timezone prefix
  if (tz.startsWith('Europe/Istanbul') || tz === 'Turkey') return { country: 'TR', city: 'Istanbul', region: 'Türkiye' };
  if (tz.startsWith('America/')) return { country: 'US', city: tz.replace('America/', '').replace('_', ' '), region: 'ABD' };
  if (tz.startsWith('Europe/')) return { country: 'DE', city: tz.replace('Europe/', '').replace('_', ' '), region: 'Avrupa' };
  if (tz.startsWith('Asia/')) return { country: 'SG', city: tz.replace('Asia/', '').replace('_', ' '), region: 'Asya' };

  return { country: 'TR', city: 'Yerel', region: '' };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Resolve Country, City, Region from Vercel Edge Headers or Timezone
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    const vercelRegion = request.headers.get('x-vercel-ip-country-region');
    const vercelCity = request.headers.get('x-vercel-ip-city');

    let country = vercelCountry || body.country;
    let city = vercelCity ? decodeURIComponent(vercelCity) : body.city;
    let region = vercelRegion || body.region;

    if (!country && body.timezone) {
      const loc = resolveLocationFromTimezone(body.timezone);
      country = loc.country;
      city = loc.city;
      region = loc.region;
    } else if (!country) {
      country = 'TR';
      city = 'Yerel';
      region = '';
    }

    // 2. Resolve Device, OS, Browser
    const userAgent = request.headers.get('user-agent') || body.userAgent || '';
    let device = body.device;
    if (!device) {
      device = /mobile|iphone|android/i.test(userAgent) ? 'Mobil (Mobile)' : 'Masaüstü (Desktop)';
    }

    let os = body.os;
    if (!os) {
      if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
      else if (/windows/i.test(userAgent)) os = 'Windows';
      else if (/linux/i.test(userAgent)) os = 'Linux';
      else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
      else if (/android/i.test(userAgent)) os = 'Android';
      else os = 'Diğer';
    }

    let browser = body.browser;
    if (!browser) {
      if (/edg/i.test(userAgent)) browser = 'Microsoft Edge';
      else if (/chrome|crios/i.test(userAgent)) browser = 'Google Chrome';
      else if (/safari/i.test(userAgent)) browser = 'Apple Safari';
      else if (/firefox|fxios/i.test(userAgent)) browser = 'Mozilla Firefox';
      else browser = 'Diğer';
    }

    const saved = saveEvent({
      type: body.type || 'pageview',
      sessionId: body.sessionId || 'anon_' + Math.random().toString(36).substring(2, 8),
      country,
      city: city || 'Belirsiz',
      region: region || '',
      device,
      os,
      browser,
      referrer: body.referrer || 'Doğrudan / Organik',
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
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        activeVisitors: analytics.activeVisitors,
        migrationFlows: analytics.migrationFlows,
        topAffiliates: analytics.affiliateBreakdown,
        referrers: analytics.trafficSources,
        countries: analytics.countries,
        cities: analytics.cities,
        devices: analytics.devices,
        realtimeStream: analytics.realtimeStream,
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
