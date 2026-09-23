'use client';

import React from 'react';
import { AFFILIATE_CONFIG } from '@/config/affiliates';
import { trackEvent } from '@/lib/telemetry';
import { Gift, ExternalLink, ShieldCheck, Sparkles, Crown } from 'lucide-react';

export const DealGrid: React.FC = () => {
  const deals = Object.values(AFFILIATE_CONFIG);

  return (
    <section id="free-credits" className="py-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Gift className="w-3.5 h-3.5" />
            <span>Developer & Startup Perks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Verified Cloud & AI Promo Credits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Claim over $500+ in official trial compute credits and dev perks directly from partner platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const isDO = deal.id === 'digitalocean';
            return (
              <div
                key={deal.id}
                className={`rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-xl ${
                  isDO
                    ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500 shadow-emerald-500/10 relative'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isDO && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/30">
                    <Crown className="w-3 h-3" />
                    <span>Top Staff Pick • 60 Days Free</span>
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isDO
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {deal.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">
                      {deal.category}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold transition-colors ${isDO ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'}`}>
                      {deal.name}
                    </h3>
                    <div className="text-sm font-semibold text-emerald-300 mt-0.5">
                      {deal.dealHighlight}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Active
                  </span>
                  <a
                    href={deal.referralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('affiliate_click', {
                        partnerId: deal.id,
                        partnerName: deal.name,
                        dealText: deal.dealHighlight,
                        location: 'deal_grid',
                      });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isDO
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{deal.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
