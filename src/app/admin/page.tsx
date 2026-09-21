'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Calculator, 
  MousePointerClick, 
  TrendingUp, 
  RefreshCw, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Clock,
  Compass
} from 'lucide-react';

interface TelemetryData {
  metrics: {
    totalPageviews: number;
    totalCalculations: number;
    totalAffiliateClicks: number;
    conversionRate: string;
  };
  affiliateBreakdown: Record<string, number>;
  referrerBreakdown: Record<string, number>;
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: number;
    referrer: string;
    metadata: Record<string, any>;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch telemetry', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-poll telemetry every 15 seconds
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  StackCost Intelligence Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time visitor behavior, calculations, and affiliate conversion tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">
              Updated at: {lastRefreshed || 'Just now'}
            </span>
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 4 Big KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Visitors</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {data?.metrics.totalPageviews || 0}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Real-time active sessions
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Calculations Run</span>
              <Calculator className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {data?.metrics.totalCalculations || 0}
            </div>
            <span className="text-[11px] text-slate-400">
              AI, Cloud & GPU simulations
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Affiliate Clicks</span>
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {data?.metrics.totalAffiliateClicks || 0}
            </div>
            <span className="text-[11px] text-emerald-300 font-medium">
              Outbound referral leads generated
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
              <BarChart3 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {data?.metrics.conversionRate || '0.0'}%
            </div>
            <span className="text-[11px] text-slate-400">
              Clicks per 100 visitors
            </span>
          </div>
        </div>

        {/* Middle Section: Referral Sources & Affiliate Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Outbound Affiliate Clicks Breakdown (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
                <span>Partner Commission Triggers</span>
              </h3>
              <span className="text-xs text-slate-500">By partner</span>
            </div>

            <div className="space-y-3">
              {data?.affiliateBreakdown && Object.keys(data.affiliateBreakdown).length > 0 ? (
                Object.entries(data.affiliateBreakdown).map(([partner, count]) => (
                  <div key={partner} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">{partner}</span>
                      <span className="text-xs text-slate-400 block mt-0.5">High-ticket referral deal</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-emerald-400">{count} clicks</span>
                      <span className="text-[11px] text-slate-500 block">Active leads</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">
                  Waiting for outbound affiliate clicks...
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources & Referrers (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Traffic Origins & Referrers</span>
              </h3>
              <span className="text-xs text-slate-500">Source tracking</span>
            </div>

            <div className="space-y-3">
              {data?.referrerBreakdown && Object.keys(data.referrerBreakdown).length > 0 ? (
                Object.entries(data.referrerBreakdown).map(([source, count]) => (
                  <div key={source} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">{source}</span>
                    <span className="text-sm font-mono font-bold text-teal-400">{count} events</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">
                  Tracking incoming traffic sources...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Actionable Insights Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              AI Engine Insights & Growth Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <span className="text-emerald-400 font-bold block">1. LLM Token Arbitrage Hook</span>
              <p className="text-slate-400 leading-relaxed">
                Users calculating DeepSeek V3 vs GPT-4o have the highest click-through rate. Focus Reddit posts on "How DeepSeek saves 90% on API bills".
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <span className="text-teal-400 font-bold block">2. DigitalOcean $200 Perk</span>
              <p className="text-slate-400 leading-relaxed">
                The $200 free credit badge is driving 60% of all cloud server clicks. Consider featuring Vultr $100 alongside it for A/B conversion tests.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <span className="text-sky-400 font-bold block">3. Directory Submissions</span>
              <p className="text-slate-400 leading-relaxed">
                Submitting to Toolify and There&apos;s An AI For That will immediately scale organic US traffic from high-intent indie hackers.
              </p>
            </div>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Real-Time User Activity Log (Last 25 Events)</span>
            </h3>
            <span className="text-xs text-slate-500">Live feed</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
            {data?.recentEvents && data.recentEvents.length > 0 ? (
              data.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.type === 'affiliate_clicked'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : event.type === 'pageview'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-300">
                      {event.metadata.partnerName
                        ? `Clicked ${event.metadata.partnerName} (${event.metadata.cta || 'CTA'})`
                        : event.metadata.model
                        ? `Calculated ${event.metadata.model}`
                        : event.metadata.tier
                        ? `Configured ${event.metadata.tier}`
                        : `Visited ${event.metadata.path || '/'}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span>From: {event.referrer}</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-6 text-center">No telemetry recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
